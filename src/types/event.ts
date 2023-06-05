export type CalendarEvent = {
  kind: string 
  etag: string 
  id: string 
  status: string 
  htmlLink: string 
  created: string 
  updated: string 
  summary: string
  description: string
  creator: object 
  organizer: object 
  start: {
    dateTime: string 
    timeZone: string
  }
  end: {
    dateTime: string 
    timeZone: string
  }
  iCalUID: string 
  sequence: number 
  attendees: object 
  reminders: object 
  eventType: string
}