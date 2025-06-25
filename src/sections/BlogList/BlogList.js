'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useBlogs } from '@/context/blogInfo_context';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const { blogs, loading, error, selectedBlog, selectedBlogById, setLoading, setError } = useBlogs();

  useEffect(() => {
    const fetchPosts = async () => {
      const blogPosts = [

      ];
      setPosts(blogPosts);
    };

    fetchPosts();
  }, []);

  // Reset page when filtering or searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Logic tìm kiếm theo ký tự trong tiêu đề
  const filteredPosts = blogs.filter(post => {


    const searchLower = searchTerm.toLowerCase().trim();
    const titleLower = post.title.toLowerCase();

    return titleLower.includes(searchLower);
  });

  // Pagination 
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const BlogCard = ({ post }) => (
    <Link href={`/blog/${post.id}`} className="h-full block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative h-48 w-full shrink-0">
          <Image
            src={post.thumbnail || '/default-thumbnail.jpg'}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm">
              {post.creationDate ? new Date(post.creationDate).toLocaleDateString('vi-VN') : ''}
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
            {post.content ? post.content.replace(/<[^>]+>/g, '').slice(0, 100) + '...' : ''}
          </p>
          <div className="flex items-center pt-4 border-t mt-auto">
            {/* <div className="relative w-10 h-10 mr-3 shrink-0">
              <Image
                src={getAvatarUrl(post.author?.profile.name)}
                alt={post.author?.profile.name || 'Tác giả'}
                fill
                className="rounded-full object-cover"
              />
            </div> */}
            <div>
              <p className="font-semibold text-sm">
                {post.author?.profile.name || 'Tác giả'}
              </p>
              {/* If you have a role field, display it here */}
              <p className="text-gray-500 text-xs">{post.author?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  const Pagination = () => (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg ${currentPage === 1
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
      >
        Trước
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => setCurrentPage(index + 1)}
          className={`px-4 py-2 rounded-lg ${currentPage === index + 1
            ? 'bg-red-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg ${currentPage === totalPages
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
      >
        Sau
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pl-12 pr-12 text-gray-700 placeholder-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Xóa tìm kiếm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bài Viết Mới Nhất</h1>
        <span className="text-gray-500">
          {filteredPosts.length} bài viết
        </span>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {currentPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination />
      {filteredPosts.length > postsPerPage && <Pagination />}

      {filteredPosts.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Không tìm thấy bài viết phù hợp
        </div>
      )}
    </div>
  );
}