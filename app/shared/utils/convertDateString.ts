export default function convertDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const dateString = `${year}-${month}-${day}`;
  return dateString;
}

export function convertDateToString(date: Date) {
  const dateConvert = new Date(date);
  const year = dateConvert.getFullYear();
  const month = String(dateConvert.getMonth() + 1).padStart(2, '0');
  const day = String(dateConvert.getDate()).padStart(2, '0');

  const dateString = `${day}-${month}-${year}`;
  return dateString;
}
