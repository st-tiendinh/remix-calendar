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

export type Event = {
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
