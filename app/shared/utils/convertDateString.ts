export function convertDateToString(date: Date) {
  const dateConvert = new Date(date);
  const year = dateConvert.getFullYear();
  const month = String(dateConvert.getMonth() + 1).padStart(2, '0');
  const day = String(dateConvert.getDate()).padStart(2, '0');

  const dateString = `${day}-${month}-${year}`;
  return dateString;
}

export function formatDate(dateString: Date) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
