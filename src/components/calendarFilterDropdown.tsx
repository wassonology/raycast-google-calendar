import { Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { Calendar } from "../api/calendar";
import { fetchCalendarList } from "../oauth/google";

type FilterDropdownProps = {
  setCalendar: React.Dispatch<React.SetStateAction<Calendar | null>>;
};

export default function CalendarFilterDropdown({ setCalendar }: FilterDropdownProps) {
  const [calendarList, setCalendarList] = useState<Calendar[]>([])

  useEffect(() => {
    fetchCalendarList().then(data => {
      setCalendarList(data.items);
      setCalendar(data.items[0]);
    });
  }, [])

  return (
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