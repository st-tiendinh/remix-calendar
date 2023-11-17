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

  if (date.getDate() < currentDate.getDate() && date.getDate() !== currentDate.getDate()) return 'Event date must be in the future';
};

export const validateEventTime = (
  date: Date,
  timeStart: number,
  timeEnd: number
): string | undefined => {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  if (date === currentDate && timeStart <= currentHour)
    return 'Event time must be later than the current time';

  if (timeStart >= timeEnd)
    return 'Event start time must be earlier than the end time';
};
