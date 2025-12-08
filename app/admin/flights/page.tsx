"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Plus, Plane, Edit, Trash2 } from "lucide-react"

interface Flight {
  id: string
  code: string
  airline: string
  departureTime: string
  passengers: number
  status: "active" | "inactive"
}

const mockFlights: Flight[] = [
  { id: "1", code: "GA-123", airline: "Garuda Indonesia", departureTime: "10:15", passengers: 26, status: "active" },
  { id: "2", code: "JT-456", airline: "Lion Air", departureTime: "12:00", passengers: 18, status: "active" },
  { id: "3", code: "ID-789", airline: "Batik Air", departureTime: "14:30", passengers: 12, status: "active" },
  { id: "4", code: "QG-321", airline: "Citilink", departureTime: "16:45", passengers: 8, status: "active" },
]

export default function FlightsPage() {
  const [flights] = useState(mockFlights)

  return (
    <div className="flex flex-col h-screen">
      <Header title="Kelola Penerbangan" subtitle="Atur daftar penerbangan yang tersedia" />

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Add Flight Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Penerbangan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Penerbangan</DialogTitle>
              <DialogDescription>Tambahkan opsi penerbangan baru untuk peserta</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Kode Penerbangan</Label>
                  <Input id="code" placeholder="GA-123" className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Waktu Berangkat</Label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="airline">Maskapai</Label>
                <Input id="airline" placeholder="Garuda Indonesia" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Batal</Button>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Flights Table */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Maskapai</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead className="text-center">Peserta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flights.map((flight) => (
                  <TableRow key={flight.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-accent" />
                        <span className="font-mono font-medium">{flight.code}</span>
                      </div>
                    </TableCell>
                    <TableCell>{flight.airline}</TableCell>
                    <TableCell className="font-mono">{flight.departureTime}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{flight.passengers}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
