'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  User,
  FileText,
  Mail,
  LogOut,
  Menu,
  Briefcase,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useQuery } from '@tanstack/react-query';
import { IContact } from '@/models/Contact';

const sidebarItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Skills', href: '/admin/skills', icon: Wrench },
  { name: 'Profile', href: '/admin/profile', icon: User },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Messages', href: '/admin/messages', icon: Mail },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldCheck },
];

export function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const { data: messages } = useQuery<IContact[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      const res = await fetch('/api/contact');
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const unreadCount = messages?.filter(m => !m.read).length || 0;

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-card border-r transition-all duration-300 md:translate-x-0 block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-16" : "w-44"
        )}
      >
        <div className="h-full flex flex-col">
          <div className={cn(
            "h-16 flex items-center border-b px-4",
            collapsed ? "justify-center" : "justify-between"
          )}>
            {!collapsed && <span className="text-sm font-bold truncate">Admin Panel</span>}
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hidden md:flex" 
                onClick={() => setCollapsed(!collapsed)}
            >
                <Menu className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
            {sidebarItems.map((item) => {
              const isMessages = item.name === 'Messages';
              // Check active state
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    "flex items-center transition-all duration-300 rounded-lg text-sm font-medium",
                    collapsed ? "justify-center px-0 py-2.5" : "justify-between px-3 py-2.5",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </div>
                  {!collapsed && isMessages && unreadCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-lg animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                  {collapsed && isMessages && unreadCount > 0 && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="p-3 border-t space-y-3">
            <div className={cn("flex", collapsed ? "justify-center" : "justify-between items-center px-3")}>
                {!collapsed && <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Theme</span>}
                <ThemeToggle />
            </div>
            <Button 
                variant="ghost" 
                className={cn(
                  "w-full text-destructive hover:bg-destructive/10 hover:text-destructive transition-all h-9",
                  collapsed ? "justify-center px-0" : "justify-start px-3"
                )}
                onClick={() => signOut({ callbackUrl: '/login' })}
                title={collapsed ? "Sign Out" : undefined}
            >
              <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
              {!collapsed && <span className="text-xs font-bold">Sign Out</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        collapsed ? "md:pl-16" : "md:pl-44"
      )}>
        <header className="h-16 flex items-center px-4 border-b bg-background md:hidden sticky top-0 z-30">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <span className="ml-4 font-bold">Menu</span>
        </header>
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
