export const formatNumberToDateString = (
  timeString: string,
  dateString: string
) => {
  const [hours, mins, secs] = timeString.split(':');

  const newHours = hours === undefined ? 0 : hours;
  const newMin = mins === undefined ? 0 : hours;
  const newSecs = secs === undefined ? 0 : hours;

  const date = new Date(`${dateString.split('T')}`);
  date.setHours(+newHours, +newMin, +newSecs);
  return date.toISOString();
};

export const formatTimeToISOString = (time: string, date: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const dateObj = new Date(date);
  dateObj.setHours(hours);
  dateObj.setMinutes(minutes);
  return dateObj.toISOString();
};
