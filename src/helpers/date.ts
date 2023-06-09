import moment from "moment";
import { CalendarEvent } from "../types/event";

export const eventDate = (event: CalendarEvent): string => {
  if (event.start.dateTime) return event.start.dateTime.slice(8, 10);
  return "Date unknown";
}

export const eventGroupByDate = (date: number, events: CalendarEvent[]): CalendarEvent[] => {
  const eventsAtDate: CalendarEvent[] =[]
  events.map(event => { 
    if (date == Number(eventDate(event))) {
      eventsAtDate.push(event);
    }
  })
  return eventsAtDate;
}

export function hasEventPassed(dateTime: string): boolean {
  const now = new Date();
  const eventTime = new Date(dateTime);
  return eventTime < now;
}

// TODO: set date range
export const eventsDateRange = (): Array<number> => {
  return [8, 9, 10, 11, 12, 13, 14, 15];
}

function parseDate(date: string) {
  return date.slice(0, 10) + "T00:01:00Z"
}

export const today = (date: string): boolean => {
  const todaysDate = "8"
  return todaysDate == date;
}

export function todayAsISOString() {
  return parseDate(moment().format());
}

export function endOfCurrentMonthAsISOString() {
  var today = new Date();
  return new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString()
}