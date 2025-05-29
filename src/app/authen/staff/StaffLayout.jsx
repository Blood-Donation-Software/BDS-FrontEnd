'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const StaffLayout = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('blog-management');

    const blogPosts = [
        {
            id: 1,
            title: 'Blood Donation Guidelines',
            status: 'published',
            date: '2024-01-15'
        },
        {
            id: 2,
            title: 'Benefits of Regular Donation',
            status: 'draft',
            date: '2024-01-14'
        },
        {
            id: 3,
            title: 'Donor Requirements',
            status: 'published',
            date: '2024-01-13'
        }
    ];

    const sidebarItems = [
        {
            id: 'blog-management',
            label: 'Blog Management',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>,
            route: '/authen/staff'
        },
        {
            id: 'donation-events',
            label: 'Donation Events',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>,
            route: '/authen/staff/event'
        },
        {
            id: 'emergency-requests',
            label: 'Emergency Requests',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>,
            route: '/authen/staff/emergency'
        },
        {
            id: 'blood-stock',
            label: 'Blood Stock',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>,
            route: '/authen/staff/stock'
        }
    ];

    const handleNavigation = (route) => {
        router.push(route);
    };

    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        if (status === 'published') {
            return `${baseClasses} bg-green-100 text-green-800`;
        } else if (status === 'draft') {
            return `${baseClasses} bg-yellow-100 text-yellow-800`;
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
                            <button className="p-1 hover:bg-gray-100 rounded">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h2 className="text-xl font-semibold text-gray-900">Blog Management</h2>
                        </div>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                            <span className="text-lg">+</span>
                            <span>New Post</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6">
                    <div className="bg-white rounded border border-gray-200">
                        {/* Table Header */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                                <div className="col-span-4">Title</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-3">Date</div>
                                <div className="col-span-3">Actions</div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-gray-200">
                            {blogPosts.map((post) => (
                                <div key={post.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        {/* Title */}
                                        <div className="col-span-4">
                                            <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-2">
                                            <span className={getStatusBadge(post.status)}>
                                                {post.status}
                                            </span>
                                        </div>

                                        {/* Date */}
                                        <div className="col-span-3">
                                            <span className="text-sm text-gray-500">{post.date}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-3 flex items-center space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
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

export default StaffLayout;
