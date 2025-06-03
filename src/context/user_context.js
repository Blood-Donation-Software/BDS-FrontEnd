'use client';

import axiosInstance, { endpoint } from "@/utils/axios";
import { createContext, useState, useEffect, useContext } from "react";

export const UserContext = createContext(null);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    
    const fetchUserProfile = () => {
        try{
            const data = axiosInstance.get(endpoint.user.profile)
            .then(res => res.data);
            setUser(data);
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserProfile() {
  const context = useContext(UserContext);
  return context;
}

