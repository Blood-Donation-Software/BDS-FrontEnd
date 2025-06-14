import AuthenticatedHeader from "@/components/authenticatedHeader/page"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function StaffLayout({children}) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  )
}