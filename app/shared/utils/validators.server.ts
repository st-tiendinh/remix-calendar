import { EMAIL_REGEX } from '../constant/validator';

export const validateEmail = (email: string): string | undefined => {
  var validRegex =
  EMAIL_REGEX;
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
