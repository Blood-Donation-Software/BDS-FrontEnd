'use client';

import { checkStock } from "@/apis/bloodStock";
import { createContext, useContext, useEffect, useState } from "react";

export const BloodStockContext = createContext(null);

export default function BloodStockProvider({ children }) {
    const [bloodStock, setBloodStock] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const fetchBloodStock = async () => {
        setBloodStock(await checkStock());
        setIsLoading(false);
    };

    useEffect(() => {
        fetchBloodStock();
    }, []);

    return (
        <BloodStockContext.Provider value={{}}>
            {children}
        </BloodStockContext.Provider>
    );
}

export const useBloodStock = () => {
    return useContext(BloodStockContext);
};
