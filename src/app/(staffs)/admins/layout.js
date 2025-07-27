'use client'
import { SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/sidebar/sidebar"
import { Calendar, Newspaper, TriangleAlert, LayoutDashboard, UserPen } from "lucide-react"
import { Calendar, Newspaper, TriangleAlert, LayoutDashboard, UserPen } from "lucide-react"
import AuthenticatedHeader from "@/components/authenticatedHeader/page"
import { ROLES, RouteProtection } from "@/components/auth"
import { useLanguage } from "@/context/language_context"


export default function Layout({ children }) {
  const {t} = useLanguage();
  const items = [
    {
      title: t?.dropDownMenu?.dashReport,
      url: "/admins/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t?.dropDownMenu?.accountManagement,
      url: "/admins/account-management",
      icon: Newspaper,
    },
    {
      title: t?.dropDownMenu?.profileManager, 
      url: "/admins/profiles-management",
      icon: UserPen,
    },
    {
      title: t?.dropDownMenu?.eventRequest,
      url: "/admins/event-request",
      icon: Calendar,
    },
    {
      title: t?.dropDownMenu?.blogRequest,
      url: "/admins/blog-request",
      icon: TriangleAlert,
    },
  ]
  return (
    <>
      <AppSidebar items={items} />
      <main className="w-full">
        <AuthenticatedHeader items={items} />
        <RouteProtection requiredRole={ROLES.ADMIN} hideOnNoAccess={true} redirectTo="/">
          {children}
        </RouteProtection>
      </main>
      <AppSidebar items={items} />
      <main className="w-full">
        <AuthenticatedHeader items={items} />
        <RouteProtection requiredRole={ROLES.ADMIN} hideOnNoAccess={true} redirectTo="/">
          {children}
        </RouteProtection>
      </main>
    </>
  )
}