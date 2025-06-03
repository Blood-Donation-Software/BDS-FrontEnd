import AdminLayout from '../AdminLayout';

const EventRequestsPage = () => {
    // Mock event data
    const eventRequests = [
        {
            id: 1,
            title: 'Blood Drive at Central Hospital',
            organizer: 'Central Hospital',
            date: '2024-06-15',
            time: '9:00 AM - 5:00 PM',
            location: '123 Medical Center Blvd',
            status: 'Pending',
            requestedBy: 'Dr. Sarah Johnson',
            requestDate: '3 days ago'
        },
        {
            id: 2,
            title: 'Community Blood Donation',
            organizer: 'Westside Community Center',
            date: '2024-06-20',
            time: '10:00 AM - 3:00 PM',
            location: '456 Community Ave',
            status: 'Approved',
            requestedBy: 'Michael Roberts',
            requestDate: '1 week ago'
        },
        {
            id: 3,
            title: 'University Blood Drive',
            organizer: 'State University',
            date: '2024-07-05',
            time: '11:00 AM - 4:00 PM',
            location: 'University Student Union',
            status: 'Rejected',
            requestedBy: 'Prof. James Wilson',
            requestDate: '5 days ago'
        },
        {
            id: 4,
            title: 'Corporate Blood Donation Event',
            organizer: 'Tech Solutions Inc.',
            date: '2024-07-10',
            time: '9:00 AM - 2:00 PM',
            location: '789 Corporate Park',
            status: 'Pending',
            requestedBy: 'Lisa Anderson',
            requestDate: '2 days ago'
        },
    ];

    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        if (status === 'Approved') {
            return `${baseClasses} bg-green-100 text-green-800`;
        } else if (status === 'Rejected') {
            return `${baseClasses} bg-red-100 text-red-800`;
        } else if (status === 'Pending') {
            return `${baseClasses} bg-yellow-100 text-yellow-800`;
        }
        return baseClasses;
    };

    const EventRequestsContent = () => (
        <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="py-2 pl-10 pr-4 w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        placeholder="Search events..."
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <select className="py-2 px-3 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <select className="py-2 px-3 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500">
                        <option value="">All Dates</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                    </select>
                </div>
            </div>

            {/* Event Requests Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                        <div className="col-span-3">Event</div>
                        <div className="col-span-2">Date & Time</div>
                        <div className="col-span-2">Organizer</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-3">Actions</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                    {eventRequests.map((event) => (
                        <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="grid grid-cols-12 gap-4 items-center">
                                {/* Event */}
                                <div className="col-span-3">
                                    <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                                    <p className="text-xs text-gray-500">{event.location}</p>
                                    <p className="text-xs text-gray-500">Requested: {event.requestDate}</p>
                                </div>

                                {/* Date & Time */}
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-900">{event.date}</p>
                                    <p className="text-xs text-gray-500">{event.time}</p>
                                </div>

                                {/* Organizer */}
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-900">{event.organizer}</p>
                                    <p className="text-xs text-gray-500">By: {event.requestedBy}</p>
                                </div>

                                {/* Status */}
                                <div className="col-span-2">
                                    <span className={getStatusBadge(event.status)}>
                                        {event.status}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-3 flex items-center space-x-2">
                                    <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                        View Details
                                    </button>

                                    {event.status === 'Pending' && (
                                        <>
                                            <button className="px-3 py-1 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600 transition-colors">
                                                Approve
                                            </button>
                                            <button className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-colors">
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <AdminLayout initialTab="event-request">
            <EventRequestsContent />
        </AdminLayout>
    );
};

export default EventRequestsPage;

export const metadata = {
    title: 'Admin - Event Requests',
    description: 'Manage blood donation event requests',
}; 