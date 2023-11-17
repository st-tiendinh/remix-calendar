import { prisma } from './prisma.server';
import type { EventData } from '~/shared/utils/types.server';

export async function updateEvent(eventData: EventData, id: string) {
  const event = await prisma.event.update({
    where: { id },
    data: eventData,
  });
  return event;
}
