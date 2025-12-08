"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, MoreHorizontal, Mail, Trash2 } from "lucide-react"

interface Participant {
  id: string
  name: string
  email: string
  phone: string
  registrations: number
  status: "active" | "inactive"
  joinedAt: string
}

const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "Rani Wijaya",
    email: "rani.wijaya@students.itb.ac.id",
    phone: "081234567890",
    registrations: 2,
    status: "active",
    joinedAt: "10 Des 2024",
  },
  {
    id: "2",
    name: "Budi Santoso",
    email: "budi.santoso@students.itb.ac.id",
    phone: "081234567891",
    registrations: 1,
    status: "active",
    joinedAt: "11 Des 2024",
  },
  {
    id: "3",
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@students.itb.ac.id",
    phone: "081234567892",
    registrations: 3,
    status: "active",
    joinedAt: "12 Des 2024",
  },
  {
    id: "4",
    name: "Ahmad Fauzi",
    email: "ahmad.fauzi@students.itb.ac.id",
    phone: "081234567893",
    registrations: 0,
    status: "inactive",
    joinedAt: "12 Des 2024",
  },
  {
    id: "5",
    name: "Dewi Putri",
    email: "dewi.putri@students.itb.ac.id",
    phone: "081234567894",
    registrations: 1,
    status: "active",
    joinedAt: "13 Des 2024",
  },
]

export default function ParticipantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [participants] = useState(mockParticipants)

  const filteredParticipants = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-screen">
      <Header title="Peserta" subtitle="Kelola semua peserta terdaftar" />

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari peserta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead className="text-center">Pendaftaran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bergabung</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell className="font-medium">{participant.name}</TableCell>
                    <TableCell className="text-muted-foreground">{participant.email}</TableCell>
                    <TableCell className="font-mono text-sm">{participant.phone}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{participant.registrations}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={participant.status === "active" ? "default" : "secondary"}
                        className={
                          participant.status === "active" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""
                        }
                      >
                        {participant.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{participant.joinedAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Kirim Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
