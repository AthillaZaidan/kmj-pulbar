"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useTravel, type TravelDate } from "@/lib/travel-context"
import { useState } from "react"

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
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

interface TravelCalendarProps {
  onDateSelect: (date: Date, travelDate?: TravelDate) => void
  selectedDate?: Date
}

export function TravelCalendar({ onDateSelect, selectedDate }: TravelCalendarProps) {
  // Use real current date
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const { travelDates, getTravelDate } = useTravel()

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    return { daysInMonth, startingDay }
  }

  const formatDateStr = (day: number): string => {
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0")
    const dayStr = String(day).padStart(2, "0")
    return `${year}-${month}-${dayStr}`
  }

  const getTravelDateInfo = (day: number): TravelDate | undefined => {
    const dateStr = formatDateStr(day)
    return getTravelDate(dateStr)
  }

  const getFlightSummary = (participants: TravelDate["participants"]) => {
    const flights: Record<string, number> = {}
    participants.forEach((p) => {
      flights[p.flight] = (flights[p.flight] || 0) + 1
    })
    return Object.entries(flights).map(([airline, count]) => ({ airline, count }))
  }

  const getCapacityColor = (participantCount: number, capacity: number, isAvailable: boolean) => {
    if (!isAvailable) return "bg-muted text-muted-foreground"
    const percentage = (participantCount / capacity) * 100
    if (percentage >= 90) return "bg-red-100 text-red-700 border-red-300"
    if (percentage >= 70) return "bg-yellow-100 text-yellow-700 border-yellow-300"
    return "bg-green-100 text-green-700 border-green-300"
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth)

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border-b border-border gap-3 sm:gap-0 bg-linear-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={goToToday} className="text-xs sm:text-sm h-8 sm:h-9">
            Hari Ini
          </Button>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="h-8 w-8 sm:h-9 sm:w-9">
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={goToNextMonth} className="h-8 w-8 sm:h-9 sm:w-9">
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-semibold text-card-foreground">
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>

        <div className="w-20 sm:w-32" />
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/20">
        {DAYS.map((day) => (
          <div key={day} className="py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-muted-foreground">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: startingDay }).map((_, index) => (
          <div key={`empty-${index}`} className="min-h-20 sm:min-h-[120px] p-1.5 sm:p-2 border-b border-r border-border bg-muted/30" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const travelDate = getTravelDateInfo(day)
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
          const isSelected = selectedDate?.toDateString() === date.toDateString()
          const isToday = new Date().toDateString() === date.toDateString()
          const hasParticipants = travelDate && travelDate.participants.length > 0
          const flights = hasParticipants ? getFlightSummary(travelDate.participants) : []

          return (
            <div
              key={day}
              className={cn(
                "min-h-20 sm:min-h-[120px] p-1.5 sm:p-2 border-b border-r border-border cursor-pointer transition-all group relative",
                "hover:bg-accent/10 hover:shadow-md hover:scale-[1.02]",
                "active:scale-[0.98] active:shadow-inner",
                "touch-manipulation",
                isSelected && "bg-accent/10 ring-2 ring-accent ring-inset",
              )}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDateSelect(date, travelDate)
              }}
            >
              <div className="flex justify-between items-start mb-1 sm:mb-2">
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs sm:text-sm transition-colors font-medium",
                    isToday && "bg-accent text-accent-foreground font-bold ring-2 ring-accent/30 ring-offset-1",
                    !isToday && "text-card-foreground group-hover:bg-primary/10",
                  )}
                >
                  {day}
                </span>
                {hasParticipants ? (
                  <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full border font-medium bg-blue-100 text-blue-700 border-blue-300">
                    {travelDate.participants.length}
                  </span>
                ) : (
                  <span className="hidden sm:flex text-xs px-2 py-0.5 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity items-center gap-1">
                    <Plus className="h-3 w-3" />
                    Tambah
                  </span>
                )}
              </div>

              {/* Flight info cards */}
              {hasParticipants && (
                <div className="space-y-0.5 sm:space-y-1">
                  {flights.slice(0, 2).map((flight, i) => (
                    <div key={i} className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/5 rounded text-[10px] sm:text-xs">
                      <div
                        className={cn(
                          "w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full shrink-0",
                          i === 0 ? "bg-accent" : i === 1 ? "bg-primary" : "bg-muted-foreground",
                        )}
                      />
                      <span className="truncate text-card-foreground font-medium">{flight.airline}</span>
                      <span className="text-muted-foreground ml-auto text-[9px] sm:text-xs font-semibold">{flight.count}</span>
                    </div>
                  ))}
                  {flights.length > 2 && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground px-1.5 sm:px-2 font-medium">+{flights.length - 2} lainnya</p>
                  )}
                </div>
              )}

              {/* Empty state hint */}
              {!hasParticipants && (
                <div className="mt-2 sm:mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] sm:text-xs text-muted-foreground text-center">Klik untuk mendaftar</p>
                </div>
              )}
            </div>
          )
        })}

        {/* Empty cells after the last day */}
        {Array.from({ length: (7 - ((startingDay + daysInMonth) % 7)) % 7 }).map((_, index) => (
          <div key={`empty-end-${index}`} className="min-h-20 sm:min-h-[120px] p-1.5 sm:p-2 border-b border-r border-border bg-muted/30" />
        ))}
      </div>
    </div>
  )
}
