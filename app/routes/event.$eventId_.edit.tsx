import { type ActionFunctionArgs, json } from '@remix-run/node';
import { prisma } from '~/server/prisma.server';

// export const loader = async ({ params, request }: LoaderFunctionArgs) => {
//   // return redirect(`/event/${params.eventId}`);
// };

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const updatedEvent = await request.formData();
  const event = await prisma.event.update({
    where: { id: params.eventId },
    data: {
      title: updatedEvent.get('title') as string,
      description: updatedEvent.get('description') as string,
      date: updatedEvent.get('date') as string,
      timeStart: parseInt(updatedEvent.get('timeStart') as string),
      timeEnd: parseInt(updatedEvent.get('timeEnd') as string),
      location: updatedEvent.get('location') as string,
      mettingLink: updatedEvent.get('mettingLink') as string,
      isPublised: true,
      authorId: '6554698f48c5c41902cc2430',
    },
  });
  console.log(event);
  return json({ message: 'Event updated successfully', updatedEvent });
};

export default function EventEdit() {
  // return (
  //   <Form method="post">
  //     <input type="text" name="title" id="" value={''} />
  //     <input type="text" name="description" id="" value={''} />
  //     <input type="date" name="date" id="" value={''} />
  //     <input type="text" name="timeStart" id="" value={''} />
  //     <input type="text" name="timeEnd" id="" value={''} />
  //     <input type="text" name="location" id="" value={''} />
  //     <input type="text" name="isPublic" id="" value={'false'} />
  //     <input type="text" name="meetingLink" id="" value={''} />
  //     <button type="submit">Save</button>
  //   </Form>
  // );
  return <></>;
}
