"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-accent/30">
              <Image src="/LOGO.jpg" alt="KMJ ITB" fill className="object-cover" />
            </div>
            <span className="text-primary-foreground font-bold text-lg hidden sm:block">KMJ ITB</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#fitur"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm font-medium"
            >
              Fitur
            </Link>
            <Link
              href="#tentang"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm font-medium"
            >
              Tentang
            </Link>
            <Link
              href="#faq"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm font-medium"
            >
              FAQ
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="h-9 w-20 bg-white/10 animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-primary-foreground flex items-center justify-center">
                        {user.image ? (
                          <Image src={user.image || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile">Profil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive cursor-pointer" onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                asChild
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-6"
              >
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-primary-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <Link
                href="#fitur"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                Fitur
              </Link>
              <Link
                href="#tentang"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                Tentang
              </Link>
              <Link href="#faq" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                FAQ
              </Link>
              <div className="flex gap-3 pt-4">
                {user ? (
                  <>
                    <Button asChild className="flex-1 bg-accent text-accent-foreground">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={logout}
                      className="border-white/20 text-primary-foreground bg-transparent"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button asChild className="flex-1 bg-primary-foreground text-primary">
                    <Link href="/login">Login</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
