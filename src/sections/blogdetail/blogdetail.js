'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useBlogs } from '@/context/blogInfo_context';
import { useParams } from 'next/navigation';

export default function BlogDetail() {
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

    // Filter out the current blog and blogs without a creationDate
    const otherBlogs = blogs.filter(b => b.id !== blog.id && b.creationDate);

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
    if (!thumbnail) return '/default-thumbnail.jpg'; // fallback image
    // Replace all backslashes with forward slashes
    const normalized = thumbnail.replace(/\\/g, '/');
    // If it's already an absolute URL (http/https), return as is
    if (normalized.startsWith('http://') || normalized.startsWith('https://')) return normalized;
    // If it starts with '/', return as is, else prepend '/'
    return normalized.startsWith('/') ? normalized : `/${normalized}`;
  }

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/blog"
            className="text-gray-600 hover:text-gray-800"
          >
            ← Quay lại
          </Link>
          <span className="text-gray-500 ml-auto">{blog.creationDate ? new Date(blog.creationDate).toLocaleDateString('vi-VN') : ''}</span>
        </div>
        <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>

        {/* Author Info */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h3 className="font-semibold">{blog.author}</h3>
          </div>
        </div>
      </div>

      {/* Main image */}
      <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
        <Image
          src={getThumbnailValue(blog.thumbnail)}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Related posts */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Bài viết gần đây</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {relatedPosts.map((related) => (
            <Link
              href={`/blog/${related.id}`}
              key={related.id}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-xs w-full mx-auto">
                <div className="relative h-32 w-full">
                  <Image
                    src={getThumbnailValue(related.thumbnail)}
                    alt={related.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold group-hover:text-red-600">
                    {related.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}