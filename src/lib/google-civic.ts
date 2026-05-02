/**
 * Google Civic Information API Client
 * Fetches all available voter info and representative data from the Google Civic API.
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
  representatives?: {
    name: string;
    divisionId?: string;
    levels?: string[];
    roles?: string[];
    officials: { name: string; party?: string; phone?: string; urls?: string[]; emails?: string[] }[];
  }[];
  hasVoterInfo?: boolean;
  hasRepresentatives?: boolean;
}

export async function getVoterInfo(address: string): Promise<CivicData | null> {
  if (!API_KEY) {
    console.warn("GOOGLE_CIVIC_API_KEY is missing.");
    return null;
  }

  const combined: CivicData = {
    hasVoterInfo: false,
    hasRepresentatives: false,
  };

  // --- 1. Fetch Voter Info ---
  try {
    const url = new URL(`${BASE_URL}/voterinfo`);
    url.searchParams.append("key", API_KEY);
    url.searchParams.append("address", address);
    url.searchParams.append("electionId", "2000");

    const response = await fetch(url.toString());

    if (response.ok) {
      const data = await response.json();
      combined.hasVoterInfo = true;
      combined.election = data.election;
      combined.pollingLocations = data.pollingLocations;
      combined.earlyVoteSites = data.earlyVoteSites;
      combined.dropOffLocations = data.dropOffLocations;
      combined.contests = data.contests;
      combined.state = data.state;
    } else if (response.status !== 400) {
      console.error(`Voter info API error: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to fetch voter info:", error);
  }

  // --- 2. Fetch Representatives (always attempted, independent of voter info) ---
  try {
    const repUrl = new URL(`${BASE_URL}/representatives`);
    repUrl.searchParams.append("key", API_KEY);
    repUrl.searchParams.append("address", address);

    const repRes = await fetch(repUrl.toString());
    if (repRes.ok) {
      const repsData = await repRes.json();
      if (repsData?.officials && repsData?.offices) {
        combined.hasRepresentatives = true;
        combined.representatives = repsData.offices.map((office: any) => ({
          name: office.name,
          divisionId: office.divisionId,
          levels: office.levels,
          roles: office.roles,
          officials: office.officialIndices.map((idx: number) => {
            const official = repsData.officials[idx];
            if (!official) return null;
            return {
              name: official.name,
              party: official.party,
              phone: official.phones?.[0],
              urls: official.urls,
              emails: official.emails,
            };
          }).filter(Boolean),
        }));
      }
    }
  } catch (e) {
    console.error("Failed to fetch representatives:", e);
  }

  return combined;
}

function formatAddress(a: any): string {
  if (!a) return "Address not available";
  return [a.locationName, a.line1, a.line2, a.city, a.state, a.zip].filter(Boolean).join(", ");
}

export function formatCivicDataForPrompt(data: CivicData | null, address: string): string {
  const NOT_AVAILABLE = "(Not available in source: Google Civic public data)";

  let context = `=== CIVIC DATA FOR: ${address} ===\n`;
  context += `IMPORTANT INSTRUCTIONS:\n`;
  context += `- You have been given ALL available civic data from the Google Civic Information API for this user's address.\n`;
  context += `- Answer EVERY question using this data directly and specifically.\n`;
  context += `- If a specific piece of information is marked "${NOT_AVAILABLE}", explicitly tell the user that this information is not available in the Google Civic public data for their location.\n`;
  context += `- Do NOT redirect the user to vote.gov or other generic resources when the answer is present below.\n\n`;

  if (!data) {
    context += `No civic data could be retrieved for this address. If the user asks anything location-specific, say that the information is not available in source: Google Civic public data.\n`;
    return context;
  }

  // --- Election ---
  context += `--- ELECTION INFO ---\n`;
  if (data.election) {
    context += `Name: ${data.election.name || NOT_AVAILABLE}\n`;
    context += `Date: ${data.election.electionDay || NOT_AVAILABLE}\n`;
    context += `Election ID: ${data.election.id || NOT_AVAILABLE}\n`;
  } else {
    context += `Upcoming election details: ${NOT_AVAILABLE}\n`;
  }

  // --- Polling Locations ---
  context += `\n--- POLLING LOCATIONS ---\n`;
  if (data.pollingLocations && data.pollingLocations.length > 0) {
    data.pollingLocations.forEach((loc: any, i: number) => {
      context += `[${i + 1}] ${formatAddress(loc.address)}\n`;
      if (loc.pollingHours) context += `    Hours: ${loc.pollingHours}\n`;
      if (loc.notes) context += `    Notes: ${loc.notes}\n`;
    });
  } else {
    context += `Polling locations: ${NOT_AVAILABLE}\n`;
  }

  // --- Early Voting Sites ---
  context += `\n--- EARLY VOTING SITES ---\n`;
  if (data.earlyVoteSites && data.earlyVoteSites.length > 0) {
    data.earlyVoteSites.forEach((loc: any, i: number) => {
      context += `[${i + 1}] ${formatAddress(loc.address)}\n`;
      if (loc.pollingHours) context += `    Hours: ${loc.pollingHours}\n`;
      if (loc.startDate) context += `    Start: ${loc.startDate}, End: ${loc.endDate}\n`;
    });
  } else {
    context += `Early voting sites: ${NOT_AVAILABLE}\n`;
  }

  // --- Drop-off Locations ---
  context += `\n--- BALLOT DROP-OFF LOCATIONS ---\n`;
  if (data.dropOffLocations && data.dropOffLocations.length > 0) {
    data.dropOffLocations.forEach((loc: any, i: number) => {
      context += `[${i + 1}] ${formatAddress(loc.address)}\n`;
      if (loc.pollingHours) context += `    Hours: ${loc.pollingHours}\n`;
    });
  } else {
    context += `Ballot drop-off locations: ${NOT_AVAILABLE}\n`;
  }

  // --- Contests & Candidates ---
  context += `\n--- CONTESTS & CANDIDATES ON THE BALLOT ---\n`;
  if (data.contests && data.contests.length > 0) {
    data.contests.forEach((contest: any, i: number) => {
      context += `[${i + 1}] ${contest.office || contest.referendumTitle || "Contest"}\n`;
      if (contest.type) context += `    Type: ${contest.type}\n`;
      if (contest.level) context += `    Level: ${contest.level.join(", ")}\n`;
      if (contest.candidates && contest.candidates.length > 0) {
        context += `    Candidates:\n`;
        contest.candidates.forEach((c: any) => {
          context += `      - ${c.name}${c.party ? ` (${c.party})` : ""}${c.phone ? `, Phone: ${c.phone}` : ""}\n`;
        });
      }
      if (contest.referendumSubtitle) context += `    Summary: ${contest.referendumSubtitle}\n`;
    });
  } else {
    context += `Contest and ballot measure details: ${NOT_AVAILABLE}\n`;
  }

  // --- State Administration ---
  context += `\n--- STATE ELECTION ADMINISTRATION ---\n`;
  if (data.state && data.state.length > 0) {
    data.state.forEach((s: any) => {
      context += `State: ${s.name || NOT_AVAILABLE}\n`;
      const admin = s.electionAdministrationBody;
      if (admin) {
        if (admin.name) context += `  Admin Body: ${admin.name}\n`;
        if (admin.electionInfoUrl) context += `  Info URL: ${admin.electionInfoUrl}\n`;
        if (admin.electionRegistrationUrl) context += `  Registration URL: ${admin.electionRegistrationUrl}\n`;
        if (admin.absenteeVotingInfoUrl) context += `  Absentee Voting: ${admin.absenteeVotingInfoUrl}\n`;
        if (admin.ballotInfoUrl) context += `  Ballot Info: ${admin.ballotInfoUrl}\n`;
        if (admin.votingLocationFinderUrl) context += `  Voting Location Finder: ${admin.votingLocationFinderUrl}\n`;
        if (admin.electionRulesUrl) context += `  Election Rules: ${admin.electionRulesUrl}\n`;
        if (admin.hoursOfOperation) context += `  Office Hours: ${admin.hoursOfOperation}\n`;
        if (admin.physicalAddress) context += `  Physical Address: ${formatAddress(admin.physicalAddress)}\n`;
        if (admin.correspondenceAddress) context += `  Mailing Address: ${formatAddress(admin.correspondenceAddress)}\n`;
      }
    });
  } else {
    context += `State election administration info: ${NOT_AVAILABLE}\n`;
  }

  // --- Representatives ---
  context += `\n--- ELECTED OFFICIALS & REPRESENTATIVES ---\n`;
  if (data.representatives && data.representatives.length > 0) {
    data.representatives.forEach((office: any) => {
      if (office.officials && office.officials.length > 0) {
        context += `${office.name}`;
        if (office.levels) context += ` [${office.levels.join(", ")}]`;
        context += `:\n`;
        office.officials.forEach((official: any) => {
          context += `  - ${official.name}`;
          if (official.party) context += ` (${official.party})`;
          if (official.phone) context += `, Phone: ${official.phone}`;
          if (official.emails?.[0]) context += `, Email: ${official.emails[0]}`;
          if (official.urls?.[0]) context += `, Website: ${official.urls[0]}`;
          context += `\n`;
        });
      }
    });
  } else {
    context += `Elected officials / representatives: ${NOT_AVAILABLE}\n`;
  }

  context += `\n=== END OF CIVIC DATA ===\n`;
  return context;
}
