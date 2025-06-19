'use client'
import { SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/sidebar/sidebar"
import { Calendar, Newspaper, Warehouse, TriangleAlert, LayoutDashboard } from "lucide-react"
import AuthenticatedHeader from "@/components/authenticatedHeader/page"
import { ROLES, RouteProtection } from "@/components/auth"


export default function Layout({ children }) {
    const items = [
  {
    title: "Dashboard & Report",
    url: "/admins/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Account Management",
    url: "/admins/account-management",
    icon: Newspaper,
  },
  {
    title: "Event Request",
    url: "/admins/event-request",
    icon: Calendar,
  },
  {
    title: "Blog Request",
    url: "/admins/blog-request",
    icon: TriangleAlert,
  },
]
  return (
    <>
       <AppSidebar items={items}/>
       <main className="w-full">
        <AuthenticatedHeader items={items}/>
          <RouteProtection requiredRole={ROLES.ADMIN} hideOnNoAccess={true} redirectTo="/">
            {children}
          </RouteProtection>
       </main>
    </>
  )
}