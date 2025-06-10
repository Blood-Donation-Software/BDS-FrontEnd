import { SidebarTrigger } from "@/components/ui/sidebar";

export default function EventManagement() {
    const events = [
        {
            id: 1,
            name: 'Community Blood Drive',
            location: 'District 1 Community Center',
            date: '2024-02-01',
            status: 'upcoming'
        },
        {
            id: 2,
            name: 'University Donation Day',
            location: 'ABC University',
            date: '2024-01-15',
            status: 'completed'
        }
    ];

    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 rounded text-xs font-medium";
        if (status === 'upcoming') {
            return `${baseClasses} bg-green-100 text-green-800`;
        } else if (status === 'completed') {
            return `${baseClasses} bg-gray-100 text-gray-800`;
        }
        return baseClasses;
    };
    return(
        <main className="flex-1 p-6">
            <div className="bg-white rounded border border-gray-200">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                        <div className="col-span-3">Event Name</div>
                        <div className="col-span-3">Location</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Actions</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                    {events.map((event) => (
                        <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="grid grid-cols-12 gap-4 items-center">
                                {/* Event Name */}
                                <div className="col-span-3">
                                    <h3 className="text-sm font-medium text-gray-900">{event.name}</h3>
                                </div>

                                {/* Location */}
                                <div className="col-span-3">
                                    <span className="text-sm text-gray-700">{event.location}</span>
                                </div>

                                {/* Date */}
                                <div className="col-span-2">
                                    <span className="text-sm text-gray-500">{event.date}</span>
                                </div>

                                {/* Status */}
                                <div className="col-span-2">
                                    <span className={getStatusBadge(event.status)}>
                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-2">
                                    {event.status === 'completed' ? (
                                        <button className="text-red-500 hover:text-red-700 text-sm">
                                            Report
                                        </button>
                                    ) : (
                                        <div className="flex items-center space-x-2">
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
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}