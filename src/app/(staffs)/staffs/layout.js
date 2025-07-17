'use client'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AppSidebar from "@/components/sidebar/sidebar"
import { Calendar, Newspaper, Warehouse, TriangleAlert, LayoutDashboard, FileText, Plus, List, QrCode, Droplet, Eye, AlertCircle, Package } from "lucide-react"
import BloodRequestProvider from "@/context/bloodRequest_context"
import AuthenticatedHeader from "@/components/authenticatedHeader/page"
import { useParams, usePathname } from "next/navigation"
import { ROLES, RouteProtection } from "@/components/auth"

export default function Layout({ children }) {
  const pathname = "/staffs";
  const params = useParams();
  const items = [
    {
      title: "Dashboard",
      url: `/staffs/dashboard`,
      icon: LayoutDashboard,
      children: []
    },
    {
      title: "Blog Management",
      url: "/staffs/blog/list",
      icon: Newspaper,
      button: true,
      btnName: "New Blog",
      nav: `${pathname}/create`,
      children: [
        {
          title: "Blog List",
          url: "/staffs/blog/list",
          icon: List,
        },
        {
          title: "Create Blog",
          url: "/staffs/blog/create",
          icon: Plus,
        },
        {
          title: "Blog Requests",
          url: "/staffs/blog/requests",
          icon: FileText,
        }
      ]
    },
    {
      title: "Donation Events",
      url: "/staffs/donation-event/list",
      icon: Calendar,
      button: true,
      btnName: "New Event",
      nav: `${pathname}/create-event`,
      children: [
        {
          title: "Event List",
          url: "/staffs/donation-event/list",
          icon: List,
        },
        {
          title: "Create Event",
          url: "/staffs/donation-event/create-event",
          icon: Plus,
        },
        {
          title: "Check In",
          url: "/staffs/donation-event/checkin",
          icon: QrCode,
        },
        {
          title: "Event Requests",
          url: "/staffs/donation-event/requests",
          icon: FileText,
        },
      ]
    },
    {
      title: "Blood Requests",
      url: "/staffs/emergency-request/list",
      icon: AlertCircle,
      button: true,
      btnName: "New Request",
      nav: `${pathname}/create-request`,
      children: [
        {
          title: "Request List",
          url: "/staffs/emergency-request/list",
          icon: List,
        },
        {
          title: "Create Request",
          url: "/staffs/emergency-request/create-request",
          icon: Plus,
        },
      ]
    },
    {
      title: "Blood Stock",
      url: "/staffs/blood-stock",
      icon: Droplet,
      children: [
        {
          title: "Stock View",
          url: "/staffs/blood-stock",
          icon: Eye,
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