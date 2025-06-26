'use client'

import React, { useContext, useState } from 'react'
import PersonalInformation from '@/sections/ProfileManagement/PersonalInfo/PersonalInfo'
import Security from '@/sections/ProfileManagement/Security/Security'
import { FaUserEdit, FaUser, FaLock } from "react-icons/fa";
import PersonalInfo from '@/sections/ProfileManagement/PersonalInfo/PersonalInfo';
import { UserContext } from '@/context/user_context';
import Link from 'next/link';

export default function ProfileManagement() {
    const [activeSection, setActiveSection] = useState('profile');
    const { profile, loggedIn, account } = useContext(UserContext);

    const handleChange = (section) => {
        setActiveSection(section);
    }

    const bloodType = () => {
        switch (profile.bloodType) {
            case '':
                return 'O+'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-0 w-full">
            <div className="mx-0 justify-center w-full">
                {/* Header */}
                <div className="flex items-center gap-4 mb-15">
                    <Link
                        href="/staffs/dashboard"
                        className="text-gray-600 hover:text-gray-800 ml-10 border border-gray-300 rounded px-3 py-1 hover:bg-gray-300 transition"
                    >
                        ← Quay lại
                    </Link>
                    <h1 className="flex-1 text-4xl font-extrabold mb-2 text-center">Personal Profile Management</h1>
                </div>

                <div className="flex gap-8 max-w-5xl mx-auto">
                    {/* Sidebar */}
                    <div className="w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center text-4xl text-white font-bold">
                                    U
                                </div>
                                <button className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-2 border-2 border-white">
                                    <FaUserEdit />
                                </button>
                            </div>
                            <div className="mt-4 text-center">
                                <div className="font-semibold text-lg">{profile.name}</div>
                                <div className="text-gray-500 text-sm">Blood Type O+</div>
                            </div>
                            {/* Navigation */}
                            <div className="mt-8 w-full flex flex-col gap-2">
                                <button onClick={() => handleChange('profile')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg font-semibold shadow transition ${activeSection === 'profile' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                    <FaUser /> Personal Information
                                </button>
                                <button onClick={() => handleChange('security')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg font-semibold transition ${activeSection === 'security' ? 'bg-red-500 text-white shadow hover:bg-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                    <FaLock /> Security
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    {activeSection === 'profile' ? <PersonalInfo /> : <Security />}
                </div>
            </div>
        </div>
    );
}
