import fetch from "node-fetch";
import { client } from "../oauth/google";
import { CalendarEvent } from "../types/event";
import { Attendee } from "../types/attendee";


type FetchEventsProps = {
  calendarId: React.Dispatch<React.SetStateAction<string>>;
}

export async function fetchEvents(calendarId: string): Promise<{ items: CalendarEvent[] }> {  
  const token = (await client.getTokens())?.accessToken

  const params = new URLSearchParams();
  params.append("orderBy", "startTime");

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
  const json = (await response.json()) as { items: CalendarEvent[] }
  return json;
}

function getEventParams() {
  const params = new URLSearchParams();

  params.append("singleEvents", "true");
  params.append("orderBy", "startTime");
  params.append("timeMin", "2023-06-05T02:33:48Z");
  params.append("timeMax", "2023-06-15T02:33:48Z");

  return params.toString();
}

export function isAttending(attendees: Attendee[]): boolean {
  let responseStatus: string = "";

  attendees.forEach((attendee: Attendee) => {
    if (attendee.self && attendee.self == true) {
      if (attendee.responseStatus) { responseStatus = attendee.responseStatus; }
    }
  })

  return responseStatus == "accepted";
}