import AdminLayout from '../AdminLayout';

const BlogRequestsPage = () => {
    // Mock blog data
    const blogRequests = [
        {
            id: 1,
            title: 'The Importance of Blood Donation',
            author: 'Dr. Sarah Johnson',
            category: 'Educational',
            summary: 'An article discussing why regular blood donation is crucial for public health...',
            status: 'Pending',
            submittedDate: '2 days ago',
            tags: ['health', 'donation', 'public-health']
        },
        {
            id: 2,
            title: 'Common Myths About Blood Donation',
            author: 'Michael Roberts',
            category: 'Educational',
            summary: 'Debunking common misconceptions about blood donation and the process...',
            status: 'Approved',
            submittedDate: '1 week ago',
            tags: ['myths', 'facts', 'education']
        },
        {
            id: 3,
            title: 'How Your Blood Donation Saves Lives',
            author: 'Lisa Thompson',
            category: 'Stories',
            summary: 'Real stories of individuals whose lives were saved by blood donations...',
            status: 'Rejected',
            submittedDate: '3 days ago',
            tags: ['stories', 'impact', 'lives-saved']
        },
        {
            id: 4,
            title: 'Preparing for Your Blood Donation: Tips and Advice',
            author: 'Dr. James Wilson',
            category: 'Guides',
            summary: 'A comprehensive guide on how to prepare for your blood donation appointment...',
            status: 'Pending',
            submittedDate: '1 day ago',
            tags: ['guide', 'tips', 'preparation']
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

    const BlogRequestsContent = () => (
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
                        placeholder="Search blog posts..."
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
                        <option value="">All Categories</option>
                        <option value="educational">Educational</option>
                        <option value="stories">Stories</option>
                        <option value="guides">Guides</option>
                    </select>
                </div>
            </div>

            {/* Blog Requests */}
            <div className="grid grid-cols-1 gap-6">
                {blogRequests.map((blog) => (
                    <div key={blog.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            {/* Blog Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={getStatusBadge(blog.status)}>
                                        {blog.status}
                                    </span>
                                    <span className="text-xs text-gray-500">Submitted {blog.submittedDate}</span>
                                </div>

                                <h3 className="text-lg font-medium text-gray-900 mb-1">{blog.title}</h3>
                                <p className="text-sm text-gray-500 mb-2">By {blog.author} • {blog.category}</p>

                                <p className="text-sm text-gray-700 mb-3">{blog.summary}</p>

                                <div className="flex flex-wrap gap-2">
                                    {blog.tags.map((tag, index) => (
                                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col space-y-2 min-w-[120px]">
                                <button className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    View Full Post
                                </button>

                                {blog.status === 'Pending' && (
                                    <>
                                        <button className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600 transition-colors">
                                            Approve
                                        </button>
                                        <button className="w-full px-3 py-2 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-colors">
                                            Reject
                                        </button>
                                    </>
                                )}

                                {blog.status === 'Approved' && (
                                    <button className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors">
                                        Feature Post
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <AdminLayout initialTab="blog-request">
            <BlogRequestsContent />
        </AdminLayout>
    );
};

export default BlogRequestsPage;

export const metadata = {
    title: 'Admin - Blog Requests',
    description: 'Manage blog post requests in the Blood Bank system',
}; 