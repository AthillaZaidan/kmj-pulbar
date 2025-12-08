"use client"

import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Plane, TrendingUp, Download, Plus } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const stats = [
  {
    label: "Total Peserta",
    value: "47",
    change: "+12%",
    changeType: "positive",
    icon: Users,
  },
  {
    label: "Tanggal Aktif",
    value: "7",
    change: "3 tersisa",
    changeType: "neutral",
    icon: Calendar,
  },
  {
    label: "Penerbangan",
    value: "12",
    change: "4 maskapai",
    changeType: "neutral",
    icon: Plane,
  },
  {
    label: "Utilisasi",
    value: "78%",
    change: "+5%",
    changeType: "positive",
    icon: TrendingUp,
  },
]

const dateData = [
  { date: "20 Jan", peserta: 12 },
  { date: "21 Jan", peserta: 8 },
  { date: "22 Jan", peserta: 45 },
  { date: "23 Jan", peserta: 50 },
  { date: "24 Jan", peserta: 15 },
  { date: "25 Jan", peserta: 22 },
  { date: "26 Jan", peserta: 18 },
]

const flightData = [
  { name: "Garuda", value: 26, color: "#f29a4f" },
  { name: "Lion Air", value: 18, color: "#12143d" },
  { name: "Batik Air", value: 12, color: "#1a1c4a" },
  { name: "Citilink", value: 8, color: "#5a5c6d" },
]

const recentRegistrations = [
  { name: "Rani Wijaya", date: "20 Jan", flight: "GA-123", time: "2 jam lalu" },
  { name: "Budi Santoso", date: "22 Jan", flight: "JT-456", time: "4 jam lalu" },
  { name: "Siti Nurhaliza", date: "21 Jan", flight: "ID-789", time: "6 jam lalu" },
  { name: "Ahmad Fauzi", date: "23 Jan", flight: "GA-321", time: "8 jam lalu" },
]

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header title="Admin Dashboard" subtitle="Overview sistem Pulang Bareng" />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Tanggal
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-card-foreground mt-1">{stat.value}</p>
                    <p
                      className={`text-xs mt-1 ${
                        stat.changeType === "positive" ? "text-green-600" : "text-muted-foreground"
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bar Chart - Peserta per Hari */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Peserta per Tanggal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                      axisLine={{ stroke: "var(--border)" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                      axisLine={{ stroke: "var(--border)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="peserta" fill="#f29a4f" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart - Distribusi Maskapai */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Distribusi Maskapai</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={flightData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {flightData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Registrations */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pendaftaran Terbaru</CardTitle>
            <Button variant="ghost" size="sm" className="text-accent">
              Lihat Semua
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRegistrations.map((reg, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                      {reg.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{reg.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {reg.date} • {reg.flight}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{reg.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
