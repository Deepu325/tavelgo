/**
 * Mock service to simulate distance calculation between two addresses.
 * In production, this would call Google Maps Distance Matrix API.
 */
export async function getMockDistance(pickup: string, drop: string): Promise<number> {
  // Simple deterministic "distance" based on string lengths for demo purposes
  const base = Math.abs(pickup.length - drop.length) + 5
  return base > 50 ? base / 2 : base
}

export interface VehicleRate {
  type: string
  base_fare: number
  rate_per_km: number
}

export function calculateFare(distance: number, rate: VehicleRate): number {
  return rate.base_fare + distance * rate.rate_per_km
}
