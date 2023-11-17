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
  isPublic?: boolean
  meetingLink?: string;
  authorId: string;
};
