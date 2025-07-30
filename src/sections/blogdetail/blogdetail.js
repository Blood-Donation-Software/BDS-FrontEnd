'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useBlogs } from '@/context/blogInfo_context';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/context/language_context';
import { BASE_URL } from '@/global-config';

export default function BlogDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [relatedPosts, setRelatedPosts] = useState([]);
  const { blogs, selectedBlog, selectedBlogById } = useBlogs();

  const blog = selectedBlog || blogs.find(b => String(b.id) === String(id));

  useEffect(() => {
    if (!blog || !blog.creationDate || blogs.length === 0) {
      setRelatedPosts([]);
      return;
    }

    // Parse the current blog's creation date
    const currentDate = new Date(blog.creationDate);

    // Filter out the current blog, blogs without a creationDate, and blogs with INACTIVE status
    const otherBlogs = blogs.filter(b => 
      b.id !== blog.id && 
      b.creationDate && 
      b.status === 'ACTIVE'
    );

    // Sort by absolute difference in creationDate
    const sorted = otherBlogs.sort((a, b) => {
      const dateA = new Date(a.creationDate);
      const dateB = new Date(b.creationDate);
      return Math.abs(dateA - currentDate) - Math.abs(dateB - currentDate);
    });

    // Take the 4 nearest
    setRelatedPosts(sorted.slice(0, 4));
  }, [blog, blogs]);

  const getThumbnailValue = (thumbnail) => {
    return BASE_URL + '/' + thumbnail;
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{t?.blog?.loading_article}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t?.blog?.back_to_list}
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="bg-red-100 text-red-800 text-sm font-medium px-4 py-2 rounded-full">
                {blog.creationDate ? new Date(blog.creationDate).toLocaleDateString('vi-VN') : ''}
              </span>
            </div>
          </div>

          {/* Title and Meta */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>
            
            {/* Author Info */}
            <div className="flex items-center justify-left space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {(blog.authorName || blog.author || 'Admin').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{blog.authorName || blog.author || 'Admin'}</p>
                <p className="text-gray-500 text-sm">{t?.blog?.author}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        

        {/* Article Content */}
        <article className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-blockquote:border-red-500 prose-blockquote:bg-red-50 prose-blockquote:text-gray-800"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        
      </div>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t?.blog?.related_articles}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t?.blog?.related_articles_description}
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  href={`/blog/${related.id}`}
                  key={related.id}
                  className="group cursor-pointer"
                  onClick={() => selectedBlogById(related.id)}
                >
                  <article className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-red-200 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getThumbnailValue(related.thumbnail)}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                        {related.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                        {related.content ? related.content.replace(/<[^>]+>/g, '').slice(0, 120) + '...' : ''}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {(related.authorName || 'Admin').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">{related.authorName || 'Admin'}</span>
                        </div>
                        
                        <span className="text-xs text-gray-500">
                          {related.creationDate ? new Date(related.creationDate).toLocaleDateString('vi-VN') : ''}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}