import { Color, Icon, List } from "@raycast/api";
import { eventGroupByDate, hasEventPassed, today } from "../helpers/date";
import { CalendarEvent } from "../types/event";
import { parseTime } from "../helpers/time";
import { getFavicon } from "@raycast/utils";
import { Attendee } from "../types/attendee";

type DayProps = {
  date: number
  events: CalendarEvent[]
}

export default function Day({ date, events }: DayProps) {
  // TODO: Revisit this before publishing
  const isAttending = (attendees: Attendee[]): boolean => {
    let responseStatus: string = "";

    attendees.forEach((attendee: Attendee) => {
      if (attendee.self && attendee.self == true) {
        if (attendee.responseStatus) { responseStatus = attendee.responseStatus; }
      }
    })

    return responseStatus == "accepted";
  }
  
  return (
    // TODO: Set current month
    <List.Section title={today(date.toString()) ? "Today" : `June ${date}`}>
      {eventGroupByDate(date, events).length > 0 ? (
        eventGroupByDate(date, events).map((event: CalendarEvent) => {
          const startDate = new Date(event.start?.dateTime).toTimeString();
          const endDate = new Date(event.end?.dateTime).toTimeString();
          
          return (
            <List.Item
              key={event.id}
              // TODO: shorten w/ new method -> listItemIcon()
              icon={ hasEventPassed(event.start.dateTime) ? { source: Icon.CheckCircle, tintColor: "#000000" } : { source: Icon.Calendar, tintColor: (isAttending(event.attendees) ? Color.Blue : "#000000") }}
              title={event.summary || "Untitled"}
              // TODO: parse out Zoom & Google Meet links
              accessories={[{ text: `${parseTime("start", startDate)} - ${parseTime("end", endDate)}` || "unknown" }, { icon: getFavicon("https://zoom.us") || "null" }]}
            />
          )
        })
      ) : null}
    </List.Section>
  );
}