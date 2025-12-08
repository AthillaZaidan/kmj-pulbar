"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TravelCalendar } from "@/components/calendar/travel-calendar"
import { DayDetailModal } from "@/components/calendar/day-detail-modal"

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTravelDate, setSelectedTravelDate] = useState<any>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDateSelect = (date: Date, travelDate?: any) => {
    setSelectedDate(date)
    setSelectedTravelDate(travelDate)
    if (travelDate) {
      setIsModalOpen(true)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Header title="Dashboard" subtitle="Selamat datang, Rani! Pilih tanggal keberangkatan Anda." />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <StatsCards />

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Kalender Keberangkatan</h2>
          <TravelCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
        </div>
      </div>

      <DayDetailModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        date={selectedDate}
        travelDate={selectedTravelDate}
      />
    </div>
  )
}
