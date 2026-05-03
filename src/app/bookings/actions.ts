'use server'

import { createClient } from '@/utils/supabase/server'
import { getMockDistance, calculateFare, type VehicleRate } from '@/lib/fare-calc'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getFareEstimate(pickup: string, drop: string) {
  const supabase = await createClient()
  
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('is_active', true)

  if (!vehicles) return []

  const distance = await getMockDistance(pickup, drop)

  return vehicles.map((v) => ({
    type: v.type,
    distance,
    fare: calculateFare(distance, v as VehicleRate),
  }))
}

export async function createBooking(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const pickup = formData.get('pickup') as string
  const drop = formData.get('drop') as string
  const vehicleType = formData.get('vehicleType') as string
  const distance = parseFloat(formData.get('distance') as string)
  const fare = parseFloat(formData.get('fare') as string)

  // Double check fare on server
  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('*')
    .eq('type', vehicleType)
    .single()

  if (!vehicle) throw new Error('Invalid vehicle type')

  const expectedFare = calculateFare(distance, vehicle as VehicleRate)
  
  // Optional: Allow a small tolerance for rounding
  if (Math.abs(fare - expectedFare) > 0.01) {
    console.warn(`Fare mismatch: client=${fare}, server=${expectedFare}`)
  }

  const { error } = await supabase.from('bookings').insert({
    user_id: user.id,
    pickup_address: pickup,
    drop_address: drop,
    vehicle_type: vehicleType,
    distance,
    fare: expectedFare, // Always use server-calculated fare
    status: 'pending',
  })

  if (error) {
    console.error('Booking error:', error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
  return { success: true }
}
