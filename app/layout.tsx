import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "./providers"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KMJ Pulang Bareng - Keluarga Mahasiswa Jambi ITB",
  description: "Sistem koordinasi perjalanan Bandung-Jambi untuk Keluarga Mahasiswa Jambi ITB",
  icons: {
    icon: "/LOGO.svg",
    apple: "/images/LOGO.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#12143d",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}