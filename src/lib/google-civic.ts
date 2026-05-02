/**
 * Google Civic Information API Client
 */

const API_KEY = process.env.GOOGLE_CIVIC_API_KEY;
const BASE_URL = "https://www.googleapis.com/civicinfo/v2";

export interface CivicData {
  pollingLocations?: any[];
  earlyVoteSites?: any[];
  dropOffLocations?: any[];
  contests?: any[];
  state?: any[];
  election?: any;
}

export async function getVoterInfo(address: string): Promise<CivicData | null> {
  if (!API_KEY) {
    console.warn("GOOGLE_CIVIC_API_KEY is missing.");
    return null;
  }

  try {
    // electionId 2000 is the test election ID provided by Google
    // Replace with a real election ID or omit to get the next upcoming election for the address
    const url = new URL(`${BASE_URL}/voterinfo`);
    url.searchParams.append("key", API_KEY);
    url.searchParams.append("address", address);
    // In production, you would omit electionId to get the next upcoming election,
    // but for consistent testing we use the official test election (2000)
    // url.searchParams.append("electionId", "2000");

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      if (response.status === 400) {
        // Address not found or no upcoming election
        return null;
      }
      throw new Error(`Google Civic API error: ${response.status}`);
    }

    return (await response.json()) as CivicData;
  } catch (error) {
    console.error("Failed to fetch voter info:", error);
    return null;
  }
}

export function formatCivicDataForPrompt(data: CivicData | null, address: string): string {
  if (!data) return `No specific election data found for address: ${address}`;

  let context = `Location specific information for address: ${address}\n`;

  if (data.election) {
    context += `Upcoming Election: ${data.election.name} on ${data.election.electionDay}\n`;
  }

  if (data.pollingLocations && data.pollingLocations.length > 0) {
    context += `\nPolling Locations:\n`;
    data.pollingLocations.forEach((loc: any) => {
      context += `- ${loc.address.locationName || 'Polling Place'}: ${loc.address.line1}, ${loc.address.city}, ${loc.address.state} ${loc.address.zip}\n`;
      if (loc.pollingHours) context += `  Hours: ${loc.pollingHours}\n`;
    });
  }

  if (data.earlyVoteSites && data.earlyVoteSites.length > 0) {
    context += `\nEarly Voting Sites:\n`;
    data.earlyVoteSites.forEach((loc: any) => {
      context += `- ${loc.address.locationName || 'Early Voting Site'}: ${loc.address.line1}, ${loc.address.city}, ${loc.address.state} ${loc.address.zip}\n`;
      if (loc.pollingHours) context += `  Hours: ${loc.pollingHours}\n`;
    });
  }

  return context;
}
