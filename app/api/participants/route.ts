import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { supabase } from "@/lib/supabase"

// GET /api/participants - Get all participants or user's registrations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const travelDateId = searchParams.get("travelDateId")

    let query = supabase
      .from("participants")
      .select(`
        *,
        travel_dates (
          date,
          capacity,
          is_available
        ),
        users (
          name,
          email,
          image
        )
      `)
      .order("created_at", { ascending: false })

    // Filter by user if specified (for "My Registrations")
    if (userId) {
      query = query.eq("user_id", userId)
    }

    // Filter by travel date if specified
    if (travelDateId) {
      query = query.eq("travel_date_id", travelDateId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching participants:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("GET /api/participants error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/participants - Register for a travel date
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { 
      travel_date_id, 
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
      notes 
    } = body

    // Validate required fields
    if (!travel_date_id || !name || !phone || !transportation_type || !origin_city || !destination_city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate transportation-specific fields
    if (transportation_type === 'flight' && (!flight || !flight_code || !flight_departure_time)) {
      return NextResponse.json({ error: "Missing flight information" }, { status: 400 })
    }

    if (transportation_type === 'bus' && (!bus_company || !bus_ticket_type || !bus_departure_time)) {
      return NextResponse.json({ error: "Missing bus information" }, { status: 400 })
    }

    // Check if travel date exists and is available
    const { data: travelDate, error: travelDateError } = await supabase
      .from("travel_dates")
      .select("*, participants(count)")
      .eq("id", travel_date_id)
      .single()

    if (travelDateError || !travelDate) {
      return NextResponse.json({ error: "Travel date not found" }, { status: 404 })
    }

    // Check if user already registered for this date
    const { data: existingRegistration } = await supabase
      .from("participants")
      .select("*")
      .eq("travel_date_id", travel_date_id)
      .eq("user_id", session.user.id)
      .single()

    if (existingRegistration) {
      return NextResponse.json({ error: "You are already registered for this date" }, { status: 400 })
    }

    // Create participant
    const { data, error } = await supabase
      .from("participants")
      .insert({
        travel_date_id,
        user_id: session.user.id,
        name,
        phone,
        transportation_type,
        origin_city,
        destination_city,
        flight: transportation_type === 'flight' ? flight : null,
        flight_code: transportation_type === 'flight' ? flight_code : null,
        flight_departure_time: transportation_type === 'flight' ? flight_departure_time : null,
        bus_company: transportation_type === 'bus' ? bus_company : null,
        bus_ticket_type: transportation_type === 'bus' ? bus_ticket_type : null,
        bus_departure_time: transportation_type === 'bus' ? bus_departure_time : null,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating participant:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error("POST /api/participants error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/participants - Update participant registration
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, phone, flight, flight_code, departure_time, notes } = body

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    // Check if participant exists and belongs to user (or user is admin)
    const { data: participant, error: fetchError } = await supabase
      .from("participants")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 })
    }

    if (participant.user_id !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updateData: any = {}
    if (name) updateData.name = name
    if (phone) updateData.phone = phone
    if (flight) updateData.flight = flight
    if (flight_code) updateData.flight_code = flight_code
    if (departure_time) updateData.departure_time = departure_time
    if (notes !== undefined) updateData.notes = notes

    const { data, error } = await supabase
      .from("participants")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating participant:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("PATCH /api/participants error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/participants - Cancel registration
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    // Check if participant exists and belongs to user (or user is admin)
    const { data: participant, error: fetchError } = await supabase
      .from("participants")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 })
    }

    if (participant.user_id !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete participant
    const { error } = await supabase.from("participants").delete().eq("id", id)

    if (error) {
      console.error("Error deleting participant:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update travel date availability if it was full
    const { data: travelDate } = await supabase
      .from("travel_dates")
      .select("*, participants(count)")
      .eq("id", participant.travel_date_id)
      .single()

    if (travelDate) {
      const currentParticipants = travelDate.participants?.[0]?.count || 0
      if (!travelDate.is_available && currentParticipants < travelDate.capacity) {
        await supabase
          .from("travel_dates")
          .update({ is_available: true })
          .eq("id", participant.travel_date_id)
      }
    }

    return NextResponse.json({ message: "Participant deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/participants error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
