"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { TravelCalendar } from "@/components/calendar/travel-calendar"
import { DayDetailModal } from "@/components/calendar/day-detail-modal"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col h-screen">
      <Header title="Kalender" subtitle="Lihat dan pilih tanggal keberangkatan" />

      <div className="flex-1 overflow-auto p-6">
        <TravelCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
      </div>

      <DayDetailModal open={isModalOpen} onOpenChange={setIsModalOpen} date={selectedDate} />
    </div>
  )
}
