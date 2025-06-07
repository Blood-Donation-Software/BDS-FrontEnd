'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogDetail({ postId }) {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
 
  const categoryColors = {
    'Sức Khỏe': 'bg-green-600',
    'Công Nghệ': 'bg-blue-600',
    'Cộng Đồng': 'bg-red-600',
    'Hướng Dẫn': 'bg-yellow-600',
    'default': 'bg-gray-600'
  };

  useEffect(() => {
    const fetchPost = async () => {
      const posts = [
        {
          id: "1",
          title: "Nhận Thức Về Sức Khỏe Tâm Thần",
          category: "Sức Khỏe",
          date: "6 Tháng 6, 2025",
          image: "/mentala.png",
          description: "Tìm hiểu và giải quyết các thách thức về sức khỏe tâm thần...",
          content: `
            <h2>Giới thiệu</h2>
            <p>Sức khỏe tâm thần là một phần quan trọng không thể thiếu trong cuộc sống của mỗi người...</p>
            
            <h2>Các thách thức phổ biến</h2>
            <p>Trong cuộc sống hiện đại, chúng ta thường xuyên đối mặt với nhiều áp lực...</p>
            
            <h2>Giải pháp và phương pháp</h2>
            <p>Có nhiều cách để cải thiện sức khỏe tâm thần...</p>
          `
        },
        {
          id: "2",
          title: "Tương Lai Của Y Tế",
          category: "Công Nghệ",
          date: "5 Tháng 6, 2025",
          image: "/healthcare-tech.jpg",
          description: "Khám phá những công nghệ đổi mới trong y tế...",
          content: `
            <h2>Công nghệ y tế hiện đại</h2>
            <p>Những tiến bộ trong công nghệ y tế đang thay đổi cách chúng ta chăm sóc sức khỏe...</p>
          `
        },
        {
          id: "3",
          title: "Hướng Dẫn Hiến Máu An Toàn",
          category: "Hướng Dẫn",
          date: "4 Tháng 6, 2025",
          image: "/guide.jpg",
          description: "Các bước chuẩn bị và quy trình hiến máu nhân đạo...",
          content: `
            <h2>Quy trình hiến máu</h2>
            <p>Hiến máu là một hành động cao cả, giúp cứu sống nhiều người...</p>
          `
        },
        {
          id: "4",
          title: "Cộng Đồng Hiến Máu",
          category: "Cộng Đồng",
          date: "3 Tháng 6, 2025",
          image: "/community.jpg",
          description: "Kết nối những tấm lòng nhân ái trong cộng đồng...",
          content: `
            <h2>Sức mạnh cộng đồng</h2>
            <p>Cùng nhau xây dựng văn hóa hiến máu trong cộng đồng...</p>
          `
        }
      ];

      const currentPost = posts.find(p => p.id === postId);
      
      if (currentPost) {
        setPost(currentPost);
        // Show all other posts except current one
        const otherPosts = posts.filter(p => p.id !== postId);
        setRelatedPosts(otherPosts);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (!post) {
    return <div className="text-center py-12">Đang tải...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="/bloglist" 
            className="text-gray-600 hover:text-gray-800"
          >
            ← Quay lại
          </Link>
          <span className={`${categoryColors[post.category]} text-white text-sm px-3 py-1 rounded-md`}>
            {post.category}
          </span>
          <span className="text-gray-500">{post.date}</span>
        </div>
        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
      </div>

      {/* Main image */}
      <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div 
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Related posts */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Bài viết khác</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {relatedPosts.map((post) => (
            <Link 
              href={`/bloglist/${post.id}`} 
              key={post.id}
              className="group flex gap-4 items-start"
            >
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-grow">
                <span className={`${categoryColors[post.category]} text-white text-xs px-2 py-1 rounded-md mb-2 inline-block`}>
                  {post.category}
                </span>
                <h3 className="font-semibold group-hover:text-red-600 line-clamp-2">
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}