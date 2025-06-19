import { ROLES, RouteProtection, UnauthorizedPage } from "@/components/auth"
import AuthenticatedHeader from "@/components/authenticatedHeader/page"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function StaffLayout({children}) {
  return (
    <SidebarProvider>
      <RouteProtection requiredRole={[ROLES.STAFF, ROLES.ADMIN]} requireAll={true} hideOnNoAccess={true} redirectTo="/">
        {children}
      </RouteProtection>
    </SidebarProvider>
  )
}