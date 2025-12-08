"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { user, login, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Login gagal. Silakan coba lagi.")
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-3 text-primary-foreground hover:opacity-80 transition-opacity">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Kembali</span>
        </Link>

        <div className="space-y-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-accent/30">
            <Image src="/images/logo.jpg" alt="KMJ ITB" fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-primary-foreground">KMJ Pulang Bareng</h1>
            <p className="text-primary-foreground/70 mt-2 text-lg">
              Sistem koordinasi perjalanan Bandung-Jambi untuk Keluarga Mahasiswa Jambi ITB
            </p>
          </div>
        </div>

        <p className="text-primary-foreground/50 text-sm">
          &copy; {new Date().getFullYear()} Keluarga Mahasiswa Jambi ITB
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background lg:rounded-l-3xl">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardHeader className="space-y-1 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20">
                <Image src="/images/logo.jpg" alt="KMJ ITB" fill className="object-cover" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Selamat Datang</CardTitle>
            <CardDescription>Masuk ke akun Anda untuk melanjutkan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p className="mt-4 p-3 bg-muted rounded-lg">
                  <strong>Demo:</strong> Gunakan email apapun untuk login.
                  <br />
                  <span className="text-xs">admin@gmail.com untuk akses admin</span>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
