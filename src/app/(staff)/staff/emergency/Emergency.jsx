'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import sidebarInfo from '../sidebarInfo';
import userInfo from '../userInfo';


const Emergency = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('emergency-requests');

    const emergencyRequests = [
        {
            id: 1,
            patient: 'Nguyen Van A',
            bloodType: 'A+',
            units: 2,
            hospital: 'City Hospital',
            urgency: 'high',
            status: 'pending'
        }
    ];

    const handleNavigation = (route) => {
        router.push(route);
    };

    const getUrgencyBadge = (urgency) => {
        const baseClasses = "px-2 py-1 rounded text-xs font-medium";
        if (urgency === 'high') {
            return `${baseClasses} bg-red-100 text-red-800`;
        } else if (urgency === 'medium') {
            return `${baseClasses} bg-orange-100 text-orange-800`;
        } else if (urgency === 'low') {
            return `${baseClasses} bg-blue-100 text-blue-800`;
        }
        return baseClasses;
    };

    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 rounded text-xs font-medium";
        if (status === 'pending') {
            return `${baseClasses} bg-yellow-100 text-yellow-800`;
        } else if (status === 'approved') {
            return `${baseClasses} bg-green-100 text-green-800`;
        } else if (status === 'rejected') {
            return `${baseClasses} bg-red-100 text-red-800`;
        }
        return baseClasses;
    };

    return (
        <div className="flex h-screen bg-gray-50 border border-gray-200">
            {/* Sidebar */}
            <Sidebar items={sidebarInfo()} userInfo={userInfo()} portalType="Staff" initialTab={activeTab} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <h2 className="text-xl font-semibold text-gray-900">Emergency Blood Requests</h2>
                        </div>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                            <span className="text-lg">+</span>
                            <span>New Request</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6">
                    <div className="bg-white rounded border border-gray-200">
                        {/* Table Header */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                                <div className="col-span-2">Patient</div>
                                <div className="col-span-2">Blood Type</div>
                                <div className="col-span-1">Units</div>
                                <div className="col-span-3">Hospital</div>
                                <div className="col-span-2">Urgency</div>
                                <div className="col-span-2">Status</div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-gray-200">
                            {emergencyRequests.map((request) => (
                                <div key={request.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        {/* Patient */}
                                        <div className="col-span-2">
                                            <h3 className="text-sm font-medium text-gray-900">{request.patient}</h3>
                                        </div>

                                        {/* Blood Type */}
                                        <div className="col-span-2">
                                            <span className="text-sm text-gray-700">{request.bloodType}</span>
                                        </div>

                                        {/* Units */}
                                        <div className="col-span-1">
                                            <span className="text-sm text-gray-700">{request.units}</span>
                                        </div>

                                        {/* Hospital */}
                                        <div className="col-span-3">
                                            <span className="text-sm text-gray-700">{request.hospital}</span>
                                        </div>

                                        {/* Urgency */}
                                        <div className="col-span-2">
                                            <span className={getUrgencyBadge(request.urgency)}>
                                                {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                                            </span>
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-2">
                                            <span className={getStatusBadge(request.status)}>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Emergency;
