import axiosInstance, { endpoint } from "@/utils/axios"

// Create donation event request
export const createEvent = (event) => {
    return axiosInstance.post(endpoint.bloodDonation.createEvent, event)
        .then(res => res.data);
}

// Get all donation events (approved/public)
export const getAllEvents = (page = 0, size = 10, sortBy = 'id', ascending = true) => {
    const params = { page, size, sortBy, ascending };
    return axiosInstance.get(endpoint.bloodDonation.listEvent, { params })
        .then(res => res.data);
}

// Get ongoing donation events (for staff check-in)
export const getOngoingDonationEvents = () => {
    return axiosInstance.get(endpoint.bloodDonation.ongoingEvents)
        .then(res => res.data);
}

// Get donation events by date range
export const getEventsByDateRange = (startDate, endDate, page = 0, size = 10, sortBy = 'id', ascending = true) => {
    const params = { page, size, sortBy, ascending };
    return axiosInstance.get(`${endpoint.bloodDonation.listEvent}/${startDate}/${endDate}`, { params })
        .then(res => res.data);
}

// Get event details by ID
export const getEventById = (eventId) => {
    return axiosInstance.get(`${endpoint.bloodDonation.listEvent}/${eventId}`)
        .then(res => res.data);
}

// Get my donation event requests
export const getMyRequests = (page = 0, size = 10, sortBy = 'id', ascending = true) => {
    const params = { page, size, sortBy, ascending };
    return axiosInstance.get(endpoint.bloodDonation.getMyRequests, { params })
        .then(res => res.data);
}

// Get pending requests (admin only)
export const getPendingRequests = (page = 0, size = 10, sortBy = 'id', ascending = true) => {
    const params = { page, size, sortBy, ascending };
    return axiosInstance.get(endpoint.bloodDonation.getPendingRequests, { params })
        .then(res => res.data);
}

// Verify donation request (admin only)
export const verifyRequest = (requestId, action) => {
    const params = { action };
    return axiosInstance.put(endpoint.bloodDonation.verifyRequest(requestId), null, { params })
        .then(res => res.data);
}

// Get request details by ID
export const getRequestById = (requestId) => {
    return axiosInstance.get(`${endpoint.bloodDonation.getPendingRequests}/${requestId}`)
        .then(res => res.data);
}

// Get my request details by ID
export const getMyRequestById = (requestId) => {
    return axiosInstance.get(`${endpoint.bloodDonation.getMyRequests}/${requestId}`)
        .then(res => res.data);
}

// Update donation event request
export const updateEventRequest = (eventId, eventData) => {
    return axiosInstance.put(endpoint.bloodDonation.updateEventRequest(eventId), eventData)
        .then(res => res.data);
}

// Delete donation event request
export const deleteEventRequest = (eventId) => {
    return axiosInstance.delete(endpoint.bloodDonation.deleteEventRequest(eventId))
        .then(res => res.data);
}

// Register for donation event
export const registerForEvent = (eventId, timeSlotId, jsonForm) => {
    return axiosInstance.post(endpoint.eventRegistration.register(eventId, timeSlotId), jsonForm, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.data);
}

// Register offline for event (for staff)
export const registerForEventOffline = (eventId, personalId, jsonForm) => {
    return axiosInstance.post(endpoint.eventRegistration.registerOffline(eventId), jsonForm, {
        params: { personalId },
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.data);
}

// Register guest for event (for staff)  
export const registerGuestForEvent = (eventId, profileWithFormData) => {
    return axiosInstance.post(`${endpoint.eventRegistration.registerOffline(eventId).replace('/registerOffline', '/register-guest')}`, profileWithFormData)
        .then(res => res.data);
}

// Cancel event registration
export const cancelEventRegistration = (eventId) => {
    return axiosInstance.post(endpoint.eventRegistration.cancel(eventId))
        .then(res => res.data);
}

// Get checkin token for user registration
export const getCheckinToken = (eventId) => {
    return axiosInstance.get(endpoint.checkin.getToken(eventId))
        .then(res => res.data);
}

// Get donor information from checkin token (for staff)
export const getCheckinInfo = (eventId, checkinToken) => {
    return axiosInstance.get(endpoint.checkin.getInfo(eventId), {
        params: { checkinToken }
    }).then(res => res.data);
}

// Check in donor (for staff)
export const checkInDonor = (eventId, action, checkinToken) => {
    return axiosInstance.post(endpoint.checkin.checkIn(eventId), null, {
        params: { action, checkinToken }
    }).then(res => res.data);
}

// Get event donors (for staff)
export const getEventDonors = (eventId, page = 0, size = 10, sortBy = 'id', ascending = true) => {
    const params = { page, size, sortBy, ascending };
    return axiosInstance.get(`${endpoint.bloodDonation.listEvent}/${eventId}/donors`, { params })
        .then(res => res.data);
}

// Record blood donations for completed event (for staff)
export const recordDonations = (eventId, donationRecords) => {
    const bulkRecordDto = {
        singleBloodUnitRecords: donationRecords
    };
    return axiosInstance.post(endpoint.bloodDonation.recordDonation(eventId), bulkRecordDto)
        .then(res => res.data);
}