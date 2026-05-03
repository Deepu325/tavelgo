'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getFareEstimate, createBooking } from '@/app/bookings/actions'
import { Car, Truck, Zap, Loader2 } from 'lucide-react'

interface Estimate {
  type: string
  distance: number
  fare: number
}

export function BookingForm() {
  const [pickup, setPickup] = useState('')
  const [drop, setDrop] = useState('')
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [booking, setBooking] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (pickup.length > 3 && drop.length > 3) {
      const timer = setTimeout(async () => {
        setLoading(true)
        const data = await getFareEstimate(pickup, drop)
        setEstimates(data)
        setLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [pickup, drop])

  const handleBook = async () => {
    if (!selectedType) return
    const estimate = estimates.find((e) => e.type === selectedType)
    if (!estimate) return

    setBooking(true)
    const formData = new FormData()
    formData.append('pickup', pickup)
    formData.append('drop', drop)
    formData.append('vehicleType', selectedType)
    formData.append('distance', estimate.distance.toString())
    formData.append('fare', estimate.fare.toString())

    try {
      await createBooking(formData)
      setSuccess(true)
    } catch (error) {
      alert('Failed to create booking. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-2xl border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-700">Booking Confirmed!</CardTitle>
          <CardDescription>We are searching for a driver near you.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Button onClick={() => setSuccess(false)} variant="outline">Book Another</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl shadow-md">
      <CardHeader>
        <CardTitle>Where to?</CardTitle>
        <CardDescription>Enter your destination to see available rides.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pickup">Pick-up Location</Label>
            <Input
              id="pickup"
              placeholder="Enter pickup address"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="drop">Drop-off Location</Label>
            <Input
              id="drop"
              placeholder="Enter destination"
              value={drop}
              onChange={(e) => setDrop(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Calculating fares...
          </div>
        ) : estimates.length > 0 ? (
          <div className="space-y-4">
            <Label>Select Vehicle</Label>
            <div className="grid gap-4 sm:grid-cols-3">
              {estimates.map((est) => (
                <button
                  key={est.type}
                  onClick={() => setSelectedType(est.type)}
                  className={`flex flex-col items-center rounded-xl border-2 p-4 transition-all hover:border-blue-300 ${
                    selectedType === est.type ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-white'
                  }`}
                >
                  {est.type === 'Hatchback' && <Zap className="h-8 w-8 text-blue-500" />}
                  {est.type === 'Sedan' && <Car className="h-8 w-8 text-blue-600" />}
                  {est.type === 'SUV' && <Truck className="h-8 w-8 text-blue-700" />}
                  <span className="mt-2 font-bold">{est.type}</span>
                  <span className="text-sm text-gray-500">{est.distance} km</span>
                  <span className="mt-1 text-lg font-bold text-gray-900">₹{est.fare.toFixed(0)}</span>
                </button>
              ))}
            </div>
            <Button
              className="w-full bg-blue-600 py-6 text-lg font-bold hover:bg-blue-700 disabled:opacity-50"
              disabled={!selectedType || booking}
              onClick={handleBook}
            >
              {booking ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Confirming...
                </>
              ) : (
                `Book ${selectedType || 'Ride'}`
              )}
            </Button>
          </div>
        ) : pickup && drop ? (
          <div className="text-center py-8 text-gray-500 italic">
            Enter valid addresses to see estimates
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
