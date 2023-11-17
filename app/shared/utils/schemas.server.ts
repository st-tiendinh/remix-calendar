import { z } from 'zod';

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(40, { message: 'Must be 40 or fewer characters long' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(160, { message: 'Must be 160 or fewer characters long' }),
  date: z.coerce
    .date()
    .refine((data) => data > new Date(), {
      message: 'Date must be in the future',
    }),
  timeStart: z.coerce
    .number()
    .min(1, { message: 'Time start is required' })
    .max(24),
  timeEnd: z.coerce
    .number()
    .min(1, { message: 'Time End is required' })
    .max(24),
  location: z.string().min(1, { message: 'Location is required' }),
  meetingLink: z.string().optional(),
});

