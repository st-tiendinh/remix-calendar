export function convertDateToNameDate(date: string) {
  return new Date(date).toLocaleString('en-us', {
    weekday: 'long',
  });
}
