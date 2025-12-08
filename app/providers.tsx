"use client"

import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/lib/auth-context"
import { TravelProvider } from "@/lib/travel-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <TravelProvider>{children}</TravelProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
