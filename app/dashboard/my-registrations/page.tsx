"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useTravel } from "@/lib/travel-context"
import Link from "next/link"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, Plane, Clock, Trash2, Users, Download, Loader2 } from "lucide-react"

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

export default function MyRegistrationsPage() {
  const { data: session } = useSession()
  const { travelDates, removeParticipant, isLoading } = useTravel()
  const [myRegistrations, setMyRegistrations] = useState<any[]>([])

  useEffect(() => {
    if (session?.user?.id && travelDates.length > 0) {
      // Filter participants that belong to current user
      const userRegs: any[] = []
      travelDates.forEach((travelDate) => {
        travelDate.participants.forEach((participant) => {
          if (participant.user_id === session.user.id) {
            userRegs.push({
              ...participant,
              date: travelDate.date,
              travelDateId: travelDate.id,
              fellowTravelers: travelDate.participants.length,
            })
          }
        })
      })
      // Sort by date ascending
      userRegs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      setMyRegistrations(userRegs)
    }
  }, [session, travelDates])

  const handleDelete = async (participantId: string) => {
    try {
      await removeParticipant(participantId)
    } catch (error) {
      console.error("Error deleting registration:", error)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <Header title="Pendaftaran Saya" subtitle="Kelola semua pendaftaran keberangkatan Anda" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <Header title="Pendaftaran Saya" subtitle="Kelola semua pendaftaran keberangkatan Anda" />

      <div className="flex-1 overflow-auto p-6">
        {myRegistrations.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Pendaftaran</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Anda belum mendaftar untuk tanggal keberangkatan manapun. Pilih tanggal di kalender untuk mulai
                mendaftar.
              </p>
              <Link href="/dashboard/calendar">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Lihat Kalender</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{myRegistrations.length} Pendaftaran Aktif</p>
                    <p className="text-sm text-muted-foreground">
                      Keberangkatan terdekat: {formatDate(myRegistrations[0].date)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration Cards */}
            <div className="grid gap-4">
              {myRegistrations.map((registration) => (
                <Card key={registration.id} className="bg-card border-border overflow-hidden">
                  <div className="flex">
                    {/* Left accent bar */}
                    <div className="w-1.5 bg-accent" />

                    <CardContent className="flex-1 p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Date & Flight Info */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-accent" />
                            <span className="font-semibold text-card-foreground">{formatDate(registration.date)}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <Plane className="h-4 w-4" />
                              {registration.flight}
                              <span className="font-mono text-foreground">({registration.flight_code})</span>
                            </span>
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span className="font-mono text-foreground">{registration.departure_time}</span>
                            </span>
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              {registration.fellowTravelers} teman seperjalanan
                            </span>
                          </div>

                          {registration.notes && (
                            <p className="text-sm text-muted-foreground">
                              <span className="text-accent">Catatan:</span> {registration.notes}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive bg-transparent"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Batalkan Pendaftaran?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin membatalkan pendaftaran untuk tanggal{" "}
                                  <strong>{formatDate(registration.date)}</strong>? Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Tidak</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(registration.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Ya, Batalkan
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
