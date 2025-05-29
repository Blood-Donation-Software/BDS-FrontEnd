'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Sidebar = ({ items, userInfo, portalType, initialTab }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState(initialTab || items[0]?.id || '');

    // Update activeTab when pathname changes
    useEffect(() => {
        const currentItem = items.find(item => pathname === item.route);
        if (currentItem) {
            setActiveTab(currentItem.id);
        }
    }, [pathname, items]);

    const handleNavigation = (itemId, route) => {
        setActiveTab(itemId);
        router.push(route);
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600 text-sm">BB</span>
                    </div>
                    <div>
                        <h1 className="font-semibold text-gray-900">Blood Bank</h1>
                        <p className="text-sm text-gray-500">{portalType} Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="mt-4 flex-grow">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleNavigation(item.id, item.route)}
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
            <div className="p-4 border-t border-gray-200 bg-white mt-auto">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-xs">{userInfo.initials}</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">{userInfo.name}</h3>
                        <p className="text-xs text-gray-500">{userInfo.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar; 