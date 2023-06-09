import { Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { fetchCalendarList } from "../oauth/google";
import { Calendar } from "../types/calendar";

type FilterDropdownProps = {
  setCalendar: React.Dispatch<React.SetStateAction<Calendar | null>>;
};

export default function CalendarFilterDropdown({ setCalendar }: FilterDropdownProps) {
  const [calendarList, setCalendarList] = useState<Calendar[]>([])

  // TODO: fix
  useEffect(() => {
    fetchCalendarList().then(data => {
      setCalendarList(data.items);
      setCalendar(data.items[0]);
    });
  }, [])

  return (
    // TODO: fix
    <List.Dropdown tooltip="Select Repository" storeValue onChange={setCalendar}>
      {calendarList && calendarList.length > 0 ? (
        <List.Dropdown.Section>
          {calendarList.map((calendar: Calendar) => {
              return (
                <List.Dropdown.Item
                    key={calendar.id}
                    icon={{source: Icon.CircleFilled, tintColor: calendar.backgroundColor}}
                    title={calendar.summary}
                    value={calendar.summary}
                />
              );
          })}
        </List.Dropdown.Section>
      ) : null}
    </List.Dropdown>
  );
}