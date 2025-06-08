'use client';

import { getAllRequest, getRequestById } from "@/apis/bloodrequest";
import { checkStockByType } from "@/apis/bloodStock";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const BloodRequestContext = createContext(null);

export default function BloodRequestProvider({ children }) {
    const [bloodRequests, setBloodRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bloodRequest, setBloodRequest] = useState(null);
    const [id, setId] = useState(null);
    const [requiredBlood, setRequiredBlood] = useState();
    const findBloodRequest = async (id) => {
        setIsLoading(() => true);
        setId(id);
        setBloodRequest(await getRequestById(id));
        setIsLoading(() => false);
    }

    const findRequiredBlood = async () => {
        if (!bloodRequest) return;

        setIsLoading(true);
        const componentTypes = bloodRequest.componentRequests.map(c => c.componentType);
        const result = await checkStockByType(componentTypes, bloodRequest.bloodType);
        setRequiredBlood(result);
        setIsLoading(false);
    };


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
        <BloodRequestContext.Provider value={{ bloodRequests, isLoading, findBloodRequest, bloodRequest, id, findRequiredBlood, requiredBlood }}>
            {children}
        </BloodRequestContext.Provider>
    );
}

export const useBloodRequests = () => {
    return useContext(BloodRequestContext);
};
