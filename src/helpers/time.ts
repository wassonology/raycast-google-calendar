export function parseTime(rule: "start" | "end", time: string): string {
  const parsedTime = time.split(" ")[0].slice(0,5);
  const hour = parsedTime.slice(0,2);
  const minutes = parsedTime.slice(2,5);
  let twelveHourFormat: string;

  if (Number(hour) <= 12) return parsedTime + (rule == "start" ? "" : " am")

  const formattedHour = (Number(hour) - 12).toString();
  twelveHourFormat = formattedHour + minutes;

  return twelveHourFormat + (rule == "end" ? " pm" : "")
}