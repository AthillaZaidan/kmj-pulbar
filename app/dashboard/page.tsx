"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TravelCalendar } from "@/components/calendar/travel-calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Plane, Clock, Loader2, Check, Trash2 } from "lucide-react"
import { useTravel } from "@/lib/travel-context"
import { useAuth } from "@/lib/auth-context"

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
const airlines = [
  { value: "Garuda Indonesia", label: "Garuda Indonesia" },
  { value: "Lion Air", label: "Lion Air" },
  { value: "Batik Air", label: "Batik Air" },
  { value: "Citilink", label: "Citilink" },
  { value: "Sriwijaya Air", label: "Sriwijaya Air" },
  { value: "other", label: "Lainnya" },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const { getTravelDate, addParticipant, removeParticipant } = useTravel()
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form states
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [selectedAirline, setSelectedAirline] = useState("")
  const [phone, setPhone] = useState("")
  const [flightCode, setFlightCode] = useState("")
  const [departureTime, setDepartureTime] = useState("")
  const [notes, setNotes] = useState("")
  const [participantName, setParticipantName] = useState("")

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setSelectedAirline("")
    setPhone("")
    setFlightCode("")
    setDepartureTime("")
    setNotes("")
    setParticipantName("")
    setIsRegistered(false)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedDate(null)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate) return
    
    setIsRegistering(true)

    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`

    try {
      await addParticipant(dateStr, {
        name: participantName || user?.name || "Anonymous",
        phone: phone,
        flight: selectedAirline,
        flight_code: flightCode,
        departure_time: departureTime,
        notes: notes || undefined,
      })

      setIsRegistering(false)
      setIsRegistered(true)
    } catch (error: any) {
      setIsRegistering(false)
      alert(error.message || "Gagal mendaftar. Silakan coba lagi.")
    }
  }

  // Get travel data for selected date
  const dateStr = selectedDate 
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : ""
  const travelDate = selectedDate ? getTravelDate(dateStr) : undefined
  const participants = travelDate?.participants || []
  const formattedDate = selectedDate 
    ? `${DAYS[selectedDate.getDay()]}, ${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    : ""

  const groupedParticipants = participants.reduce((acc, participant) => {
    const flight = participant.flight
    if (!acc[flight]) acc[flight] = []
    acc[flight].push(participant)
    return acc
  }, {} as Record<string, typeof participants>)

  return (
    <div className="flex flex-col h-screen">
      <Header title="Dashboard" subtitle={`Selamat datang, ${user?.name || 'User'}! Pilih tanggal keberangkatan Anda.`} />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {user?.role === "admin" && <StatsCards />}

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Kalender Keberangkatan</h2>
          <TravelCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate || undefined} />
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col w-[95vw] sm:w-full">
          <DialogHeader>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base sm:text-xl truncate">{formattedDate}</DialogTitle>
                <DialogDescription>
                  <span className="flex items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {participants.length} Peserta
                    </span>
                    <span className="flex items-center gap-1">
                      <Plane className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {Object.keys(groupedParticipants).length} Penerbangan
                    </span>
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="register" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register">Daftar</TabsTrigger>
              <TabsTrigger value="participants">Peserta ({participants.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="register" className="flex-1 overflow-auto mt-4">
              {isRegistered ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Pendaftaran Berhasil!</h3>
                  <p className="text-muted-foreground mb-4">
                    Anda telah terdaftar untuk keberangkatan tanggal {selectedDate?.getDate()} {selectedDate && MONTHS[selectedDate.getMonth()]}.
                  </p>
                  <Button variant="outline" onClick={() => setIsRegistered(false)}>Daftar Lagi</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 px-1">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="name" className="text-sm">Nama Lengkap <span className="text-red-500">*</span></Label>
                    <Input 
                      id="name" 
                      placeholder="Nama lengkap" 
                      value={participantName} 
                      onChange={(e) => setParticipantName(e.target.value)} 
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="phone" className="text-sm">Nomor Telepon/ID Line <span className="text-red-500">*</span></Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="08123456789" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="airline" className="text-sm">Maskapai <span className="text-red-500">*</span></Label>
                    <Input 
                      id="airline"
                      placeholder="e.g., Garuda Indonesia, Lion Air, Batik Air" 
                      value={selectedAirline} 
                      onChange={(e) => setSelectedAirline(e.target.value)} 
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="flightCode" className="text-sm">Kode Penerbangan <span className="text-red-500">*</span></Label>
                      <Input 
                        id="flightCode" 
                        placeholder="GA-123" 
                        value={flightCode} 
                        onChange={(e) => setFlightCode(e.target.value)} 
                        required
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="time" className="text-sm">Jam Keberangkatan <span className="text-red-500">*</span></Label>
                      <Input 
                        id="time" 
                        type="time" 
                        value={departureTime} 
                        onChange={(e) => setDepartureTime(e.target.value)} 
                        required
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="notes" className="text-sm">Catatan (Opsional)</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Contoh: Window seat, extra baggage, dll." 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)}
                      className="text-sm sm:text-base resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>Batal</Button>
                    <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90" disabled={isRegistering}>
                      {isRegistering ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Mendaftar...</>) : "Daftar"}
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>

            <TabsContent value="participants" className="flex-1 overflow-auto mt-4">
              {participants.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mb-4 opacity-50" />
                  <p>Belum ada peserta terdaftar untuk tanggal ini.</p>
                  <p className="text-sm">Jadilah yang pertama mendaftar!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedParticipants).map(([flight, flightParticipants]) => (
                    <div key={flight} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Plane className="h-4 w-4 text-accent" />
                        <span className="font-medium">{flight}</span>
                        <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{flightParticipants.length} orang</span>
                      </div>
                      <div className="space-y-2">
                        {flightParticipants.map((p) => (
                          <div key={p.id} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.phone}</p>
                              <p className="text-xs text-muted-foreground">{p.flight_code} • {p.departure_time}</p>
                            </div>
                            {(user?.id === p.user_id || user?.role === "admin") && (
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeParticipant(p.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
