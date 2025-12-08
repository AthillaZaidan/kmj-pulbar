"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Plus, Users, Edit, Trash2, Settings } from "lucide-react"

interface TravelDate {
  id: string
  date: string
  dayName: string
  capacity: number
  registered: number
  status: "active" | "full" | "closed"
}

const mockDates: TravelDate[] = [
  { id: "1", date: "20 Januari 2025", dayName: "Senin", capacity: 50, registered: 12, status: "active" },
  { id: "2", date: "21 Januari 2025", dayName: "Selasa", capacity: 50, registered: 8, status: "active" },
  { id: "3", date: "22 Januari 2025", dayName: "Rabu", capacity: 50, registered: 45, status: "active" },
  { id: "4", date: "23 Januari 2025", dayName: "Kamis", capacity: 50, registered: 50, status: "full" },
  { id: "5", date: "24 Januari 2025", dayName: "Jumat", capacity: 50, registered: 15, status: "active" },
]

export default function DatesPage() {
  const [dates] = useState(mockDates)

  const getStatusBadge = (status: TravelDate["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>
      case "full":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Penuh</Badge>
      case "closed":
        return <Badge variant="secondary">Ditutup</Badge>
    }
  }

  const getCapacityColor = (registered: number, capacity: number) => {
    const percentage = (registered / capacity) * 100
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="flex flex-col h-screen">
      <Header title="Kelola Tanggal" subtitle="Atur tanggal keberangkatan yang tersedia" />

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Add Date Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Tanggal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Tanggal Keberangkatan</DialogTitle>
              <DialogDescription>Tambahkan tanggal baru untuk pendaftaran peserta</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal</Label>
                <Input id="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Kapasitas Maksimal</Label>
                <Input id="capacity" type="number" placeholder="50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi (Opsional)</Label>
                <Input id="description" placeholder="Keberangkatan pertama" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Batal</Button>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dates.map((travelDate) => (
            <Card key={travelDate.id} className="bg-card border-border">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground">{travelDate.date}</p>
                      <p className="text-sm text-muted-foreground">{travelDate.dayName}</p>
                    </div>
                  </div>
                  {getStatusBadge(travelDate.status)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Peserta
                    </span>
                    <span className="font-medium text-card-foreground">
                      {travelDate.registered}/{travelDate.capacity}
                    </span>
                  </div>
                  <Progress value={(travelDate.registered / travelDate.capacity) * 100} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
