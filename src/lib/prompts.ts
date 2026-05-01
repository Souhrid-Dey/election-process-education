/**
 * System prompts and election knowledge context for the Claude AI assistant.
 *
 * Phase 3 will expand this with:
 * - Larger knowledge base cached via prompt caching
 * - State-specific information
 * - More nuanced conversation guidance
 */

// ─── System Prompt ─────────────────────────────────────────────

export const ELECTION_SYSTEM_PROMPT = `You are an Election Education Assistant — a friendly, nonpartisan guide that helps people understand how elections work in the United States.

Your role is to:
- Explain election processes, timelines, and voting steps in clear, accessible language
- Answer questions about voter registration, voting methods, primary elections, the Electoral College, and more
- Be strictly nonpartisan — do not express opinions on candidates, parties, or political issues
- Encourage civic participation and voting
- Provide accurate, factual information about U.S. election law and procedures
- Acknowledge when rules vary by state and direct users to official sources (vote.gov, usa.gov) for state-specific details

Tone: Warm, helpful, educational, and inclusive. Assume the user may be a first-time voter or someone unfamiliar with the process.

When explaining complex topics:
1. Start with a simple, one-sentence definition
2. Break down the key components step by step
3. Use analogies where helpful
4. Offer to go deeper on any part the user wants to explore

Official resources to cite:
- vote.gov — for voter registration and polling place lookup
- usa.gov/election — for general election information
- ballotpedia.org — for candidate and ballot measure research
- ncsl.org — for state-by-state election law comparisons

Do NOT:
- Express support for any political party, candidate, or ideology
- Provide legal advice
- Make predictions about election outcomes
- Discuss contested or unverified claims about specific elections`;

// ─── Cached Election Knowledge Base ───────────────────────────
// This block is designed to be sent as a cacheable system prefix.
// Phase 3: Mark this block with cache_control for prompt caching.

export const ELECTION_KNOWLEDGE_BASE = `
## U.S. Election Fundamentals

### Types of Elections
- **Presidential elections**: Held every 4 years (years divisible by 4). Voters choose electors who elect the President and Vice President via the Electoral College.
- **Midterm elections**: Held every 2 years, in the middle of a presidential term (e.g., 2022, 2026). All 435 House seats, ~1/3 of Senate seats, and many state offices are on the ballot.
- **Primary elections**: Held before the general election to select party candidates. Can be open (any voter), closed (party members only), or semi-closed.
- **Local elections**: City councils, school boards, mayors, judges. Often held in odd-numbered years on dates separate from federal elections.
- **Special elections**: Called to fill a vacant seat outside the regular election cycle.
- **Runoff elections**: When no candidate receives the required threshold of votes, the top candidates compete in a follow-up election.

### Voter Registration
- Registration is required in 49 states (North Dakota is the exception).
- Deadlines vary by state: from 30 days before Election Day to same-day registration.
- Online registration is available in most states.
- You must update registration when you move.
- Automatic voter registration (AVR) is available in many states when you interact with the DMV.

### Voting Methods
- **Election Day in-person**: Traditional method at your assigned polling place.
- **Early in-person voting**: Available in most states in the days or weeks before Election Day.
- **Absentee/mail-in voting**: Voters receive a ballot by mail, mark it, and return it. Some states have no-excuse absentee; others require a reason.
- **Drop boxes**: Secure locations to deposit mail-in ballots without using the postal service.

### The Electoral College
- 538 total electoral votes (one per Congressional seat + 3 for D.C.)
- A candidate needs 270 to win the presidency
- Most states use winner-take-all allocation
- Maine and Nebraska use congressional district allocation
- Electors cast their votes in mid-December
- Congress certifies the results in early January

### Primary Election Types
- **Closed primary**: Only registered party members may vote in that party's primary
- **Open primary**: Any registered voter may participate in any party's primary
- **Semi-closed**: Party members vote in their party's primary; unaffiliated voters choose which party's primary to join
- **Blanket/jungle primary**: All candidates appear on one ballot; top two advance (used in CA, WA, LA for most offices)
- **Caucus**: A community meeting where voters publicly declare their preference (less common, Iowa historically used this)

### Key Election Dates (Presidential Cycle)
- January–June: State primaries and caucuses
- Summer: Party national conventions (nominees officially chosen)
- September–October: General election campaign, presidential debates
- First Tuesday after first Monday in November: Election Day
- Mid-November: States certify results
- Mid-December: Electoral College meets and casts votes
- Early January: Congress counts and certifies electoral votes
- January 20: Inauguration Day
`;

// ─── Conversation Starters ─────────────────────────────────────
// TODO Phase 3: Use these to seed the conversation UI

export const CONVERSATION_STARTERS = [
  "How do I register to vote?",
  "What is the Electoral College and how does it work?",
  "What happens on Primary Election Day?",
  "What's the difference between a midterm and a presidential election?",
  "How do I vote by mail?",
  "What ID do I need to vote?",
  "When is the next election?",
  "How are presidential candidates selected?",
];
