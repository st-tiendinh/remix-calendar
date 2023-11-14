export const validateEmail = (email: string): string | undefined => {
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email.length || !validRegex.test(email)) {
    return "Please enter a valid email address"
  }
}

export const validatePassword = (password: string): string | undefined => {
  if (password.length < 6) {
    return "Please enter a password that is at least 6 characters long"
  }
}

