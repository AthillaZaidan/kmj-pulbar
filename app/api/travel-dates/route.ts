import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { supabase } from "@/lib/supabase"

// GET /api/travel-dates - Get all travel dates with participants
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")

    let query = supabase
      .from("travel_dates")
      .select(`
        *,
        participants (
          id,
          name,
          phone,
          transportation_type,
          origin_city,
          destination_city,
          flight,
          flight_code,
          flight_departure_time,
          bus_company,
          bus_ticket_type,
          bus_departure_time,
          notes,
          user_id,
          users (
            name,
            email,
            image
          )
        )
      `)
      .order("date", { ascending: true })

    if (dateParam) {
      query = query.eq("date", dateParam)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching travel dates:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("GET /api/travel-dates error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/travel-dates - Create new travel date (auto-create saat ada yang daftar)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { date, capacity = 50, is_available = true } = body

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }

    // Check if date already exists
    const { data: existingDate } = await supabase
      .from("travel_dates")
      .select("*")
      .eq("date", date)
      .single()

    if (existingDate) {
      // Return existing date instead of creating duplicate
      return NextResponse.json({ data: existingDate }, { status: 200 })
    }

    const { data, error } = await supabase
      .from("travel_dates")
      .insert({
        date,
        capacity,
        is_available,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating travel date:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error("POST /api/travel-dates error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/travel-dates - Update travel date (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { id, capacity, is_available } = body

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const updateData: any = {}
    if (capacity !== undefined) updateData.capacity = capacity
    if (is_available !== undefined) updateData.is_available = is_available

    const { data, error } = await supabase
      .from("travel_dates")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating travel date:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("PATCH /api/travel-dates error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
