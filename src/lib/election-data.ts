/**
 * Static election process data.
 * Phase 4 will expand this with richer content and possibly
 * pull from an external civic data API.
 */

import type { ElectionEvent, VotingStep, Topic } from "@/types";

// ─── Voting Steps ─────────────────────────────────────────────

export const VOTING_STEPS: VotingStep[] = [
  {
    id: 1,
    title: "Check Your Eligibility",
    description: "Confirm you meet the requirements to vote in your state.",
    icon: "✅",
    details: [
      "Must be a U.S. citizen",
      "Must be at least 18 years old on or before Election Day",
      "Must be a resident of the state where you register",
      "Some states have additional requirements",
    ],
  },
  {
    id: 2,
    title: "Register to Vote",
    description: "Register before your state's deadline — deadlines vary by state.",
    icon: "📋",
    details: [
      "Register online, by mail, or in person",
      "Deadlines range from 30 days before to same-day registration",
      "Update your registration if you move",
    ],
  },
  {
    id: 3,
    title: "Learn About the Candidates & Issues",
    description: "Research candidates, ballot measures, and local races.",
    icon: "🔍",
    details: [
      "Read candidate platforms and policy positions",
      "Review voter guides from nonpartisan organizations",
      "Understand ballot measures and propositions",
    ],
  },
  {
    id: 4,
    title: "Choose Your Voting Method",
    description: "Decide whether to vote in person, by mail, or early.",
    icon: "🗳️",
    details: [
      "In-person on Election Day",
      "Early in-person voting (available in most states)",
      "Mail-in or absentee ballot",
    ],
  },
  {
    id: 5,
    title: "Cast Your Vote",
    description: "Vote on or before Election Day.",
    icon: "🏛️",
    details: [
      "Find your polling location at vote.gov",
      "Bring required ID (varies by state)",
      "Mail ballots early to avoid delays",
    ],
  },
  {
    id: 6,
    title: "Track Results",
    description: "Follow election night results and certification.",
    icon: "📊",
    details: [
      "Results are reported by county election offices",
      "Certified results may take days to weeks",
      "Recounts can occur in close races",
    ],
  },
];

// ─── Topics ───────────────────────────────────────────────────

export const TOPICS: Topic[] = [
  {
    id: "registration",
    title: "Voter Registration",
    description: "How and when to register, deadlines, and ID requirements.",
    icon: "📋",
    color: "bg-blue-50 border-blue-200",
    suggestedQuestions: [
      "How do I register to vote?",
      "What is the voter registration deadline in my state?",
      "Can I register on Election Day?",
    ],
  },
  {
    id: "process",
    title: "The Voting Process",
    description: "Step-by-step guide from registration to casting your ballot.",
    icon: "🗳️",
    color: "bg-green-50 border-green-200",
    suggestedQuestions: [
      "What happens on Election Day?",
      "How does voting by mail work?",
      "What ID do I need to vote?",
    ],
  },
  {
    id: "primaries",
    title: "Primary Elections",
    description: "How parties select candidates before the general election.",
    icon: "🏆",
    color: "bg-yellow-50 border-yellow-200",
    suggestedQuestions: [
      "What is a primary election?",
      "What is the difference between open and closed primaries?",
      "How are delegates selected?",
    ],
  },
  {
    id: "electoral-college",
    title: "Electoral College",
    description: "How the U.S. elects a President through the Electoral College.",
    icon: "🗺️",
    color: "bg-purple-50 border-purple-200",
    suggestedQuestions: [
      "How does the Electoral College work?",
      "How many electoral votes does each state have?",
      "What is a swing state?",
    ],
  },
  {
    id: "types",
    title: "Types of Elections",
    description: "Presidential, midterm, local, and special elections explained.",
    icon: "📅",
    color: "bg-red-50 border-red-200",
    suggestedQuestions: [
      "What is the difference between a presidential and midterm election?",
      "When are local elections held?",
      "What is a special election?",
    ],
  },
  {
    id: "timeline",
    title: "Election Timeline",
    description: "Key dates from primaries through certification of results.",
    icon: "📆",
    color: "bg-orange-50 border-orange-200",
    suggestedQuestions: [
      "What is the full election calendar for a presidential election year?",
      "When are results certified?",
      "What is Inauguration Day?",
    ],
  },
];

// ─── Sample Timeline Events (Presidential Cycle) ──────────────
// TODO Phase 4: Replace with dynamic data or expand to cover all cycles

export const SAMPLE_TIMELINE_EVENTS: ElectionEvent[] = [
  {
    id: "1",
    title: "Candidate Announcements",
    date: "2024-01-01",
    description: "Candidates formally declare their candidacy for president.",
    type: "presidential",
    phase: "primary",
  },
  {
    id: "2",
    title: "Iowa Caucuses / Early Primaries",
    date: "2024-01-15",
    description: "First contests in the nominating process.",
    type: "primary",
    phase: "primary",
  },
  {
    id: "3",
    title: "Super Tuesday",
    date: "2024-03-05",
    description: "Multiple states hold primaries on the same day.",
    type: "primary",
    phase: "primary",
  },
  {
    id: "4",
    title: "Party Conventions",
    date: "2024-07-15",
    description: "Parties formally nominate their presidential candidates.",
    type: "presidential",
    phase: "convention",
  },
  {
    id: "5",
    title: "Presidential Debates",
    date: "2024-09-10",
    description: "Candidates debate policy positions before the general election.",
    type: "presidential",
    phase: "general",
  },
  {
    id: "6",
    title: "General Election Day",
    date: "2024-11-05",
    description: "Americans vote for president and other offices.",
    type: "presidential",
    phase: "general",
  },
  {
    id: "7",
    title: "Electoral College Votes",
    date: "2024-12-17",
    description: "Electors cast their official votes for president.",
    type: "presidential",
    phase: "post-election",
  },
  {
    id: "8",
    title: "Congress Certifies Results",
    date: "2025-01-06",
    description: "Congress officially counts and certifies electoral votes.",
    type: "presidential",
    phase: "post-election",
  },
  {
    id: "9",
    title: "Inauguration Day",
    date: "2025-01-20",
    description: "New president is sworn into office.",
    type: "presidential",
    phase: "post-election",
  },
];
