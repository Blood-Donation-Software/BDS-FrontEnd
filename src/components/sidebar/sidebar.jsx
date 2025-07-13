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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import { ChevronUp, SquareUserRound } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useUserProfile } from "@/context/user_context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { logout } from "@/apis/auth"

export default function AppSidebar({ items }) {
    const pathname = usePathname();

    const { account, isLoading, loggedIn, profile, setProfile, setAccount, setLoggedIn } = useUserProfile();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Call the logout API
            await logout();

            // Clear user data from context
            setProfile(null);
            setAccount(null);
            setLoggedIn(false);

            // Clear any stored tokens or session data
            if (typeof window !== 'undefined') {
                localStorage.clear();
                sessionStorage.clear();
            }

            // Redirect to login page
            router.push('/login');

            toast.success("Đăng xuất thành công!");
        } catch (error) {
            console.error("Logout error:", error);

            // Even if API call fails, clear local data and redirect
            setProfile(null);
            setAccount(null);
            setLoggedIn(false);

            if (typeof window !== 'undefined') {
                localStorage.clear();
                sessionStorage.clear();
            }

            router.push('/login');
        }
    }

    const handleClick = () => {
        router.push('../profile-manage');
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="h-[50px] flex flex-row items-center mt-2 overflow-hidden">
                <Image
                    alt="logo"
                    src="/logo.jpg"
                    width={50}
                    height={50}
                    className="rounded"
                />
                <span className="group-data-[collapsible=offcanvas]">
                    <div className="font-bold">
                        Blood Bank
                    </div>
                    <div className="text-sm text-gray-500">
                        Staff Portal
                    </div>
                </span>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Features</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname.startsWith(item.url);
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${isActive
                                            ? 'bg-red-50 border-l-4 border-red-500 text-red-700'
                                            : 'text-gray-700'
                                            }`}>
                                            <Link href={item.url}>
                                                <div>
                                                    <item.icon className="w-5 h-5" />

                                                </div>
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <div className="w-10 h-10 flex justify-center items-center">
                                        <SquareUserRound />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{profile?.name || account?.email || "User"}</span>
                                        <span className="text-gray-500">{account?.role || "Staff"}</span>
                                    </div>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="start"
                                className="w-[240px]"
                            >
                                <DropdownMenuItem onClick={handleClick}>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout}>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}