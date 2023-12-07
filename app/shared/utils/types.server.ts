export type RegisterForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginForm = {
  email: string;
  password: string;
  redirectUrl?: string;
};

export type EventData = {
  title: string;
  description: string;
  date: Date;
  timeStart: string;
  timeEnd: string;
  location: string;
  meetingLink?: string;
  isPublic?: boolean;
  authorId: string;
  deletedAt?: null | Date;
};

export type CalendarEvent = {
  authorId: string;
  createdAt: string;
  date: string;
  deletedAt: null | string;
  description: string;
  id: string;
  isPublished: boolean;
  location: string;
  meetingLink: null | string;
  timeEnd: string;
  timeStart: string;
  title: string;
  updatedAt: string;
};

export type EventDate = {
  timeStart: string;
  timeEnd: string;
};

export type UserInfo = {
  firstName: string;
  lastName: string;
};

export type AdminInfo = {
  id: string;
  profile: UserInfo;
};

export type ActionData = {
  error?: string | undefined;
  message?: string | undefined;
};
