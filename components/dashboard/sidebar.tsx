"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  User,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/calendar", label: "Kalender", icon: Calendar },
  { href: "/dashboard/my-registrations", label: "Pendaftaran Saya", icon: ClipboardList },
  { href: "/dashboard/profile", label: "Profil", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()

  // Filter nav items based on user role
  const filteredNavItems = user?.role === "admin" 
    ? navItems 
    : navItems.filter(item => item.href !== "/dashboard")

  return (
    <>
      {/* Mobile Menu Button */}
      {collapsed && (
        <button
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar rounded-lg text-sidebar-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image src="/LOGO.jpg" alt="Logo KMJ ITB" fill className="object-cover" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm text-sidebar-foreground">KMJ ITB</h1>
                <p className="text-xs text-sidebar-foreground/60">Pulang Bareng</p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full justify-start gap-3 px-3 py-2.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Keluar</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!collapsed && <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setCollapsed(true)} />}
    </>
  )
}
