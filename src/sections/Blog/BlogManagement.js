import { SidebarTrigger } from "@/components/ui/sidebar";
export default function BlogManagement() {
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
    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        if (status === 'published') {
            return `${baseClasses} bg-green-100 text-green-800`;
        } else if (status === 'draft') {
            return `${baseClasses} bg-yellow-100 text-yellow-800`;
        }
        return baseClasses;
    };
    return(
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
    );
}