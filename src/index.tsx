import { Color, Detail, Icon, List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { fetchEvents } from "./api/events";
import * as google from './oauth/google';
import CalendarFilterDropdown from "./components/calendarFilterDropdown";
import { withGoogleAuth } from "./components/withGoogleAuth";
import { eventsDateRange } from "./helpers/date";
import { parseTime } from './helpers/time';
import { Calendar } from "./types/calendar";
import { CalendarEvent } from "./types/event";
import Day from "./components/day";

function Schedule() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [calendar, setCalendar] = useState<Calendar>();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // TODO: clean this up
  useEffect(() => {
    (async () => {
      try {
        // TODO: fetchCalendars()
        const fetchedItems = await fetchEvents(calendar?.id);
        setEvents(fetchedItems.items);
        setIsLoading(false);
        showToast({ style: Toast.Style.Success, title: "Showing June's events!" });
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
      // TODO: fix
      searchBarAccessory={<CalendarFilterDropdown setCalendar={setCalendar} />}
    >
      <List.Section title="Next event">
        <List.Item
          key={events[0].id}
          icon={{ source: Icon.Calendar, tintColor: Color.Blue }}
          title={events[0].summary}
          accessories={[{ text: `${parseTime("start", new Date(events[0].start?.dateTime).toTimeString())} - ${parseTime("end", new Date(events[0].end?.dateTime).toTimeString())}` || "unknown" }, { icon: { source: Icon.Circle, tintColor: Color.SecondaryText} }]}
        />
      </List.Section>

      {
        eventsDateRange().map((date) => {
          return (
            // TODO: replace w/ currentMonth()
            <Day key={`June-${date}`} date={date} events={events} />
          )
        })
      }

    </List>
  );
}

export default function MySchedule() {
  return (
    withGoogleAuth(<Schedule />)
  );
}

