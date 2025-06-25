'use client';
import { useParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import BlogDetail from '@/sections/blogdetail/blogdetail';
import { useBlogs } from "@/context/blogInfo_context";

export default function BlogDetailPage() {
  const { blogs, loading, error, selectedBlog, selectedBlogById, setLoading, setError } = useBlogs();
  const { id } = useParams();
  
const params = useParams();
  useEffect(() => {
    if (params?.id) {
      setLoading(false);
    }
  }, [params]);

  if (loading) {
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