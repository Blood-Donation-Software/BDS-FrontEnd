'use client';
import { useParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import BlogDetail from '@/sections/blogdetail/blogdetail';
import Header from '@/sections/header/Header';
import Footer from '@/sections/Footer/Footer';

export default function BlogDetailPage() {
  const [isLoading, setIsLoading] = useState(true);
const params = useParams();
  useEffect(() => {
    if (params?.id) {
      setIsLoading(false);
    }
  }, [params]);

  if (isLoading) {
    return (
      <>
        
        <div className="text-center py-12">Đang tải...</div>
        
      </>
    );
  }

  return (
    <>
      
      <BlogDetail postId={params.id.toString()} />
      
    </>
  );
}