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
  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    const data = await getVoterInfo(address);
    if (!data) return NextResponse.json(null);

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
