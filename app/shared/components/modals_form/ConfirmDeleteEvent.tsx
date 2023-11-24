import React from 'react';
import { Form } from '../Form';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useLocation } from '@remix-run/react';

const deleteEventSchema = z.object({});
const ConfirmDeleteEvent = ({ eventId }: { eventId: string }) => {
  const location = useLocation();
  console.log(location);

  return (
    <>
      <div className="modal-confirm">
        <p className="modal-confirm-title">
          Are you sure you want to delete this event?
        </p>
        <Form
          schema={deleteEventSchema}
          method="post"
          action={`/events/${eventId}/delete`}
        >
          {({ Button }) => (
            <>
              <div className="modal-confirm-footer">
                <Button className="btn-confirm">Yes</Button>
                <Link
                  className="btn-cancel"
                  to={`?modal-type=data&modal-action=show-event&event-id=${eventId}`}
                >
                  Cancel
                </Link>
              </div>
            </>
          )}
        </Form>
      </div>
    </>
  );
};

export default ConfirmDeleteEvent;
