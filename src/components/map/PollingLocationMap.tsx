"use client";

import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

interface PollingLocationMapProps {
  locations: Array<{
    name: string;
    lat: number;
    lng: number;
    address: string;
  }>;
}

export function PollingLocationMap({ locations }: PollingLocationMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  if (!apiKey) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
        Google Maps API key is missing. Map cannot be displayed.
      </div>
    );
  }

  if (locations.length === 0) {
    return null;
  }

  // Center on the first location
  const center = { lat: locations[0].lat, lng: locations[0].lng };

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200 mt-4 mb-4">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={13}
          mapId="DEMO_MAP_ID"
        >
          {locations.map((loc, idx) => (
            <AdvancedMarker key={idx} position={{ lat: loc.lat, lng: loc.lng }} title={loc.name}>
              <Pin background={"#B22234"} borderColor={"#8c1b29"} glyphColor={"#ffffff"} />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
