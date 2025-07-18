'use client';

import { getDictionary } from "@/utils/utils";
import { set } from "lodash";
import { createContext, use, useCallback, useContext, useEffect, useState } from "react";

export const languageContext = createContext(null);

export default function LanguageProvider({ children }) {
    const [selectedLanguage, setSelectedLanguage] = useState('vie');
    const [t, setDictionary] = useState({});
    useEffect(() => {

        const fetchDictionary = async () => {
            
            setDictionary(await getDictionary(selectedLanguage));
        }
        fetchDictionary();

    }, [selectedLanguage])

    return (
        <languageContext.Provider value={{selectedLanguage, setSelectedLanguage, t}}>
            {children}
        </languageContext.Provider>
    );
}
export const useLanguage = () => {
    const context = useContext(languageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a languageProvider');
    }
    return context;
};