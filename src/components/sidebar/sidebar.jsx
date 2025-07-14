'use client'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import { ChevronUp, SquareUserRound, ChevronDown, ChevronRight } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function AppSidebar({ items }) {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white">
            <SidebarHeader className="h-[70px] flex flex-row items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-pink-50">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Image
                            alt="logo"
                            src="/logo.jpg"
                            width={45}
                            height={45}
                            className="rounded-lg shadow-sm"
                        />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="group-data-[collapsible=icon]:hidden">
                        <div className="font-bold text-gray-900 text-lg">
                            Blood Bank
                        </div>
                        <div className="text-sm text-red-600 font-medium">
                            Staff Portal
                        </div>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-3 py-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        {items.map((item) => {
                            const hasChildren = item.children && item.children.length > 0;
                            const isChildActive = hasChildren && item.children.some(child => pathname === child.url);
                            const isActive = pathname === item.url || (hasChildren && isChildActive);
                            
                            return (
                                <SidebarMenu key={item.title}>
                                    <Collapsible defaultOpen={isActive}>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton className={`w-full flex items-center justify-between px-3 py-2.5 mb-1 rounded-lg text-left hover:bg-gray-50 transition-all duration-200 group ${isActive
                                                ? 'bg-red-50 border border-red-200 text-red-700 shadow-sm'
                                                : 'text-gray-700 hover:text-gray-900'
                                                }`}>
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-1.5 rounded-md transition-colors ${isActive 
                                                        ? 'bg-red-100 text-red-600' 
                                                        : 'text-gray-500 group-hover:text-gray-700'
                                                        }`}>
                                                        <item.icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-medium group-data-[collapsible=icon]:hidden">
                                                        {item.title}
                                                    </span>
                                                </div>
                                                {hasChildren && (
                                                    <ChevronDown className="w-4 h-4 text-gray-400 group-data-[state=open]:rotate-180 transition-transform duration-200 group-data-[collapsible=icon]:hidden" />
                                                )}
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        {hasChildren && (
                                            <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                                                <div className="ml-6 border-l border-gray-200 pl-4 mt-2 space-y-1">
                                                    {item.children.map((child) => {
                                                        const isChildActive = pathname === child.url;
                                                        return (
                                                            <SidebarMenuItem key={child.title}>
                                                                <SidebarMenuButton asChild className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left hover:bg-gray-50 transition-all duration-200 group ${isChildActive
                                                                    ? 'bg-red-50 border-l-3 border-red-500 text-red-700 font-medium'
                                                                    : 'text-gray-600 hover:text-gray-900'
                                                                    }`}>
                                                                    <Link href={child.url}>
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className={`p-1 rounded transition-colors ${isChildActive 
                                                                                ? 'bg-red-100 text-red-600' 
                                                                                : 'text-gray-400 group-hover:text-gray-600'
                                                                                }`}>
                                                                                <child.icon className="w-3.5 h-3.5" />
                                                                            </div>
                                                                            <span className="text-sm">
                                                                                {child.title}
                                                                            </span>
                                                                        </div>
                                                                    </Link>
                                                                </SidebarMenuButton>
                                                            </SidebarMenuItem>
                                                        )
                                                    })}
                                                </div>
                                            </CollapsibleContent>
                                        )}
                                    </Collapsible>
                                </SidebarMenu>
                            )
                        })}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-gray-100 bg-gray-50/50 p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors group">
                                    <div className="w-10 h-10 flex justify-center items-center bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white shadow-sm">
                                        <SquareUserRound className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                                        <span className="font-semibold text-gray-900">John Doe</span>
                                        <span className="text-xs text-gray-500">Staff Member</span>
                                    </div>
                                    <ChevronUp className="ml-auto w-4 h-4 text-gray-400 group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="start"
                                className="w-[240px] shadow-lg border border-gray-200"
                            >
                                <DropdownMenuItem className="px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                    <span className="font-medium">Account Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                    <span className="font-medium">Preferences</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="px-3 py-2 hover:bg-red-50 text-red-600 cursor-pointer">
                                    <span className="font-medium">Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}