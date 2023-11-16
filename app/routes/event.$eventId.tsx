import { json, type LoaderFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { prisma } from '~/server/prisma.server';

export let loader: LoaderFunction = async ({ params }) => {
  console.log(params);
  const event = await prisma.event.findUnique({
    where: { id: params.eventId },
  });
  return json(event);
};

export default function Event() {
  const data = useLoaderData<typeof loader>();
  console.log(data);

  return (
    <>
      <Form action="edit">
        <button type="submit">Edit</button>
      </Form>
    </>
  );
}
