"use client";

interface CalendarButtonProps {
  title: string;
  date: string; // YYYY-MM-DD
}

export function CalendarButton({ title, date }: CalendarButtonProps) {
  const handleClick = () => {
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.append("action", "TEMPLATE");
    url.searchParams.append("text", title);
    
    // Format YYYYMMDD for an all-day event
    const formattedDate = date.replace(/-/g, "");
    url.searchParams.append("dates", `${formattedDate}/${formattedDate}`);
    url.searchParams.append("details", "Don't forget to vote! Find your polling location and check your registration status at vote.gov");
    
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 bg-blue-50 text-[#1B3A6B] border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors mt-2"
    >
      <span aria-hidden="true">📅</span> Add to Google Calendar
    </button>
  );
}
