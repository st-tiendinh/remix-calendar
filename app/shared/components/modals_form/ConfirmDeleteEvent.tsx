import React from 'react';
import { Form } from '../form';
import { z } from 'zod';
import { Link } from 'react-router-dom';

const deleteEventSchema = z.object({});
const ConfirmDeleteEvent = ({ eventId }: { eventId: string }) => {
  return (
    <>
      <Form
        schema={deleteEventSchema}
        method="post"
        action={`/events/${eventId}/delete`}
      >
        {({ Button }) => (
          <>
            <Button className="btn-delete">Yes</Button>
            <Link to={`/events/${eventId}/edit`}>Cancel</Link>
          </>
        )}
      </Form>
    </>
  );
};

export default ConfirmDeleteEvent;
