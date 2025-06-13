'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

    const sidebarItems = [
        {
            id: 'blog-management',
            label: 'Blog Management',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>,
            route: '/staff'
        },
        {
            id: 'donation-events',
            label: 'Donation Events',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>,
            route: '/staff/event'
        },
        {
            id: 'emergency-requests',
            label: 'Emergency Requests',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>,
            route: '/staff/emergency'
        },
        {
            id: 'blood-stock',
            label: 'Blood Stock',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>,
            route: '/staff/stock'
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
            <div className="w-64 bg-white border-r border-gray-200">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-600 text-sm">BB</span>
                        </div>
                        <div>
                            <h1 className="font-semibold text-gray-900">Blood Bank</h1>
                            <p className="text-sm text-gray-500">Staff Portal</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-4">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.route)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${activeTab === item.id
                                ? 'bg-red-50 border-l-4 border-red-500 text-red-700'
                                : 'text-gray-700'
                                }`}
                        >
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                {item.icon}
                            </div>
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* User Profile at Bottom */}
                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-xs">NT</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Nguyen Thi B</h3>
                            <p className="text-xs text-gray-500">Staff Member</p>
                        </div>
                    </div>
                </div>
            </div>

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
