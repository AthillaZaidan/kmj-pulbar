"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession } from "next-auth/react"

export interface Participant {
  id: string
  name: string
  phone: string
  flight: string
  flight_code: string
  departure_time: string
  notes?: string
  user_id: string
  created_at?: string
}

export interface TravelDate {
  id: string
  date: string // YYYY-MM-DD format
  participants: Participant[]
  capacity: number
  is_available: boolean
}

interface TravelContextType {
  travelDates: TravelDate[]
  isLoading: boolean
  addParticipant: (dateStr: string, participant: Omit<Participant, "id" | "user_id" | "created_at">) => Promise<void>
  removeParticipant: (participantId: string) => Promise<void>
  getTravelDate: (dateStr: string) => TravelDate | undefined
  updateCapacity: (dateStr: string, capacity: number) => Promise<void>
  toggleAvailability: (dateStr: string) => Promise<void>
  refreshTravelDates: () => Promise<void>
}

const TravelContext = createContext<TravelContextType | null>(null)

export function TravelProvider({ children }: { children: ReactNode }) {
  const [travelDates, setTravelDates] = useState<TravelDate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  // Fetch travel dates from API
  const refreshTravelDates = async () => {
    if (!session?.user) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch("/api/travel-dates")
      
      if (!response.ok) {
        throw new Error("Failed to fetch travel dates")
      }

      const { data } = await response.json()
      
      // Transform API response to match TravelDate interface
      const transformedData: TravelDate[] = data.map((item: any) => ({
        id: item.id,
        date: item.date,
        capacity: item.capacity,
        is_available: item.is_available,
        participants: (item.participants || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          phone: p.phone,
          flight: p.flight,
          flight_code: p.flight_code,
          departure_time: p.departure_time,
          notes: p.notes,
          user_id: p.user_id,
          created_at: p.created_at,
        })),
      }))

      setTravelDates(transformedData)
    } catch (error) {
      console.error("Error fetching travel dates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    refreshTravelDates()
  }, [session])

  const getTravelDate = (dateStr: string): TravelDate | undefined => {
    return travelDates.find((td) => td.date === dateStr)
  }

  const addParticipant = async (
    dateStr: string,
    participant: Omit<Participant, "id" | "user_id" | "created_at">,
  ) => {
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    try {
      // Find or create travel date
      let travelDate = getTravelDate(dateStr)
      let travelDateId = travelDate?.id

      if (!travelDateId) {
        // Create travel date first
        const createDateResponse = await fetch("/api/travel-dates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: dateStr }),
        })

        if (!createDateResponse.ok) {
          throw new Error("Failed to create travel date")
        }

        const { data: newTravelDate } = await createDateResponse.json()
        travelDateId = newTravelDate.id
      }

      // Register participant
      const response = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          travel_date_id: travelDateId,
          ...participant,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to register participant")
      }

      // Refresh data
      await refreshTravelDates()
    } catch (error) {
      console.error("Error adding participant:", error)
      throw error
    }
  }

  const removeParticipant = async (participantId: string) => {
    try {
      const response = await fetch(`/api/participants?id=${participantId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove participant")
      }

      // Refresh data
      await refreshTravelDates()
    } catch (error) {
      console.error("Error removing participant:", error)
      throw error
    }
  }

  const updateCapacity = async (dateStr: string, capacity: number) => {
    const travelDate = getTravelDate(dateStr)
    if (!travelDate) {
      throw new Error("Travel date not found")
    }

    try {
      const response = await fetch("/api/travel-dates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: travelDate.id,
          capacity,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update capacity")
      }

      // Refresh data
      await refreshTravelDates()
    } catch (error) {
      console.error("Error updating capacity:", error)
      throw error
    }
  }

  const toggleAvailability = async (dateStr: string) => {
    const travelDate = getTravelDate(dateStr)
    if (!travelDate) {
      throw new Error("Travel date not found")
    }

    try {
      const response = await fetch("/api/travel-dates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: travelDate.id,
          is_available: !travelDate.is_available,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to toggle availability")
      }

      // Refresh data
      await refreshTravelDates()
    } catch (error) {
      console.error("Error toggling availability:", error)
      throw error
    }
  }

  return (
    <TravelContext.Provider
      value={{
        travelDates,
        isLoading,
        addParticipant,
        removeParticipant,
        getTravelDate,
        updateCapacity,
        toggleAvailability,
        refreshTravelDates,
      }}
    >
      {children}
    </TravelContext.Provider>
  )
}

export function useTravel() {
  const context = useContext(TravelContext)
  if (!context) {
    throw new Error("useTravel must be used within a TravelProvider")
  }
  return context
}
