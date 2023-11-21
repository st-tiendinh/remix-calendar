import { EMAIL_REGEX } from '../constant/validator';

export const validateEmail = (email: string): string | undefined => {
  var validRegex = EMAIL_REGEX;
  if (!email.length || !validRegex.test(email)) {
    return 'Please enter a valid email address';
  }
};

export const validatePassword = (password: string): string | undefined => {
  if (password.length < 8) {
    return 'Please enter a password that is at least 8 characters long';
  }
};

export const validateName = (name: string): string | undefined => {
  if (!name.length) return `Please enter a value`;
};

export const validateEventDate = (date: Date): string | undefined => {
  const currentDate = new Date();
  if (date < currentDate) return 'Event date must be in the future';
};

export const validateEventTime = (
  date: Date,
  timeStart: string,
  timeEnd: string
): string | undefined => {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  
  const eventDate = new Date(date);
  const [eventHour, eventMinute] = timeStart.split(':').map(Number);
  const [startHour, startMinute] = timeStart.split(':').map(Number);
  const [endHour, endMinute] = timeEnd.split(':').map(Number);
  
  if (
    eventDate.toDateString() === currentDate.toDateString() &&
    (eventHour < currentHour || (eventHour === currentHour && eventMinute <= currentMinute))
  ) {
    return 'Event time must be later than the current time';
  }

  
  if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
    return 'Event start time must be earlier than the end time';
  }
};
