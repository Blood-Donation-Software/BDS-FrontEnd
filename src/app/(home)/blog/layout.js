import BlogInfoProvider from "@/context/blogInfo_context";

export default function BlogListLayout({ children }) {
  return (
    <BlogInfoProvider>
        {children}
    </BlogInfoProvider>
  );
}