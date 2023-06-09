import fetch from "node-fetch";
import { client } from "../oauth/google";
import { CalendarEvent } from "../types/event";
import { endOfCurrentMonthAsISOString, todayAsISOString } from "../helpers/date";

export async function fetchEvents(calendarId: string): Promise<{ items: CalendarEvent[] }> {  
  const token = (await client.getTokens())?.accessToken
  const url = `https://www.googleapis.com/calendar/v3/calendars/austin.mcdowell@shop-ware.com/events/?${getEventParams()}`;
  // TODO: fix this
  const url2 = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

  const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
  });

  if (!response.ok) {
    console.error("Error fetching events:", await response.text());
    throw new Error(response.statusText);
  }

  return (await response.json()) as { items: CalendarEvent[] };
}

function getEventParams() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const params = new URLSearchParams();

  params.append("singleEvents", "true");
  params.append("orderBy", "startTime");
  params.append("timeZone", timezone);
  params.append("timeMin", todayAsISOString());
  params.append("timeMax", endOfCurrentMonthAsISOString());

  return params.toString();
}