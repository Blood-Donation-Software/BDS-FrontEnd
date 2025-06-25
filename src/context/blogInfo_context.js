'use client';

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAllBlogs } from "@/apis/blog"

export const BlogInformationContext = createContext(null);

export default function BlogInfoProvider({ children }) {
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            console.log("Fetching blog");
            const res = await getAllBlogs();

            let eventsData = [];
            if (Array.isArray(res)) {
                eventsData = res;
            } else if (res && Array.isArray(res.data)) {
                eventsData = res.data;
            } else if (res && res.content && Array.isArray(res.content)) {
                eventsData = res.content;
            } else if (res && res.events && Array.isArray(res.events)) {
                eventsData = res.events;
            } else {
                eventsData = [];
            }

            setBlogs(eventsData);
            console.log("hello", res.data);
        } catch (error) {
            console.error("Fetch blog error:", error);
            setError(error.message || 'Không thể tải');
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const selectedBlogById = useCallback((blogId) => {
        const blog = blogs.find(e => e.id === parseInt(blogId));
        if (blog) {
            setSelectedBlog(blog);
            console.log("Blog selected:", blog.title);
        }
        return blog;
    }, [blogs]);

    const clearSelection = useCallback(() => {
        setSelectedBlog(null);
        console.log("Selection cleared");
    }, []);

    const contextValue = {
        selectedBlog,
        blogs,

        loading,
        error,

        selectedBlogById,
        fetchBlogs,
        clearSelection,



        setSelectedBlog,
        setLoading,
        setError
    }

    return (
        <BlogInformationContext.Provider value={contextValue}>
            {children}
        </BlogInformationContext.Provider>
    )
}

export const useBlogs = () => {
    const context = useContext(BlogInformationContext);
    if (!context) {
        throw new Error('useBlogs must be used within a BlogInfoProvider');
    }
    return context;
};