"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Participant {
  id: string
  name: string
  email: string
  flight: string
  flightCode: string
  time: string
  notes?: string
  registeredAt: string
}

export interface TravelDate {
  date: string // ISO string format
  participants: Participant[]
  capacity: number
  isAvailable: boolean
}

interface TravelContextType {
  travelDates: TravelDate[]
  addParticipant: (dateStr: string, participant: Omit<Participant, "id" | "registeredAt">) => void
  removeParticipant: (dateStr: string, participantId: string) => void
  getTravelDate: (dateStr: string) => TravelDate | undefined
  updateCapacity: (dateStr: string, capacity: number) => void
  toggleAvailability: (dateStr: string) => void
}

const TravelContext = createContext<TravelContextType | null>(null)

// Initial mock data
const initialTravelDates: TravelDate[] = [
  {
    date: "2025-01-20",
    capacity: 50,
    isAvailable: true,
    participants: [
      {
        id: "1",
        name: "Rani Wijaya",
        email: "rani@gmail.com",
        flight: "Garuda Indonesia",
        flightCode: "GA-123",
        time: "10:15",
        registeredAt: "2025-01-10",
      },
      {
        id: "2",
        name: "Budi Santoso",
        email: "budi@gmail.com",
        flight: "Garuda Indonesia",
        flightCode: "GA-123",
        time: "10:15",
        notes: "Window seat",
        registeredAt: "2025-01-11",
      },
      {
        id: "3",
        name: "Siti Nurhaliza",
        email: "siti@gmail.com",
        flight: "Lion Air",
        flightCode: "JT-456",
        time: "12:00",
        registeredAt: "2025-01-12",
      },
    ],
  },
  {
    date: "2025-01-21",
    capacity: 50,
    isAvailable: true,
    participants: [
      {
        id: "4",
        name: "Ahmad Fauzi",
        email: "ahmad@gmail.com",
        flight: "Garuda Indonesia",
        flightCode: "GA-124",
        time: "09:00",
        registeredAt: "2025-01-10",
      },
      {
        id: "5",
        name: "Dewi Putri",
        email: "dewi@gmail.com",
        flight: "Batik Air",
        flightCode: "ID-789",
        time: "14:30",
        notes: "Extra baggage",
        registeredAt: "2025-01-11",
      },
    ],
  },
  {
    date: "2025-01-22",
    capacity: 50,
    isAvailable: true,
    participants: [
      {
        id: "6",
        name: "Reza Pratama",
        email: "reza@gmail.com",
        flight: "Citilink",
        flightCode: "QG-101",
        time: "08:00",
        registeredAt: "2025-01-09",
      },
    ],
  },
]

export function TravelProvider({ children }: { children: ReactNode }) {
  const [travelDates, setTravelDates] = useState<TravelDate[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("kmj-travel-dates")
    if (stored) {
      setTravelDates(JSON.parse(stored))
    } else {
      setTravelDates(initialTravelDates)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("kmj-travel-dates", JSON.stringify(travelDates))
    }
  }, [travelDates, isLoaded])

  const getTravelDate = (dateStr: string): TravelDate | undefined => {
    return travelDates.find((td) => td.date === dateStr)
  }

  const addParticipant = (dateStr: string, participant: Omit<Participant, "id" | "registeredAt">) => {
    setTravelDates((prev) => {
      const existing = prev.find((td) => td.date === dateStr)
      const newParticipant: Participant = {
        ...participant,
        id: crypto.randomUUID(),
        registeredAt: new Date().toISOString(),
      }

      if (existing) {
        return prev.map((td) =>
          td.date === dateStr ? { ...td, participants: [...td.participants, newParticipant] } : td,
        )
      } else {
        // Create new travel date entry
        return [
          ...prev,
          {
            date: dateStr,
            capacity: 50,
            isAvailable: true,
            participants: [newParticipant],
          },
        ]
      }
    })
  }

  const removeParticipant = (dateStr: string, participantId: string) => {
    setTravelDates((prev) =>
      prev.map((td) =>
        td.date === dateStr ? { ...td, participants: td.participants.filter((p) => p.id !== participantId) } : td,
      ),
    )
  }

  const updateCapacity = (dateStr: string, capacity: number) => {
    setTravelDates((prev) => prev.map((td) => (td.date === dateStr ? { ...td, capacity } : td)))
  }

  const toggleAvailability = (dateStr: string) => {
    setTravelDates((prev) => prev.map((td) => (td.date === dateStr ? { ...td, isAvailable: !td.isAvailable } : td)))
  }

  return (
    <TravelContext.Provider
      value={{
        travelDates,
        addParticipant,
        removeParticipant,
        getTravelDate,
        updateCapacity,
        toggleAvailability,
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
