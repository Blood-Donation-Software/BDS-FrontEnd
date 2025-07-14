'use client'

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import Link from "next/link";
import { ChevronRight, Plus, Home } from "lucide-react";

export default function AuthenticatedHeader({ items }) {
    const pathname = usePathname();
    
    // Generate breadcrumb items
    const generateBreadcrumbs = () => {
        const breadcrumbs = [];
        
        // Find current page and build breadcrumb path
        let currentPage = items.find(item => item.url === pathname);
        let parent = null;
        
        // If not found, try to find by pathname starting with item.url
        if (!currentPage) {
            currentPage = items.find(item => pathname.startsWith(item.url));
        }
        
        // If still not found, check children
        if (!currentPage) {
            for (const item of items) {
                if (item.children && item.children.length > 0) {
                    const childPage = item.children.find(child => pathname === child.url);
                    if (childPage) {
                        parent = item;
                        currentPage = childPage;
                        break;
                    }
                }
            }
        }
        
        // If we have a parent-child relationship, show: Parent > Child
        if (parent && currentPage) {
            breadcrumbs.push({
                title: parent.title,
                url: parent.url,
            });
            breadcrumbs.push({
                title: currentPage.title,
                url: currentPage.url,
                isActive: true
            });
        }
        // If we only have a current page (no parent), show just the current page
        else if (currentPage) {
            breadcrumbs.push({
                title: currentPage.title,
                url: currentPage.url,
                isActive: true
            });
        }
        
        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();
    
    // Find current page with better logic
    function findCurrentPage() {
        // First try to find exact match
        let currentPage = items.find(item => item.url === pathname);
        
        // If not found, try to find by pathname starting with item.url
        if (!currentPage) {
            currentPage = items.find(item => pathname.startsWith(item.url));
        }
        
        // If still not found, check children
        if (!currentPage) {
            for (const item of items) {
                if (item.children && item.children.length > 0) {
                    const childPage = item.children.find(child => pathname === child.url);
                    if (childPage) {
                        return { parent: item, current: childPage };
                    }
                }
            }
        }
        
        return currentPage ? { current: currentPage } : null;
    }
    
    const pageInfo = findCurrentPage();
    
    // If no page found, return default
    if (!pageInfo) {
        return (
            <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-10 w-full">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                        <SidebarTrigger />
                        <nav className="flex items-center space-x-2">
                            <Home className="h-4 w-4 text-gray-500" />
                            <span className="text-lg sm:text-xl font-semibold text-gray-900">Dashboard</span>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }

    const { parent, current } = pageInfo;
    const currentPage = current;
    
    // Determine if we should show the action button
    const shouldShowButton = () => {
        if (parent && parent.button) {
            // For parent pages with children, show button on parent page
            return pathname === parent.url;
        }
        return currentPage.button && pathname === currentPage.url;
    };

    const getButtonConfig = () => {
        if (parent && parent.button) {
            return { btnName: parent.btnName, nav: parent.nav };
        }
        return { btnName: currentPage.btnName, nav: currentPage.nav };
    };

    return (
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-10 w-full">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2 min-w-0">
                    <SidebarTrigger />
                    <nav className="flex items-center space-x-2 min-w-0">
                        {breadcrumbs.length > 0 ? (
                            breadcrumbs.map((breadcrumb, index) => (
                                <div key={breadcrumb.url} className="flex items-center space-x-2">
                                    {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                                    <div className="flex items-center space-x-2">
                                        {breadcrumb.isActive ? (
                                            <span className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                                                {breadcrumb.title}
                                            </span>
                                        ) : (
                                            <Link 
                                                href={breadcrumb.url}
                                                className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 truncate transition-colors"
                                            >
                                                {breadcrumb.title}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Fallback for pages without breadcrumbs (like Dashboard)
                            <div className="flex items-center space-x-2">
                                <Home className="h-4 w-4 text-gray-500" />
                                <span className="text-lg sm:text-xl font-semibold text-gray-900">Dashboard</span>
                            </div>
                        )}
                    </nav>
                </div>
                
                {shouldShowButton() && (
                    <Link href={getButtonConfig().nav}>
                        <Button className="bg-red-500 hover:bg-red-600 text-white flex-shrink-0">
                            <Plus className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">{getButtonConfig().btnName}</span>
                            <span className="sm:hidden">Add</span>
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    );
}