"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Plane, TrendingUp, Loader2 } from "lucide-react"
import { useTravel } from "@/lib/travel-context"
import { useAuth } from "@/lib/auth-context"

export function StatsCards() {
  const { user } = useAuth()
  const { travelDates, isLoading } = useTravel()
  const [stats, setStats] = useState({
    totalParticipants: 0,
    popularFlight: "",
    popularFlightCount: 0,
    favoriteDateStr: "",
    favoriteDateCount: 0,
  })

  useEffect(() => {
    if (!travelDates.length) return

    // Calculate total participants
    let total = 0
    const flightCounts: Record<string, number> = {}
    const dateCounts: Record<string, number> = {}

    travelDates.forEach((travelDate) => {
      const count = travelDate.participants.length
      total += count
      dateCounts[travelDate.date] = count

      travelDate.participants.forEach((p) => {
        flightCounts[p.flight] = (flightCounts[p.flight] || 0) + 1
      })
    })

    // Find most popular flight
    let maxFlight = ""
    let maxFlightCount = 0
    Object.entries(flightCounts).forEach(([flight, count]) => {
      if (count > maxFlightCount) {
        maxFlight = flight
        maxFlightCount = count
      }
    })

    // Find favorite date
    let maxDate = ""
    let maxDateCount = 0
    Object.entries(dateCounts).forEach(([date, count]) => {
      if (count > maxDateCount) {
        maxDate = date
        maxDateCount = count
      }
    })

    // Format favorite date
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      return `${date.getDate()} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Oct", "Nov", "Des"][date.getMonth()]}`
    }

    setStats({
      totalParticipants: total,
      popularFlight: maxFlight,
      popularFlightCount: maxFlightCount,
      favoriteDateStr: maxDate ? formatDate(maxDate) : "-",
      favoriteDateCount: maxDateCount,
    })
  }, [travelDates])

  // Only show for admin
  if (user?.role !== "admin") {
    return null
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-center h-24">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const displayStats = [
    {
      label: "Total Peserta",
      value: stats.totalParticipants.toString(),
      change: `Dari semua tanggal`,
      icon: Users,
      iconBg: "bg-accent/20",
      iconColor: "text-accent",
    },
    {
      label: "Penerbangan Populer",
      value: stats.popularFlight || "-",
      change: `${stats.popularFlightCount} peserta`,
      icon: Plane,
      iconBg: "bg-green-500/20",
      iconColor: "text-green-600",
    },
    {
      label: "Hari Terfavorit",
      value: stats.favoriteDateStr,
      change: `${stats.favoriteDateCount} peserta`,
      icon: TrendingUp,
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayStats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-card-foreground mt-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </div>
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", stat.iconBg)}>
                <stat.icon className={cn("h-6 w-6", stat.iconColor)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
