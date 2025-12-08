"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Dummy user data
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
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Dummy users for demo
const DUMMY_USERS: User[] = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@gmail.com",
    image: "/stylized-user-avatar.png",
    role: "user",
  },
  {
    id: "2",
    name: "Admin KMJ",
    email: "admin@gmail.com",
    image: "/professional-woman-avatar.png",
    role: "admin",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("kmj_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find user by email (password can be anything for demo)
    const foundUser = DUMMY_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem("kmj_user", JSON.stringify(foundUser))
      return true
    }

    // Create new user if not found
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email: email,
      role: "user",
    }
    setUser(newUser)
    localStorage.setItem("kmj_user", JSON.stringify(newUser))
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("kmj_user")
    router.push("/")
  }, [router])

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
