"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Plane,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  BarChart3,
  FileText,
  Shield,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/participants", label: "Peserta", icon: Users },
  { href: "/admin/dates", label: "Tanggal", icon: Calendar },
  { href: "/admin/flights", label: "Penerbangan", icon: Plane },
  { href: "/admin/analytics", label: "Analitik", icon: BarChart3 },
  { href: "/admin/reports", label: "Laporan", icon: FileText },
]

const bottomNavItems = [{ href: "/admin/settings", label: "Pengaturan", icon: Settings }]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar rounded-lg text-sidebar-foreground"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-20 -translate-x-full lg:translate-x-0" : "w-64 translate-x-0",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image src="/images/logo.jpg" alt="Logo KMJ ITB" fill className="object-cover" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-sm text-sidebar-foreground">KMJ Admin</h1>
                  <Shield className="h-3.5 w-3.5 text-accent" />
                </div>
                <p className="text-xs text-sidebar-foreground/60">Panel Admin</p>
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
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
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
          {bottomNavItems.map((item) => {
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

          <Link href="/dashboard">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-3 py-2.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                collapsed && "justify-center px-0",
              )}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">Keluar Admin</span>}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!collapsed && <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setCollapsed(true)} />}
    </>
  )
}
