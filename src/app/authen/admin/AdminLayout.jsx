'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';

const AdminLayout = ({ children, initialTab = 'dashboard' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    // Define sidebar items for admin
    const sidebarItems = [
        {
            id: 'dashboard',
            label: 'Dashboard & Report',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>,
            route: '/authen/admin'
        },
        {
            id: 'account-management',
            label: 'Account Management',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>,
            route: '/authen/admin/accounts'
        },
        {
            id: 'event-request',
            label: 'Event Request',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>,
            route: '/authen/admin/events'
        },
        {
            id: 'blog-request',
            label: 'Blog Request',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>,
            route: '/authen/admin/blogs'
        }
    ];

    // Mock user info for admin
    const userInfo = {
        name: 'Admin User',
        role: 'Administrator',
        initials: 'AD'
    };

    // Dashboard statistics
    const dashboardStats = [
        { title: 'Total Accounts', value: '1,245', change: '+12%', icon: 'users' },
        { title: 'Pending Events', value: '8', change: '+3', icon: 'calendar' },
        { title: 'Pending Blog Posts', value: '14', change: '-2', icon: 'document' },
        { title: 'Total Donations', value: '867', change: '+23%', icon: 'heart' }
    ];

    const getStatIcon = (icon) => {
        switch (icon) {
            case 'users':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                );
            case 'calendar':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'document':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'heart':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 border border-gray-200">
            {/* Sidebar */}
            <Sidebar items={sidebarItems} userInfo={userInfo} portalType="Admin" initialTab={activeTab} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-gray-100 rounded">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                            </h2>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {activeTab === 'dashboard' ? (
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {dashboardStats.map((stat, index) => (
                                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                                            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                                {getStatIcon(stat.icon)}
                                            </div>
                                        </div>
                                        <div className="flex items-baseline space-x-4">
                                            <h2 className="text-2xl font-bold text-gray-900">{stat.value}</h2>
                                            <span className="text-green-500 text-sm font-medium flex items-center">
                                                {stat.change}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="font-medium text-gray-900">Recent Activity</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {/* Activity Items */}
                                        <div className="flex">
                                            <div className="flex-shrink-0 mr-4">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-900">New user account <span className="font-medium">John Smith</span> was created</p>
                                                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="flex-shrink-0 mr-4">
                                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-900">New event request <span className="font-medium">Blood Drive at Central Hospital</span> needs approval</p>
                                                <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="flex-shrink-0 mr-4">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-900">Blog post <span className="font-medium">The Importance of Regular Blood Donation</span> was approved</p>
                                                <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Other tabs content will be rendered as children
                        children
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout; 