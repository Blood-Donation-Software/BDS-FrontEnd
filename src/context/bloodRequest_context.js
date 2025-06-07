'use client';

import { getAllRequest, getRequestById } from "@/apis/bloodrequest";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const BloodRequestContext = createContext(null);

export default function BloodRequestProvider({ children }) {
    const [bloodRequests, setBloodRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bloodRequest, setBloodRequest] = useState(null);
    const [id, setId] = useState(null);
    const findBloodRequest = async (id) => {
        setIsLoading(() => true);
        setId(id);
        setBloodRequest(await getRequestById(id));
        setIsLoading(() => false);
    }

    const fetchBloodRequests = async () => {
        try {
            const data = await getAllRequest();
            setBloodRequests(data);
        } catch (error) {
            console.error("Failed to fetch blood requests", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBloodRequests();
    }, []);

    return (
        <BloodRequestContext.Provider value={{ bloodRequests, isLoading, findBloodRequest, bloodRequest, id }}>
            {children}
        </BloodRequestContext.Provider>
    );
}

export const useBloodRequests = () => {
    return useContext(BloodRequestContext);
};
