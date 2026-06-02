import { socketService } from './socketService';

let watchId: number | null = null;
let fallbackInterval: any = null;

type Options = {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
  intervalMs?: number; // used for fallback when geolocation unavailable
};

export function startDriverLocation(userId: string, options: Options = {}, onUpdate?: (coords: { lat: number; lng: number; timestamp: number }) => void) {
  if (!userId) return;
  socketService.connect(userId);

  const { enableHighAccuracy = true, maximumAge = 2000, timeout = 10000, intervalMs = 5000 } = options;

    if ('geolocation' in navigator) {
    if (watchId !== null) return; // already watching

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        socketService.emit('driver:location', { userId, coords, timestamp: Date.now() });
          if (onUpdate) onUpdate({ ...coords, timestamp: Date.now() });
      },
      (err) => {
        console.warn('Geolocation watch error:', err);
      },
      { enableHighAccuracy, maximumAge, timeout }
    );
  } else {
    // Fallback: emit simulated movement around a center
    if (fallbackInterval) return;
    fallbackInterval = setInterval(() => {
      const lat = 12.9716 + (Math.random() - 0.5) * 0.05;
      const lng = 77.5946 + (Math.random() - 0.5) * 0.05;
      const ts = Date.now();
      socketService.emit('driver:location', { userId, coords: { lat, lng }, timestamp: ts });
      if (onUpdate) onUpdate({ lat, lng, timestamp: ts });
    }, intervalMs);
  }
}

export function stopDriverLocation() {
  if (watchId !== null && 'geolocation' in navigator) {
    try {
      navigator.geolocation.clearWatch(watchId);
    } catch (e) {
      console.warn('Failed to clear geolocation watch', e);
    }
    watchId = null;
  }

  if (fallbackInterval) {
    clearInterval(fallbackInterval);
    fallbackInterval = null;
  }
}

export default {
  startDriverLocation,
  stopDriverLocation,
};
