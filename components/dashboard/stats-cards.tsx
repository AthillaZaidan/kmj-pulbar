import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, Plane, TrendingUp } from "lucide-react"

const stats = [
  {
    label: "Total Peserta",
    value: "47",
    change: "+12 minggu ini",
    icon: Users,
    iconBg: "bg-accent/20",
    iconColor: "text-accent",
  },
  {
    label: "Tanggal Tersedia",
    value: "7",
    change: "4 hampir penuh",
    icon: Calendar,
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
  },
  {
    label: "Penerbangan Populer",
    value: "Garuda",
    change: "26 peserta",
    icon: Plane,
    iconBg: "bg-green-500/20",
    iconColor: "text-green-600",
  },
  {
    label: "Hari Terfavorit",
    value: "22 Jan",
    change: "45 peserta",
    icon: TrendingUp,
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-600",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
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
