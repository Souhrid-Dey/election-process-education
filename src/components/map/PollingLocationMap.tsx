"use client";

import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

interface PollingLocationMapProps {
  locations: Array<{
    name: string;
    lat: number;
    lng: number;
    address: string;
  }>;
  userLocation?: { lat: number; lng: number; address?: string } | null;
}

export function PollingLocationMap({ locations, userLocation }: PollingLocationMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  if (!apiKey) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
        Google Maps API key is missing. Map cannot be displayed.
      </div>
    );
  }

  if (locations.length === 0 && !userLocation) {
    return null;
  }

  // Center on user location if available, otherwise first polling location
  const center = userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : { lat: locations[0]?.lat || 39.8283, lng: locations[0]?.lng || -98.5795 };

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200 mt-4 mb-4 relative">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={userLocation && locations.length > 0 ? 12 : 13}
          mapId="DEMO_MAP_ID"
        >
          {userLocation && (
            <AdvancedMarker position={{ lat: userLocation.lat, lng: userLocation.lng }} title="Your Location" zIndex={100}>
              <Pin background={"#1B3A6B"} borderColor={"#142a4a"} glyphColor={"#ffffff"} />
            </AdvancedMarker>
          )}
          {locations.map((loc, idx) => (
            <AdvancedMarker key={idx} position={{ lat: loc.lat, lng: loc.lng }} title={loc.name}>
              <Pin background={"#B22234"} borderColor={"#8c1b29"} glyphColor={"#ffffff"} />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
      <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs shadow border border-gray-200 flex gap-3">
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#1B3A6B] inline-block"></span> You</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#B22234] inline-block"></span> Polling Place</div>
      </div>
    </div>
  );
}
