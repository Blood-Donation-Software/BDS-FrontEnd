'use client';

import { createContext, useContext, useState } from "react";

export const DonationEventContext = createContext(null);

export default function DonationEventProvider({ children }) {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedShift, setSelectedShift] = useState(null);
    const [events, setEvents] = useState([
        {
            id: 1,
            name: "Ngày hội hiến máu nhân đạo",
            location: "Trung tâm Y tế Quận 1, TP.HCM",
            date: "15/01/2024",
            isAllDay: true,
            shifts: ["8:00-11:00", "13:00-17:00"]
        },
        {
            id: 2,
            name: "Chương trình hiến máu cứu người",
            location: "Đại học Bách Khoa TP.HCM",
            date: "20/02/2024",
            isAllDay: false,
            shifts: ["8:00-11:00"]
        },
        {
            id: 3,
            name: "Hiến máu tình nguyện vì cộng đồng",
            location: "Trung tâm Hiến máu Nhân đạo TP.HCM",
            date: "10/04/2024",
            isAllDay: false,
            shifts: ["14:00-17:00"]
        },
        {
            id: 4,
            name: "Ngày hội hiến máu sinh viên",
            location: "Đại học Khoa học Tự nhiên",
            date: "10/06/2024",
            isAllDay: false,
            shifts: ["8:00-11:00"]
        },
        {
            id: 5,
            name: "Hiến máu nhân đạo cứu trẻ hoàn cảnh khó khăn",
            location: "Bệnh viện Nhi Đồng 1",
            date: "10/07/2024",
            isAllDay: true,
            shifts: ["8:00-11:00", "13:00-17:00"]
        },
        {
            id: 6,
            name: "Tuần lễ hiến máu toàn quốc",
            location: "Viện Huyết học & Truyền máu TW",
            date: "01/08/2024",
            isAllDay: false,
            shifts: ["14:00-17:00"]
        },
        {
            id: 7,
            name: "Hiến máu tình nguyện mùa hè",
            location: "Đại học Sư Phạm TP.HCM",
            date: "15/08/2024",
            isAllDay: false,
            shifts: ["8:00-11:00"]
        },
        {
            id: 8,
            name: "Chương trình hiến máu khu vực miền Nam",
            location: "Nhà Văn hóa Thanh niên",
            date: "22/09/2024",
            isAllDay: true,
            shifts: ["8:00-11:00", "13:00-17:00"]
        },
        {
            id: 9,
            name: "Hiến máu nhân đạo mùa lễ hội",
            location: "Công viên Lê Văn Tám",
            date: "10/10/2024",
            isAllDay: false,
            shifts: ["14:00-17:00"]
        }
    ]);

    const selectEventById = (eventId) => {
        const event = events.find(e => e.id === parseInt(eventId));
        setSelectedEvent(event);
        setSelectedShift(null); // Reset shift when selecting new event
        return event;
    };

    const selectShift = (shift) => {
        setSelectedShift(shift);
    };

    const clearSelectedEvent = () => {
        setSelectedEvent(null);
        setSelectedShift(null);
    };

    return (
        <DonationEventContext.Provider value={{
            events,
            selectedEvent,
            selectedShift,
            selectEventById,
            selectShift,
            clearSelectedEvent,
            setEvents
        }}>
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