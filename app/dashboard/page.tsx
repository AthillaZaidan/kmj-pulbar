"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TravelCalendar } from "@/components/calendar/travel-calendar"
import { DayDetailModal } from "@/components/calendar/day-detail-modal"
import { useAuth } from "@/lib/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setSelectedDate(undefined)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Header title="Dashboard" subtitle={`Selamat datang, ${user?.name || 'User'}! Pilih tanggal keberangkatan Anda.`} />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {user?.role === "admin" && <StatsCards />}

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Kalender Keberangkatan</h2>
          <TravelCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
        </div>
      </div>

      <DayDetailModal 
        open={isModalOpen} 
        onOpenChange={handleModalClose} 
        date={selectedDate} 
      />
    </div>
  )
}
