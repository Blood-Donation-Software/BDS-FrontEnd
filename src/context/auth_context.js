'use client';

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // const storedUser = sessionStorage.getItem("user");
        // console.log(JSON.parse(storedUser));
        // if (storedUser) {
        //     setUser(JSON.parse(storedUser));
        //     if (pathname === "/login") {
        //         router.push("/");
        //     }
        // } else {
        //     if (pathname !== "/login") {
        //         router.push("/login");
        //     }
        // }
    }, []);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
}
