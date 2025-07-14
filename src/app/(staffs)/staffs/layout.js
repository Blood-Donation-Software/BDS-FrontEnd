'use client'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AppSidebar from "@/components/sidebar/sidebar"
import { Calendar, Newspaper, Warehouse, TriangleAlert, LayoutDashboard } from "lucide-react"
import BloodRequestProvider from "@/context/bloodRequest_context"
import AuthenticatedHeader from "@/components/authenticatedHeader/page"
import { usePathname } from "next/navigation"
import { ROLES, RouteProtection } from "@/components/auth"

export default function Layout({ children }) {
  const pathname = "/staffs";
  const items = [
    {
      title: "Dashboard",
      url: `/staffs/dashboard`,
      icon: LayoutDashboard,
      children: []
    },
    {
      title: "Blog Management",
      url: "/staffs/blog",
      icon: Newspaper,
      button: true,
      btnName: "New Blog",
      nav: `${pathname}/create`,
      children: [
        {
          title: "Blog List",
          url: "/staffs/blog/list",
          icon: Newspaper,
        },
        {
          title: "Create Blog",
          url: "/staffs/blog/create",
          icon: Newspaper,
        },
        {
          title: "Blog Requests",
          url: "/staffs/blog/requests",
          icon: Newspaper,
        }
      ]
    },
    {
      title: "Donation Events",
      url: "/staffs/donation-event",
      icon: Calendar,
      button: true,
      btnName: "New Event",
      nav: `${pathname}/create-event`,
      children: [
        {
          title: "Event List",
          url: "/staffs/donation-event/list",
          icon: Calendar,
        },
        {
          title: "Create Event",
          url: "/staffs/donation-event/create-event",
          icon: Calendar,
        },
        {
          title: "Check In",
          url: "/staffs/donation-event/checkin",
          icon: Calendar,
        },
        {
          title: "Event Requests",
          url: "/staffs/donation-event/requests",
          icon: Calendar,
        }
      ]
    },
    {
      title: "Blood Requests",
      url: "/staffs/emergency-request",
      icon: TriangleAlert,
      button: true,
      btnName: "New Request",
      nav: `${pathname}/create-request`,
      children: [
        {
          title: "Request List",
          url: "/staffs/emergency-request/list",
          icon: TriangleAlert,
        },
        {
          title: "Create Request",
          url: "/staffs/emergency-request/create-request",
          icon: TriangleAlert,
        }
      ]
    },
    {
      title: "Blood Stock",
      url: "/staffs/blood-stock",
      icon: Warehouse,
      children: [
        {
          title: "Stock View",
          url: "/staffs/blood-stock",
          icon: Warehouse,
        },
      ]
    },
  ]
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar items={items} />
        <SidebarInset>
          <BloodRequestProvider>
            <div className="flex-1 flex flex-col overflow-hidden w-full">
              <AuthenticatedHeader items={items} />
              <main className="flex-1 overflow-y-auto bg-gray-50 w-full">
                <div className="w-full h-full">
                  <RouteProtection requiredRole={ROLES.STAFF} hideOnNoAccess={true} redirectTo="/">
                    {children}
                  </RouteProtection>
                </div>
              </main>
            </div>
          </BloodRequestProvider>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}