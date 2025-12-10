"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Plane, Clock, Loader2, Check, Trash2, Bus } from "lucide-react"
import { useTravel, type Participant } from "@/lib/travel-context"
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

const busCompanies = [
  { value: "Primajasa", label: "Primajasa" },
  { value: "Budiman", label: "Budiman" },
  { value: "Harapan Jaya", label: "Harapan Jaya" },
  { value: "Pahala Kencana", label: "Pahala Kencana" },
  { value: "Rosalia Indah", label: "Rosalia Indah" },
  { value: "other", label: "Lainnya" },
]

const cities = [
  { value: "Jakarta", label: "Jakarta" },
  { value: "Jambi", label: "Jambi" },
  { value: "Bandung", label: "Bandung" },
  { value: "Surabaya", label: "Surabaya" },
  { value: "Yogyakarta", label: "Yogyakarta" },
  { value: "Semarang", label: "Semarang" },
  { value: "Malang", label: "Malang" },
  { value: "Solo", label: "Solo" },
  { value: "Bali", label: "Bali" },
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
  const router = useRouter()

  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)
  
  // Transportation type
  const [transportationType, setTransportationType] = useState<'flight' | 'bus'>('flight')
  
  // Cities
  const [originCity, setOriginCity] = useState("")
  const [destinationCity, setDestinationCity] = useState("")
  
  // Flight fields
  const [selectedAirline, setSelectedAirline] = useState("")
  const [flightCode, setFlightCode] = useState("")
  const [flightDepartureTime, setFlightDepartureTime] = useState("")
  const [customAirline, setCustomAirline] = useState("")
  const [showOtherAirline, setShowOtherAirline] = useState(false)
  
  // Bus fields
  const [busCompany, setBusCompany] = useState("")
  const [customBusCompany, setCustomBusCompany] = useState("")
  const [showOtherBus, setShowOtherBus] = useState(false)
  const [busTicketType, setBusTicketType] = useState("")
  const [busDepartureTime, setBusDepartureTime] = useState("")
  
  const [notes, setNotes] = useState("")
  const [participantName, setParticipantName] = useState("")
  const [participantPhone, setParticipantPhone] = useState("")

  // Don't return null - let Dialog handle the closed state
  const dateStr = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : ""
  const travelDate = date ? getTravelDate(dateStr) : undefined
  const participants = travelDate?.participants || []
  const formattedDate = date ? `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}` : ""

  const handleAirlineChange = (value: string) => {
    setSelectedAirline(value)
    setShowOtherAirline(value === "other")
  }

  const handleBusCompanyChange = (value: string) => {
    setBusCompany(value)
    setShowOtherBus(value === "other")
  }

  const resetForm = () => {
    setTransportationType('flight')
    setOriginCity("")
    setDestinationCity("")
    setSelectedAirline("")
    setFlightDepartureTime("")
    setFlightCode("")
    setCustomAirline("")
    setShowOtherAirline(false)
    setBusCompany("")
    setCustomBusCompany("")
    setShowOtherBus(false)
    setBusTicketType("")
    setBusDepartureTime("")
    setNotes("")
    setParticipantName("")
    setParticipantPhone("")
    setIsRegistered(false)
    setToast(null)
  }

  // Clear toast when modal opens or date changes to avoid persisting message across instances
  useEffect(() => {
    if (open) setToast(null)
  }, [open, date])

  // Auto-hide toast after timeout
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date) return
    
    // client-side: prevent user from registering twice for same date
    if (user && participants.some((p) => p.user_id === user.id)) {
      setToast({ type: "error", message: "Anda sudah terdaftar untuk tanggal ini" })
      return
    }

    setIsRegistering(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const participantData: Omit<Participant, "id" | "user_id" | "created_at"> = {
      name: participantName || user?.name || "Anonymous",
      phone: participantPhone || user?.email || "no-phone",
      transportation_type: transportationType,
      origin_city: originCity,
      destination_city: destinationCity,
      notes: notes || undefined,
    }

    if (transportationType === 'flight') {
      participantData.flight = selectedAirline === "other" ? customAirline : selectedAirline
      participantData.flight_code = flightCode
      participantData.flight_departure_time = flightDepartureTime
    } else {
      participantData.bus_company = busCompany === "other" ? customBusCompany : busCompany
      participantData.bus_ticket_type = busTicketType
      participantData.bus_departure_time = busDepartureTime
    }

    console.log("Participant Data:", participantData)

    try {
      await addParticipant(dateStr, participantData)
      setIsRegistered(true)
    } catch (err: any) {
      console.error("Register error:", err)
      setToast({ type: "error", message: err?.message || "Gagal mendaftar. Coba lagi." })
    } finally {
      setIsRegistering(false)
    }
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

  // Group participants by transportation type and details
  const groupedParticipants = participants.reduce(
    (acc, participant) => {
      let groupKey: string
      
      // Determine group key based on available data
      if (participant.transportation_type === 'flight' || participant.flight) {
        groupKey = `✈️ ${participant.flight || 'Unknown'} ${participant.flight_code || ''}`
      } else if (participant.transportation_type === 'bus' || participant.bus_company) {
        groupKey = `🚌 ${participant.bus_company || 'Unknown'} - ${participant.bus_ticket_type || 'Unknown'}`
      } else {
        // Fallback for old data without transportation_type
        groupKey = `✈️ ${participant.flight || 'Unknown'}`
      }
      
      if (!acc[groupKey]) {
        acc[groupKey] = []
      }
      acc[groupKey].push(participant)
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
                    {Object.keys(groupedParticipants).length} Grup Transport
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
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      onOpenChange(false)
                      router.push('/dashboard/calendar')
                    }}
                  >
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
                  {toast && (
                    <div className={`text-sm ${toast.type === 'error' ? 'text-destructive' : 'text-green-600'}`}>
                      {toast.message}
                    </div>
                  )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Nama lengkap"
                      value={participantName}
                      onChange={(e) => setParticipantName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Nomor Telepon/ID Line <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="08123456789"
                      value={participantPhone}
                      onChange={(e) => setParticipantPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="originCity">
                      Kota Awal <span className="text-red-500">*</span>
                    </Label>
                    <Select value={originCity} onValueChange={setOriginCity} required>
                      <SelectTrigger id="originCity">
                        <SelectValue placeholder="Pilih kota awal" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destinationCity">
                      Kota Akhir <span className="text-red-500">*</span>
                    </Label>
                    <Select value={destinationCity} onValueChange={setDestinationCity} required>
                      <SelectTrigger id="destinationCity">
                        <SelectValue placeholder="Pilih kota akhir" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transportationType">
                    Jenis Transportasi <span className="text-red-500">*</span>
                  </Label>
                  <Select value={transportationType} onValueChange={(value: 'flight' | 'bus') => setTransportationType(value)} required>
                    <SelectTrigger id="transportationType">
                      <SelectValue placeholder="Pilih jenis transportasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flight">
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4" />
                          Pesawat
                        </div>
                      </SelectItem>
                      <SelectItem value="bus">
                        <div className="flex items-center gap-2">
                          <Bus className="h-4 w-4" />
                          Bus
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {transportationType === 'flight' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="airline">
                          Maskapai <span className="text-red-500">*</span>
                        </Label>
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
                        <Label htmlFor="flightCode">
                          Kode Penerbangan <span className="text-red-500">*</span>
                        </Label>
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

                    {showOtherAirline && (
                      <div className="space-y-2">
                        <Label htmlFor="customAirline">
                          Nama Maskapai <span className="text-red-500">*</span>
                        </Label>
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
                      <Label htmlFor="flightTime">
                        Jam Keberangkatan <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="flightTime"
                          type="time"
                          value={flightDepartureTime}
                          onChange={(e) => setFlightDepartureTime(e.target.value)}
                          className="pl-10 font-mono"
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="busCompany">
                        Nama Travel <span className="text-red-500">*</span>
                      </Label>
                      <Select value={busCompany} onValueChange={handleBusCompanyChange} required>
                        <SelectTrigger id="busCompany">
                          <SelectValue placeholder="Pilih travel" />
                        </SelectTrigger>
                        <SelectContent>
                          {busCompanies.map((company) => (
                            <SelectItem key={company.value} value={company.value}>
                              {company.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {showOtherBus && (
                      <div className="space-y-2">
                        <Label htmlFor="customBusCompany">
                          Nama Travel <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="customBusCompany"
                          placeholder="Masukkan nama travel"
                          value={customBusCompany}
                          onChange={(e) => setCustomBusCompany(e.target.value)}
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="busTicketType">
                        Tipe Tiket <span className="text-red-500">*</span>
                      </Label>
                      <Select value={busTicketType} onValueChange={setBusTicketType} required>
                        <SelectTrigger id="busTicketType">
                          <SelectValue placeholder="Pilih tipe tiket" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ekonomi">Ekonomi</SelectItem>
                          <SelectItem value="Bisnis">Bisnis</SelectItem>
                          <SelectItem value="Eksekutif">Eksekutif</SelectItem>
                          <SelectItem value="VIP">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="busTime">
                        Waktu Keberangkatan <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="busTime"
                          type="time"
                          value={busDepartureTime}
                          onChange={(e) => setBusDepartureTime(e.target.value)}
                          className="pl-10 font-mono"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

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
                      isRegistering || 
                      !participantName || 
                      !participantPhone || 
                      !originCity || 
                      !destinationCity ||
                      (transportationType === 'flight' && (!selectedAirline || !flightCode || !flightDepartureTime)) ||
                      (transportationType === 'bus' && (!busCompany || !busTicketType || !busDepartureTime))
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
              Object.entries(groupedParticipants).map(([transportKey, transportParticipants]) => (
                <div key={transportKey} className="space-y-2">
                  <div className="flex items-center gap-2 py-2 border-b border-border">
                    <span className="font-medium text-sm">{transportKey}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{transportParticipants.length} peserta</span>
                  </div>
                  <div className="space-y-2 pl-6">
                    {transportParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-medium text-accent">
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{participant.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                            {/* Show transportation icon and details */}
                            {(participant.transportation_type === 'flight' || participant.flight) ? (
                              <>
                                <Plane className="h-3 w-3 shrink-0" />
                                {participant.origin_city && participant.destination_city ? (
                                  <>
                                    <span>{participant.origin_city} → {participant.destination_city}</span>
                                    <span>•</span>
                                  </>
                                ) : null}
                                {participant.flight_code ? (
                                  <>
                                    <span>{participant.flight_code}</span>
                                    {participant.flight_departure_time && <span>•</span>}
                                  </>
                                ) : null}
                                {participant.flight_departure_time ? (
                                  <span>{participant.flight_departure_time}</span>
                                ) : (
                                  // Show phone if no departure time
                                  <span>{participant.phone}</span>
                                )}
                              </>
                            ) : (participant.transportation_type === 'bus' || participant.bus_company) ? (
                              <>
                                <Bus className="h-3 w-3 shrink-0" />
                                {participant.origin_city && participant.destination_city ? (
                                  <>
                                    <span>{participant.origin_city} → {participant.destination_city}</span>
                                    <span>•</span>
                                  </>
                                ) : null}
                                {participant.bus_ticket_type ? (
                                  <>
                                    <span>{participant.bus_ticket_type}</span>
                                    {participant.bus_departure_time && <span>•</span>}
                                  </>
                                ) : null}
                                {participant.bus_departure_time ? (
                                  <span>{participant.bus_departure_time}</span>
                                ) : (
                                  // Show phone if no departure time
                                  <span>{participant.phone}</span>
                                )}
                              </>
                            ) : (
                              // Fallback for old data
                              <>
                                <span>{participant.phone}</span>
                              </>
                            )}
                            {participant.notes && <span className="text-accent">• {participant.notes}</span>}
                          </p>
                        </div>
                        {/* Show delete button only for own registration or if admin */}
                        {(user?.email === participant.user_id || user?.email === "admin@kmjpulbar.com") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveParticipant(participant.id)}
                            title="Hapus pendaftaran"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
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
