'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import sidebarInfo from '../sidebarInfo';
import Sidebar from '@/components/Sidebar';
import userInfo from '../userInfo';

const Stock = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('blood-stock');

    const bloodStockData = [
        { type: 'aPos', label: 'A+', units: 150 },
        { type: 'aNeg', label: 'A-', units: 80 },
        { type: 'bPos', label: 'B+', units: 120 },
        { type: 'bNeg', label: 'B-', units: 60 },
        { type: 'oPos', label: 'O+', units: 200 },
        { type: 'oNeg', label: 'O-', units: 100 },
        { type: 'abPos', label: 'AB+', units: 90 },
        { type: 'abNeg', label: 'AB-', units: 40 }
    ];

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
                            <h2 className="text-xl font-semibold text-gray-900">Blood Stock</h2>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6">
                    <div className="grid grid-cols-4 gap-6">
                        {bloodStockData.map((item) => (
                            <div key={item.type} className="bg-white p-6 rounded border border-gray-200">
                                <div className="mb-2 text-sm text-gray-600">{item.label}</div>
                                <div className="text-3xl font-bold text-red-500">{item.units}</div>
                                <div className="text-xs text-gray-500">units available</div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Stock;
