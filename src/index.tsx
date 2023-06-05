import { ActionPanel, Detail, List, Action, Icon, Color, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import CalendarFilterDropdown from "./components/calendarFilterDropdown";
import { withGoogleAuth } from "./components/withGoogleAuth";
import { fetchEvents, isAttending } from "./api/events";
import * as google from './oauth/google';
import { Calendar } from "./types/calendar";
import { CalendarEvent } from "./types/event";

function hasEventPassed(dateTime: string): boolean {
  let hasEventStarted: boolean;
  const now = new Date();
  const eventTime = new Date(dateTime);

  hasEventStarted = eventTime < now;

  return hasEventStarted;
}

function Schedule() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [calendar, setCalendar] = useState<Calendar>();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // TODO: fix this
  const parseTime = (time: string): string => {
    return time.split(" ")[0]
  }

  // TODO: clean this up
  // add fetchCalendars()
  useEffect(() => {
    (async () => {
      try {
        const fetchedItems = await fetchEvents(calendar?.id);
        setEvents(fetchedItems.items);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        showToast({ style: Toast.Style.Failure, title: String(error) });
      }
    })();
  }, [google]);

  if (isLoading) {
    return <Detail isLoading={isLoading} />;
  }

  return (
    <List
      isLoading={isLoading} 
      searchBarPlaceholder="Filter by meeting title"
      searchBarAccessory={
        // TODO: pass in calendars
        <CalendarFilterDropdown setCalendar={setCalendar} />
      }
    >
      <List.Section title="Next event">
        <List.Item
          key={events[0].id}
          icon={{ source: Icon.Calendar, tintColor: Color.Blue }}
          title={events[0].summary}
          accessories={[{ icon: events[0].description ? Icon.Message : null }, { text: `${parseTime(new Date(events[0].start?.dateTime).toTimeString())} - ${parseTime(new Date(events[0].end?.dateTime).toTimeString())}` || "unknown" }]}
        />
      </List.Section>

      <List.Section title="Today">
        {events && events.length > 0 ? (
          events.map((event: CalendarEvent) => {
            const startDate = new Date(event.start?.dateTime)
            const endDate = new Date(event.end?.dateTime)
            
            return (
              <List.Item
                key={event.id}
                icon={ hasEventPassed(event.start.dateTime) ? { source: Icon.CheckCircle, tintColor: Color.SecondaryText } : { source: Icon.Calendar, tintColor: (isAttending(event.attendees) ? Color.Blue : Color.SecondaryText) }}
                title={event.summary || "Untitled"}
                accessories={[{ icon: event.description ? Icon.Message : null }, { text: `${parseTime(startDate.toTimeString())} - ${parseTime(endDate.toTimeString())}` || "unknown" }]}
              />
            )
          })
        ) : null}
      </List.Section>
    </List>
  );
}

export default function MySchedule() {
  return (
    withGoogleAuth(<Schedule />)
  );
}

