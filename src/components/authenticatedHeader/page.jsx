'use client'

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import Link from "next/link";
export default function AuthenticatedHeader({ items }) {
    const pathname = usePathname();

    let currentPage = items.find(item => pathname.startsWith(item.url));

    if (!currentPage) {
        for (const item of items) {
            const matchedChild = item.children?.find(child => pathname.startsWith(child.url));
            if (matchedChild) {
                currentPage = item;
                break;
            }
        }
    }

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <SidebarTrigger />
                    <h2 className="text-xl font-semibold text-gray-900">{currentPage ? currentPage.title : ""}</h2>
                </div>
                {/* {currentPage.button && currentPage.url === pathname && (
                    <Link href={currentPage.nav}>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                            <span className="text-lg">+</span>
                            <span>{currentPage.btnName}</span>
                        </button>
                    </Link>
                )} */}
            </div>
        </header>
    );
}