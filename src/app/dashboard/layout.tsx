import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Book,
  Bell,
  FileText,
  BookOpenCheck
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutButton } from '@/components/logout-button';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/users', label: 'Users', icon: Users },
  { href: '/dashboard/carnets', label: 'Carnet Requests', icon: CreditCard },
  { href: '/dashboard/courses', label: 'Courses', icon: Book },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/logs', label: 'Activity Logs', icon: FileText },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 p-2">
            <BookOpenCheck className="w-8 h-8 text-primary" />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">eLearn Admin</h2>
              <p className="text-xs text-muted-foreground">Admin Center</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-2">
            <LogoutButton />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-6">
            <div className="md:hidden flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <BookOpenCheck className="w-6 h-6 text-primary" />
                    <h2 className="text-md font-semibold">eLearn Admin</h2>
                </div>
                <SidebarTrigger />
            </div>
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
