'use client';

import axiosInstance, { endpoint } from "@/utils/axios";
import { createContext, useState, useEffect, useContext } from "react";
import { getProfile, getAccount } from '@/apis/user';

export const UserContext = createContext(null);

// Role constants
export const ROLES = {
    GUEST: 'GUEST',
    MEMBER: 'MEMBER', 
    STAFF: 'STAFF',
    ADMIN: 'ADMIN'
};

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
    [ROLES.GUEST]: 0,
    [ROLES.MEMBER]: 1,
    [ROLES.STAFF]: 2,
    [ROLES.ADMIN]: 3
};

export default function UserProvider({ children }) {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [account, setAccount] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(ROLES.GUEST);    
    const fetchUserProfile = async () => {
        try{
            setIsLoading(true);
            const myProfile = await getProfile();
            const myAccount = await getAccount();
            setProfile(myProfile);
            setAccount(myAccount);
            setLoggedIn(true);
            
            // Set user role from account data
            const role = myAccount?.role || ROLES.GUEST;
            setUserRole(role);
        }
        catch(error){
            setLoggedIn(false);
            setProfile(null);
            setAccount(null);
            setUserRole(ROLES.GUEST);
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchUserProfile();
    }, []);    // Role checking functions
    const hasRole = (requiredRole) => {
        return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
    };

    const hasAnyRole = (roles) => {
        return roles.some(role => hasRole(role));
    };

    const isGuest = () => userRole === ROLES.GUEST;
    const isMember = () => userRole === ROLES.MEMBER;
    const isStaff = () => userRole === ROLES.STAFF;
    const isAdmin = () => userRole === ROLES.ADMIN;

    // Logout function that resets role
    const logout = () => {
        setLoggedIn(false);
        setProfile(null);
        setAccount(null);
        setUserRole(ROLES.GUEST);
    };

    return (
        <UserContext.Provider value={{ 
            profile, 
            isLoading, 
            account, 
            fetchUserProfile, 
            setProfile, 
            setAccount, 
            loggedIn, 
            setLoggedIn,
            userRole,
            setUserRole,
            hasRole,
            hasAnyRole,
            isGuest,
            isMember,
            isStaff,
            isAdmin,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserProfile() {
  const context = useContext(UserContext);
  return context;
}

