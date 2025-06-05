'use client';

import { getAllRequest } from "@/apis/bloodrequest";
import { createContext, useContext, useEffect, useState } from "react";

export const BloodRequestContext = createContext(null);

export default function BloodRequestProvider({ children }) {
    const [bloodRequests, setBloodRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBloodRequests = async () => {
        try {
            const data = await getAllRequest();
            setBloodRequests(data);
        } catch (error) {
            console.error("Failed to fetch blood requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBloodRequests();
    }, []);

    return (
        <BloodRequestContext.Provider value={{ bloodRequests, loading }}>
            {children}
        </BloodRequestContext.Provider>
    );
}

export const useBloodRequests = () => {
    return useContext(BloodRequestContext);
};
