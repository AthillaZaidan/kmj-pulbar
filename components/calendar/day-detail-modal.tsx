"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Plane, Clock, Loader2, Check, Trash2 } from "lucide-react"
import { useTravel } from "@/lib/travel-context"
import { useAuth } from "@/lib/auth-context"

interface DayDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date?: Date
}

const airlines = [
  { value: "Garuda Indonesia", label: "Garuda Indonesia" },
  { value: "Lion Air", label: "Lion Air" },
  { value: "Batik Air", label: "Batik Air" },
  { value: "Citilink", label: "Citilink" },
  { value: "Sriwijaya Air", label: "Sriwijaya Air" },
  { value: "other", label: "Lainnya" },
]

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
]

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

export function DayDetailModal({ open, onOpenChange, date }: DayDetailModalProps) {
  const { user } = useAuth()
  const { getTravelDate, addParticipant, removeParticipant } = useTravel()

  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [selectedAirline, setSelectedAirline] = useState("")
  const [departureTime, setDepartureTime] = useState("")
  const [flightCode, setFlightCode] = useState("")
  const [notes, setNotes] = useState("")
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [customAirline, setCustomAirline] = useState("")
  const [participantName, setParticipantName] = useState("")
  const [participantEmail, setParticipantEmail] = useState("")

  // Don't return null - let Dialog handle the closed state
  const dateStr = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : ""
  const travelDate = date ? getTravelDate(dateStr) : undefined
  const participants = travelDate?.participants || []
  const formattedDate = date ? `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}` : ""

  const handleAirlineChange = (value: string) => {
    setSelectedAirline(value)
    setShowOtherInput(value === "other")
  }

  const resetForm = () => {
    setSelectedAirline("")
    setDepartureTime("")
    setFlightCode("")
    setNotes("")
    setCustomAirline("")
    setShowOtherInput(false)
    setParticipantName("")
    setParticipantEmail("")
    setIsRegistered(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date) return
    
    setIsRegistering(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const airlineName = selectedAirline === "other" ? customAirline : selectedAirline

    addParticipant(dateStr, {
      name: participantName || user?.name || "Anonymous",
      phone: participantEmail || user?.email || "no-phone",
      flight: airlineName,
      flight_code: flightCode,
      departure_time: departureTime,
      notes: notes || undefined,
    })

    setIsRegistering(false)
    setIsRegistered(true)
  }

  const handleRemoveParticipant = (participantId: string) => {
    removeParticipant(participantId)
  }

  const handleClose = (openState: boolean) => {
    if (!openState) {
      resetForm()
    }
    onOpenChange(openState)
  }

  // Group participants by flight
  const groupedParticipants = participants.reduce(
    (acc, participant) => {
      const flight = `${participant.flight} ${participant.flight_code}`
      if (!acc[flight]) {
        acc[flight] = []
      }
      acc[flight].push(participant)
      return acc
    },
    {} as Record<string, typeof participants>,
  )
  
  // Don't render if no date
  if (!open || !date) {
    return null
  }
  
  return (
    <Dialog open={open} onOpenChange={handleClose} modal={true}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <DialogTitle className="text-xl">{formattedDate}</DialogTitle>
              <DialogDescription>
                <span className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {participants.length} Peserta
                  </span>
                  <span className="flex items-center gap-1">
                    <Plane className="h-4 w-4" />
                    {Object.keys(groupedParticipants).length} Penerbangan
                  </span>
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="register" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Daftar</TabsTrigger>
            <TabsTrigger value="participants">Peserta ({participants.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="flex-1 overflow-auto mt-4">
            {isRegistered ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Berhasil Terdaftar!</h3>
                <p className="text-muted-foreground mb-4">
                  Anda telah terdaftar untuk keberangkatan tanggal {date.getDate()} {MONTHS[date.getMonth()]}.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetForm}>
                    Daftar Lagi
                  </Button>
                  <Button
                    onClick={() => handleClose(false)}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      placeholder="Nama lengkap"
                      value={participantName}
                      onChange={(e) => setParticipantName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@gmail.com"
                      value={participantEmail}
                      onChange={(e) => setParticipantEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="airline">Maskapai</Label>
                    <Select value={selectedAirline} onValueChange={handleAirlineChange} required>
                      <SelectTrigger id="airline">
                        <SelectValue placeholder="Pilih maskapai" />
                      </SelectTrigger>
                      <SelectContent>
                        {airlines.map((airline) => (
                          <SelectItem key={airline.value} value={airline.value}>
                            {airline.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flightCode">Kode Penerbangan</Label>
                    <Input
                      id="flightCode"
                      placeholder="GA-123"
                      value={flightCode}
                      onChange={(e) => setFlightCode(e.target.value)}
                      className="font-mono"
                      required
                    />
                  </div>
                </div>

                {showOtherInput && (
                  <div className="space-y-2">
                    <Label htmlFor="customAirline">Nama Maskapai</Label>
                    <Input
                      id="customAirline"
                      placeholder="Masukkan nama maskapai"
                      value={customAirline}
                      onChange={(e) => setCustomAirline(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="time">Waktu Keberangkatan</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="time"
                      type="time"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="pl-10 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan (Opsional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Contoh: Window seat, extra baggage, dll."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleClose(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    disabled={
                      isRegistering || !selectedAirline || !departureTime || !participantName || !participantEmail
                    }
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mendaftar...
                      </>
                    ) : (
                      "Daftar"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>

          <TabsContent value="participants" className="flex-1 overflow-auto mt-4 space-y-4">
            {participants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Peserta</h3>
                <p className="text-muted-foreground">Jadilah yang pertama mendaftar untuk tanggal ini!</p>
              </div>
            ) : (
              Object.entries(groupedParticipants).map(([flight, flightParticipants]) => (
                <div key={flight} className="space-y-2">
                  <div className="flex items-center gap-2 py-2 border-b border-border">
                    <Plane className="h-4 w-4 text-accent" />
                    <span className="font-medium text-sm">{flight}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{flightParticipants.length} peserta</span>
                  </div>
                  <div className="space-y-2 pl-6">
                    {flightParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-medium text-accent">
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{participant.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {participant.departure_time}
                            {participant.notes && <span className="text-accent">• {participant.notes}</span>}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveParticipant(participant.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
