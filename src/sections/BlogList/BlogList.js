'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useBlogs } from '@/context/blogInfo_context';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/language_context';
import { BASE_URL } from '@/global-config';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const postsPerPage = 6;


  const { blogs, selectedBlog, selectedBlogById } = useBlogs();

  // Reset page when filtering or searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


  const handleClick = (post) => {
    selectedBlogById(post.id);
    router.push(`/blog/${post.id}`);
  };


  // Logic tìm kiếm theo ký tự trong tiêu đề và chỉ hiển thị blog có status ACTIVE
  // Logic tìm kiếm theo ký tự trong tiêu đề và chỉ hiển thị blog có status ACTIVE
  const filteredPosts = blogs.filter(post => {
    // Chỉ hiển thị blog có status là ACTIVE
    if (post.status !== 'ACTIVE') {
      return false;
    }
    // Chỉ hiển thị blog có status là ACTIVE
    if (post.status !== 'ACTIVE') {
      return false;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    const titleLower = post.title.toLowerCase();

    return titleLower.includes(searchLower);
  });

  // Pagination 
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const getThumbnailValue = (thumbnail) => {
    return BASE_URL + '/' + thumbnail;
  }

  const BlogCard = ({ post }) => (
    <article className="group cursor-pointer h-full" onClick={() => handleClick(post)}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden border border-gray-100 group-hover:border-red-200">
        {/* Image Container */}
        <div className="relative h-47 overflow-hidden">
          <img
            src={getThumbnailValue(post.thumbnail)}
            alt={post.title}
            className="w-[400px] h-[300px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4">
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
              {post.creationDate ? new Date(post.creationDate).toLocaleDateString('vi-VN') : ''}
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
            {post.title}
          </h2>
          
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
            {post.content ? post.content.replace(/<[^>]+>/g, '').slice(0, 160) + '...' : 'Không có nội dung'}
          </p>
          
          {/* Author Section */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {(post.authorName || 'Admin').charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">
                  {post.authorName || 'Admin'}
                </p>
                <p className="text-gray-500 text-xs">Tác giả</p>
              </div>
            </div>
            
            <div className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </article>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tin Tức & Bài Viết
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá những câu chuyện, thông tin và kiến thức hữu ích về hiến máu cứu người
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full px-5 py-4 pl-12 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700 placeholder-gray-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  aria-label="Xóa tìm kiếm"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Info */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              {searchTerm ? `Kết quả tìm kiếm: "${searchTerm}"` : 'Tất cả bài viết'}
            </h2>
            <span className="bg-red-100 text-red-800 text-sm font-medium px-4 py-2 rounded-full">
              {filteredPosts.length} bài viết
            </span>
          </div>
        </div>

        {/* Blog Grid */}
        {currentPosts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {currentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài viết</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có bài viết nào được đăng tải'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Xem tất cả bài viết
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Trước
            </button>

            {/* Page Numbers */}
            {[...Array(Math.min(totalPages, 5))].map((_, index) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = index + 1;
              } else if (currentPage <= 3) {
                pageNumber = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + index;
              } else {
                pageNumber = currentPage - 2 + index;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Sau
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}