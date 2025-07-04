'use client'
import { SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/sidebar/sidebar"
import { Calendar, Newspaper, Warehouse, TriangleAlert, LayoutDashboard } from "lucide-react"
import BloodRequestProvider from "@/context/bloodRequest_context"
import AuthenticatedHeader from "@/components/authenticatedHeader/page"
import { usePathname } from "next/navigation"
import { ROLES, RouteProtection } from "@/components/auth"


export default function Layout({ children }) {
  const pathname = usePathname();
    const items = [
  {
    title: "Dashboard",
    url: `/staffs/dashboard`,
    icon: LayoutDashboard,
  },
  {
    title: "Blog Management",
    url: "/staffs/blog",
    icon: Newspaper,
    button: true,
    btnName: "New Blog",
    nav: `${pathname}/create`
  },
  {
    title: "Donation Events",
    url: "/staffs/donation-event",
    icon: Calendar,
    button: true,
    btnName: "New Event",
    nav: `${pathname}/create-event`
  },
  {
    title: "Emergency Requests",
    url: "/staffs/emergency-request",
    icon: TriangleAlert,
    button: true,
    btnName: "New Request",
    nav: `${pathname}/create-request`
  },
  {
    title: "Blood Stock",
    url: "/staffs/blood-stock",
    icon: Warehouse,
  },
]
  return (
    <>
      <AppSidebar items={items}/>
      <BloodRequestProvider>
          <main className="w-full">
            <AuthenticatedHeader items={items}/>
              <RouteProtection requiredRole={ROLES.STAFF} hideOnNoAccess={true} redirectTo="/">
                {children}
              </RouteProtection>
          </main>
      </BloodRequestProvider>
    </>
  )
}