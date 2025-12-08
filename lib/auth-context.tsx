"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

// User data structure
export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  // Convert NextAuth session to our User format
  const user: User | null = session?.user
    ? {
        id: session.user.id || session.user.email || "",
        name: session.user.name || "User",
        email: session.user.email || "",
        image: session.user.image || undefined,
        // Check if email is admin email
        role: session.user.email === "athillazaidanstudy@gmail.com" ? "admin" : "user",
      }
    : null

  const login = async () => {
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  const logout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
