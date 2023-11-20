export type RegisterForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type EventData = {
  title: string;
  description: string;
  date: Date;
  timeStart: number;
  timeEnd: number;
  location: string;
  meetingLink?: string;
  isPublic?: boolean;
  authorId: string;
};

export type ActionData = {
  error?: string | undefined;
  message?: string | undefined;
};

export type EventDate = {
  timeStart: number;
  timeEnd: number;
};
