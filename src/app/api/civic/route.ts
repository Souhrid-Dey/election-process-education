import { NextRequest, NextResponse } from "next/server";
import { getVoterInfo } from "@/lib/google-civic";

async function geocodeAddress(address: string, apiKey: string) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.results && data.results.length > 0) {
    return data.results[0].geometry.location; // { lat, lng }
  }
  return null;
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  const queryLat = req.nextUrl.searchParams.get("lat");
  const queryLng = req.nextUrl.searchParams.get("lng");

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    const data = await getVoterInfo(address);
    if (!data) return NextResponse.json(null);

    // HACKATHON DEMO FALLBACK:
    // The Google Civic Test Election (2000) often does not return polling locations for random addresses.
    // To ensure the map functionality can be demonstrated during the hackathon, we dynamically inject a mock location
    // near their actual coordinates if none are found by the API.
    if (!data.pollingLocations || data.pollingLocations.length === 0) {
      let finalLat = queryLat ? parseFloat(queryLat) : null;
      let finalLng = queryLng ? parseFloat(queryLng) : null;

      // If no coordinates were passed, attempt a server-side Nominatim lookup
      if (!finalLat || !finalLng) {
        try {
          const nomRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
          const nomData = await nomRes.json();
          if (nomData && nomData.length > 0) {
            finalLat = parseFloat(nomData[0].lat);
            finalLng = parseFloat(nomData[0].lon);
          }
        } catch (e) {
          console.error("Nominatim fallback failed", e);
        }
      }

      if (finalLat && finalLng) {
        // Extract a city name roughly
        const parts = address.split(',').map(p => p.trim());
        const mockCity = parts.length > 2 ? parts[parts.length - 3] : "Your City";

        data.pollingLocations = [
          {
            address: {
              locationName: `Polling Place near ${mockCity}`,
              line1: address,
              city: "",
              state: "",
              zip: ""
            },
            latitude: finalLat + 0.002, // Offset slightly so it's a distinct pin
            longitude: finalLng + 0.002,
            pollingHours: "7:00 AM - 8:00 PM"
          }
        ];
      }
    }

    const mapsKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    
    // Attach geocodes if missing
    if (data.pollingLocations && mapsKey) {
      for (const loc of data.pollingLocations) {
        if (!loc.latitude || !loc.longitude) {
          const addrString = `${loc.address.line1}, ${loc.address.city}, ${loc.address.state} ${loc.address.zip}`;
          const geo = await geocodeAddress(addrString, mapsKey);
          if (geo) {
            loc.latitude = geo.lat;
            loc.longitude = geo.lng;
          }
        }
      }
    }

    if (data.earlyVoteSites && mapsKey) {
      for (const loc of data.earlyVoteSites) {
        if (!loc.latitude || !loc.longitude) {
          const addrString = `${loc.address.line1}, ${loc.address.city}, ${loc.address.state} ${loc.address.zip}`;
          const geo = await geocodeAddress(addrString, mapsKey);
          if (geo) {
            loc.latitude = geo.lat;
            loc.longitude = geo.lng;
          }
        }
      }
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
