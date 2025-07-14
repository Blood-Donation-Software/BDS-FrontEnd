'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DonationEvent() {
    const router = useRouter();
    
    useEffect(() => {
        // Redirect to event list page
        router.push('/staffs/donation-event/list');
    }, [router]);
    
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
    );
}