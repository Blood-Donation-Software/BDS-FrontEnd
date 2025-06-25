'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useBlogs } from '@/context/blogInfo_context';

export default function BlogDetail({ postId }) {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  const { blogs, selectedBlog, selectedBlogById } = useBlogs();

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
          author: {
            name: "Bác sĩ Nguyễn Văn A",
            avatar: "/master-e.jpg",
            role: "Chuyên gia tâm lý"
          },
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
          author: {
            name: "Kỹ sư Trần B",
            avatar: "/engineer-b.jpg",
            role: "Chuyên gia công nghệ y tế"
          },
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
          author: {
            name: "Bác sĩ Lê C",
            avatar: "/doctor-c.jpg",
            role: "Bác sĩ huyết học"
          },
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
          author: {
            name: "ThS. Phạm D",
            avatar: "/master-e.jpg",
            role: "Điều phối viên cộng đồng"
          },
          content: `
            <h2>Sức mạnh cộng đồng</h2>
            <p>Cùng nhau xây dựng văn hóa hiến máu trong cộng đồng...</p>
          `
        }
      ];

      const currentPost = posts.find(p => p.id === postId);

      if (currentPost) {
        setPost(currentPost);
        const related = posts
          .filter(p => p.category === currentPost.category && p.id !== postId)
          .slice(0, 2);
        setRelatedPosts(related);
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
            href="/blog"
            className="text-gray-600 hover:text-gray-800"
          >
            ← Quay lại
          </Link>
          <span className="text-gray-500 ml-auto">{post.date}</span>
        </div>
        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

        {/* Author Info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative w-12 h-12">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold">{post.author.name}</h3>
            <p className="text-gray-600 text-sm">{post.author.role}</p>
          </div>
        </div>
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
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Bài viết liên quan</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {relatedPosts.map((related) => (
            <Link
              href={`/blog/${related.id}`}
              key={related.id}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={related.image}
                    alt={related.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <span className={`${categoryColors[related.category]} text-white text-xs px-2 py-1 rounded-md mb-2 inline-block`}>
                    {related.category}
                  </span>
                  <h3 className="text-xl font-semibold group-hover:text-red-600">
                    {related.title}
                  </h3>
                  {/* Related Post Author */}
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                    <div className="relative w-8 h-8">
                      <Image
                        src={related.author.avatar}
                        alt={related.author.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{related.author.name}</p>
                      <p className="text-gray-500 text-xs">{related.author.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}