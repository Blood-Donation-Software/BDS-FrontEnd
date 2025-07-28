'use client'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AppSidebar from "@/components/sidebar/sidebar"
import { Calendar, Newspaper, Warehouse, TriangleAlert, LayoutDashboard, FileText, Plus, List, QrCode, Droplet, Eye, AlertCircle, Package } from "lucide-react"
import BloodRequestProvider from "@/context/bloodRequest_context"
import AuthenticatedHeader from "@/components/authenticatedHeader/page"
import { useParams, usePathname } from "next/navigation"
import { ROLES, RouteProtection } from "@/components/auth"
import { useLanguage } from "@/context/language_context";

export default function Layout({ children }) {
  const {t} = useLanguage();
  const pathname = "/staffs";
  const params = useParams();
  const items = [
    {
      title: t?.sidebar?.dashboard,
      url: `/staffs/dashboard`,
      icon: LayoutDashboard,
      children: []
    },
    {
      title: t?.sidebar?.blogManagement,
      url: "/staffs/blog/list",
      icon: Newspaper,
      button: true,
      btnName: t?.sidebar?.newBlog,
      nav: `${pathname}/create`,
      children: [
        {
          title: t?.sidebar?.blogList,
          url: "/staffs/blog/list",
          icon: List,
        },
        {
          title: t?.sidebar?.createBlog,
          url: "/staffs/blog/create",
          icon: Plus,
        },
        {
          title: t?.sidebar?.blogRequests,
          url: "/staffs/blog/requests",
          icon: FileText,
        }
      ]
    },
    {
      title: t?.sidebar?.donationEvents,
      url: "/staffs/donation-event/list",
      icon: Calendar,
      button: true,
      btnName: t?.sidebar?.newEvent,  
      nav: `${pathname}/create-event`,
      children: [
        {
          title: t?.sidebar?.eventList,
          url: "/staffs/donation-event/list",
          icon: List,
        },
        {
          title: t?.sidebar?.createEvent,
          url: "/staffs/donation-event/create-event",
          icon: Plus,
        },
        {
          title: t?.sidebar?.checkIn,
          url: "/staffs/donation-event/checkin",
          icon: QrCode,
        },
        {
          title: t?.sidebar?.eventRequests, 
          url: "/staffs/donation-event/requests",
          icon: FileText,
        },
      ]
    },
    {
      title: t?.sidebar?.bloodRequests,
      url: "/staffs/emergency-request/list",
      icon: AlertCircle,
      button: true,
      btnName: t?.sidebar?.newRequest,
      nav: `${pathname}/create-request`,
      children: [
        {
          title: t?.sidebar?.requestList,
          url: "/staffs/emergency-request/list",
          icon: List,
        },
        {
          title: t?.sidebar?.createRequest,
          url: "/staffs/emergency-request/create-request",
          icon: Plus,
        },
      ]
    },
    {
      title: t?.sidebar?.bloodStock,
      url: "/staffs/blood-stock",
      icon: Droplet,
      children: [
        {
          title: t?.sidebar?.stockView,
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