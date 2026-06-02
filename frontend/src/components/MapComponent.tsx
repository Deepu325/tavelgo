import { GoogleMap, DirectionsRenderer, Polyline } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1.5rem',
};

const defaultCenter = {
  lat: 12.9716, // Bangalore
  lng: 77.5946
};

interface MapComponentProps {
  pickup: string;
  destination: string;
  isLoaded: boolean;
}

const MapComponent = ({ pickup, destination, isLoaded }: MapComponentProps) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[] | null>(null);

  useEffect(() => {
    if (!pickup || !destination || !window.google || !window.google.maps) return;

    const googleMaps = window.google.maps as any;
    setDirections(null);
    setRoutePath(null);

    const tryNewRoutesApi = async () => {
      if (!googleMaps.importLibrary) return false;
      try {
        const routesLib = await googleMaps.importLibrary('routes');
        if (!routesLib?.Route) return false;

        const routeService = new routesLib.Route();
        routeService.computeRoutes(
          {
            origin: { query: pickup },
            destination: { query: destination },
            travelMode: googleMaps.TravelMode.DRIVING,
          },
          (result: any, status: string) => {
            if (status !== 'OK' || !result.routes?.[0]) {
              return;
            }
            const encodedPolyline = result.routes[0]?.polyline?.encodedPolyline;
            if (encodedPolyline && googleMaps.geometry?.encoding?.decodePath) {
              const decodedPath = googleMaps.geometry.encoding.decodePath(encodedPolyline);
              setRoutePath(decodedPath.map((point: any) => ({ lat: point.lat(), lng: point.lng() })));
            }
          }
        );
        return true;
      } catch (err) {
        console.error('Failed to load routes library', err);
        return false;
      }
    };

    const loadRoute = async () => {
      const usedNewRoutes = await tryNewRoutesApi();
      if (usedNewRoutes) return;

      if (googleMaps.DirectionsService) {
        const directionsService = new googleMaps.DirectionsService();
        directionsService.route(
          {
            origin: pickup,
            destination: destination,
            travelMode: googleMaps.TravelMode.DRIVING,
          },
          (result: any, status: any) => {
            if (status === googleMaps.DirectionsStatus.OK) {
              setDirections(result);
            } else {
              console.error(`Error fetching directions: ${status}`);
            }
          }
        );
      }
    };

    loadRoute();
  }, [pickup, destination]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-slate-800/50 animate-pulse rounded-3xl border border-white/10 flex items-center justify-center text-slate-500">
        Loading Map...
      </div>
    );
  }

  // Dark mode map styles
  const darkMapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
  ];

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={defaultCenter}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        styles: darkMapStyles
      }}
    >
      {directions && (
        <DirectionsRenderer 
          directions={directions} 
          options={{
            polylineOptions: {
              strokeColor: "#a855f7", // Tailwind purple-500
              strokeWeight: 4,
              strokeOpacity: 0.8
            },
            suppressMarkers: false,
          }}
        />
      )}
      {routePath && (
        <Polyline
          path={routePath}
          options={{
            strokeColor: '#a855f7',
            strokeWeight: 4,
            strokeOpacity: 0.8,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default MapComponent;
