'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất Cả');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const categoryColors = {
    'Sức Khỏe': 'bg-green-600',
    'Công Nghệ': 'bg-blue-600',
    'Cộng Đồng': 'bg-red-600',
    'Hướng Dẫn': 'bg-yellow-600',
    'default': 'bg-gray-600'
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const blogPosts = [
        {
          id: 1,
          title: "Nhận Thức Về Sức Khỏe Tâm Thần",
          category: "Sức Khỏe",
          date: "6 Tháng 6, 2025",
          image: "/mentala.png",
          description: "Tìm hiểu và giải quyết các thách thức về sức khỏe tâm thần...",
          author: {
            name: "Bác sĩ Nguyễn Văn A",
            avatar: "/doctor-a.jpg",
            role: "Chuyên gia tâm lý"
          }
        },
        {
          id: 2,
          title: "Tương Lai Của Y Tế",
          category: "Công Nghệ",
          date: "5 Tháng 6, 2025",
          image: "/healthcare-tech.jpg",
          description: "Khám phá những công nghệ đổi mới trong y tế...",
          author: {
            name: "Kỹ sư Trần B",
            avatar: "/engineer-b.jpg",
            role: "Chuyên gia công nghệ y tế"
          }
        },
        {
          id: 3,
          title: "Hướng Dẫn Hiến Máu An Toàn",
          category: "Hướng Dẫn",
          date: "4 Tháng 6, 2025",
          image: "/guide.jpg",
          description: "Các bước chuẩn bị và quy trình hiến máu nhân đạo...",
          author: {
            name: "Bác sĩ Lê C",
            avatar: "/doctor-c.jpg",
            role: "Bác sĩ huyết học"
          }
        },
        {
          id: 4,
          title: "Cộng Đồng Hiến Máu",
          category: "Cộng Đồng",
          date: "3 Tháng 6, 2025",
          image: "/community.jpg",
          description: "Kết nối những tấm lòng nhân ái trong cộng đồng...",
          author: {
            name: "ThS. Phạm D",
            avatar: "/master-e.jpg",
            role: "Điều phối viên cộng đồng"
          }
        }
      ];
      setPosts(blogPosts);
    };

    fetchPosts();
  }, []);

  // Reset page when filtering or searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Logic tìm kiếm theo ký tự trong tiêu đề
  const filteredPosts = posts.filter(post => {
    if (!searchTerm.trim()) {
      return selectedCategory === 'Tất Cả' || post.category === selectedCategory;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    const titleLower = post.title.toLowerCase();
    
    const matchesSearch = titleLower.includes(searchLower);
    const matchesCategory = selectedCategory === 'Tất Cả' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination 
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const SearchBar = () => (
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
  );

  const CategoryFilter = () => (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => setSelectedCategory('Tất Cả')}
        className={`px-4 py-2 rounded-lg transition-colors ${
          selectedCategory === 'Tất Cả' 
            ? 'bg-red-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Tất Cả
      </button>
      {Object.keys(categoryColors).map(category => (
        category !== 'default' && (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category
                ? `${categoryColors[category]} text-white`
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        )
      ))}
    </div>
  );

  const BlogCard = ({ post }) => (
    <Link href={`/blog/${post.id}`} className="h-full block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative h-48 w-full shrink-0">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <span className={`${categoryColors[post.category]} text-white text-xs font-semibold px-2 py-1 rounded`}>
              {post.category}
            </span>
            <span className="text-gray-500 text-sm">{post.date}</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
            {post.description}
          </p>
          <div className="flex items-center pt-4 border-t mt-auto">
            <div className="relative w-10 h-10 mr-3 shrink-0">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-sm">{post.author.name}</p>
              <p className="text-gray-500 text-xs">{post.author.role}</p>
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
        className={`px-4 py-2 rounded-lg ${
          currentPage === 1 
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
          className={`px-4 py-2 rounded-lg ${
            currentPage === index + 1
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
        className={`px-4 py-2 rounded-lg ${
          currentPage === totalPages
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
      <SearchBar />
      <CategoryFilter />

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