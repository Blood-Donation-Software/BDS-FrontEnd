'use client';

import { useLanguage } from "@/context/language_context";

export default function AuthenticationLayout({children}) {
    const { t } = useLanguage();
    return(
        <div className="flex min-h-screen bg-gray-50">

            {/* Phần overlay làm mờ nền nếu cần */}
            {/* Phần banner bên trái */}
            <div className="hidden md:flex w-1/2 justify-center items-center flex-col px-8">
                <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">HopeWell</h1>
                <h2 className="text-xl font-semibold text-red-600">{t?.greeting?.slogan}</h2>
                <p className="mt-4 text-gray-700 max-w-md">
                    {t?.greeting?.explain}
                </p>
                </div>
            </div>
            

            {/* Phần form đăng ký bên phải */}
            <div className="flex-1 flex items-center justify-center p-8 w-1/2">
                {children}
            </div>
            
        </div>
        
    );
}