'use client';

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getAllEvents } from "@/apis/bloodDonation";
import { getOrganizerById } from "@/apis/organizer";

export const DonationEventContext = createContext(null);

export default function DonationEventProvider({ children }) {    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [events, setEvents] = useState([]);
    const [organizers, setOrganizers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registering, setRegistering] = useState(false);
    const [lastRegistration, setLastRegistration] = useState(null);

    // Load registration data from localStorage on mount
    useEffect(() => {
        const savedRegistration = localStorage.getItem('lastEventRegistration');
        if (savedRegistration) {
            try {
                const registrationData = JSON.parse(savedRegistration);
                setLastRegistration(registrationData);
            } catch (error) {
                console.error('Error parsing saved registration:', error);
                localStorage.removeItem('lastEventRegistration');
            }
        }
    }, []);

    // Memoized fetch function to prevent infinite re-renders
    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log("Fetching events...");
            const res = await getAllEvents();
            
            // Handle different response structures
            let eventsData = [];
            if (Array.isArray(res)) {
                eventsData = res;
            } else if (res && Array.isArray(res.data)) {
                eventsData = res.data;
            } else if (res && res.content && Array.isArray(res.content)) {
                eventsData = res.content;
            } else if (res && res.events && Array.isArray(res.events)) {
                eventsData = res.events;
            } else {
                console.warn("Unexpected API response structure:", res);
                eventsData = [];
            }
            
            console.log("Events fetched:", eventsData.length);
            setEvents(eventsData);
            
            // Fetch organizer details for unique organizer IDs
            const uniqueOrganizerIds = [...new Set(
                eventsData
                    .filter(event => event.organizerId)
                    .map(event => event.organizerId)
            )];
            
            if (uniqueOrganizerIds.length > 0) {
                console.log("Fetching organizers for IDs:", uniqueOrganizerIds);
                await fetchOrganizers(uniqueOrganizerIds);
            }
            
        } catch (error) {
            console.error("Fetch events error:", error);
            setError(error.message || 'Không thể tải danh sách sự kiện');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Separate function to fetch organizers
    const fetchOrganizers = async (organizerIds) => {
        try {
            const organizerPromises = organizerIds.map(async (organizerId) => {
                try {
                    const organizer = await getOrganizerById(organizerId);
                    return { [organizerId]: organizer };
                } catch (error) {
                    console.warn(`Failed to fetch organizer ${organizerId}:`, error);
                    return { [organizerId]: null };
                }
            });
            
            const organizerResults = await Promise.all(organizerPromises);
            const organizersMap = organizerResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
            
            console.log("Organizers fetched:", Object.keys(organizersMap).length);
            setOrganizers(prev => ({ ...prev, ...organizersMap }));
            
        } catch (error) {
            console.error("Error fetching organizers:", error);
        }
    };

    // Fetch events when component mounts
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Event selection functions
    const selectEventById = useCallback((eventId) => {
        const event = events.find(e => e.id === parseInt(eventId));
        if (event) {
            setSelectedEvent(event);
            setSelectedTimeSlot(null); // Reset time slot when selecting new event
            console.log("Event selected:", event.name);
        }
        return event;
    }, [events]);

    const selectTimeSlot = useCallback((timeSlotIndex) => {
        setSelectedTimeSlot(timeSlotIndex);
        console.log("Time slot selected:", timeSlotIndex);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedEvent(null);
        setSelectedTimeSlot(null);
        console.log("Selection cleared");
    }, []);    // Registration state management
    const setRegistrationLoading = useCallback((loading) => {
        setRegistering(loading);
    }, []);

    const saveRegistration = useCallback((registrationData) => {
        const dataToSave = {
            ...registrationData,
            timestamp: new Date().toISOString(),
            eventId: selectedEvent?.id,
            eventName: selectedEvent?.name,
            timeSlot: selectedTimeSlot !== null ? selectedEvent?.timeSlotDtos[selectedTimeSlot] : null
        };
        
        setLastRegistration(dataToSave);
        localStorage.setItem('lastEventRegistration', JSON.stringify(dataToSave));
        console.log('Registration data saved:', dataToSave);
    }, [selectedEvent, selectedTimeSlot]);

    const clearRegistration = useCallback(() => {
        setLastRegistration(null);
        localStorage.removeItem('lastEventRegistration');
    }, []);

    const contextValue = {
        // Data
        events,
        organizers,
        selectedEvent,
        selectedTimeSlot,
        lastRegistration,
        
        // Loading states
        loading,
        error,
        registering,
        
        // Actions
        selectEventById,
        selectTimeSlot,
        clearSelection,
        fetchEvents,
        setRegistrationLoading,
        saveRegistration,
        clearRegistration,
        
        // Setters (for advanced use cases)
        setEvents,
        setSelectedEvent,
    };

    return (
        <DonationEventContext.Provider value={contextValue}>
            {children}
        </DonationEventContext.Provider>
    );
}

export const useDonationEvents = () => {
    const context = useContext(DonationEventContext);
    if (!context) {
        throw new Error('useDonationEvents must be used within a DonationEventProvider');
    }
    return context;
};