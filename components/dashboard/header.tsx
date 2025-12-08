"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Plus, User, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-20 bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Title */}
        <div className="lg:ml-0 ml-12">
          <h1 className="text-xl font-bold text-card-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center">
                  {user?.image ? (
                    <Image src={user.image || "/placeholder.svg"} alt="User avatar" fill className="object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Pengaturan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
