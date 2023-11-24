import { z } from 'zod';
import { Link, useLocation } from '@remix-run/react';

import { Form } from '~/shared/components/RemixForm';
import { type EventData } from '../utils/types.server';
import { ModalAction, ModalType } from './Modal';

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, { message: '*Title is required' })
    .max(40, { message: '*Must be 40 or fewer characters long' }),
  description: z
    .string()
    .min(1, { message: '*Description is required' })
    .max(160, { message: '*Must be 160 or fewer characters long' }),
  date: z.coerce.date().refine(
    (data: Date) => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // set the time to the start of the day
      return data >= currentDate;
    },
    {
      message: '*Date must be in the future',
    }
  ),
  timeStart: z.coerce
    .string()
    .min(1, { message: '*Time start is required' })
    .max(24),
  timeEnd: z.coerce
    .string()
    .min(1, { message: '*Time End is required' })
    .max(24),
  location: z.string().min(1, { message: '*Location is required' }),
  meetingLink: z.string().optional(),
});

export const deleteEventSchema = z.object({});
export enum FormEventMethod {
  CREATE = 'create',
  UPDATE = 'update',
}
interface FormEventProps {
  method: FormEventMethod;
  event?: EventData;
  eventId?: string;
}

export default function FormEvent({ method, event, eventId }: FormEventProps) {
  const minDate = () => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  };
  const location = useLocation();
  return (
    <div className="form-event">
      <div className="form-header">
        <h2 className="form-title">
          {method === FormEventMethod.CREATE
            ? 'Create New Event'
            : 'Update Event'}
        </h2>
        {location.pathname.startsWith('/events') &&
          location.pathname.endsWith('/edit') && (
            <Link
              to={`?modal-type=${ModalType.CONFIRM}&modal-action=${ModalAction.DELETE_EVENT}`}
            >
              <button className="btn">
                <i className="icon icon-trash"></i>
              </button>
            </Link>
          )}
      </div>
      <Form
        schema={eventSchema}
        method="post"
        action={
          method === FormEventMethod.CREATE
            ? '/events/create'
            : `/events/${eventId}/edit`
        }
        values={event}
      >
        {({ Field, Errors, Button, register }) => (
          <>
            <Field name="title" className="form-input-group">
              {({ Label, Errors }) => (
                <>
                  <Label className="form-label">Title</Label>
                  <input
                    type="text"
                    {...register('title')}
                    className="form-input"
                    placeholder="Add Title"
                    onBlur={(e) => {
                      e.target.value = e.target.value.trim();
                    }}
                  />
                  <div className="error-text">
                    <Errors />
                  </div>
                </>
              )}
            </Field>
            <Field name="description" className="form-input-group">
              {({ Label, Errors }) => (
                <>
                  <Label className="form-label">Description</Label>
                  <input
                    type="text"
                    {...register('description')}
                    className="form-input"
                    placeholder="Add Description"
                    onBlur={(e) => {
                      e.target.value = e.target.value.trim();
                    }}
                  />
                  <div className="error-text">
                    <Errors />
                  </div>
                </>
              )}
            </Field>
            <Field name="date" className="form-input-group">
              {({ Label, SmartInput, Errors }) => (
                <>
                  <Label className="form-label">Date</Label>
                  <input className="form-input" min={minDate()} />
                  <Errors className="form-error" />
                </>
              )}
            </Field>
            <div className="row">
              <Field name="timeStart" className="form-input-group col col-6">
                {({ Label, SmartInput, Errors }) => (
                  <>
                    <Label className="form-label">Time Start</Label>
                    <SmartInput
                      type="time"
                      className="form-input"
                      placeholder="From..."
                    />
                    <Errors className="form-error" />
                  </>
                )}
              </Field>
              <Field name="timeEnd" className="form-input-group col col-6">
                {({ Label, SmartInput, Errors }) => (
                  <>
                    <Label className="form-label">Time End</Label>
                    <SmartInput
                      type="time"
                      className="form-input"
                      placeholder="To..."
                    />
                    <Errors className="form-error" />
                  </>
                )}
              </Field>
            </div>
            <Field name="location" className="form-input-group">
              {({ Label, Errors }) => (
                <>
                  <Label className="form-label">Location</Label>
                  <input
                    type="text"
                    {...register('location')}
                    className="form-input"
                    placeholder="Location"
                    onBlur={(e) => {
                      e.target.value = e.target.value.trim();
                    }}
                  />
                  <div className="error-text">
                    <Errors />
                  </div>
                </>
              )}
            </Field>
            <Field name="meetingLink" className="form-input-group">
              {({ Label, Errors }) => (
                <>
                  <Label className="form-label">Meeting Link</Label>
                  <input
                    type="text"
                    {...register('meetingLink')}
                    className="form-input"
                    placeholder="Meeting Link"
                    onBlur={(e) => {
                      e.target.value = e.target.value.trim();
                    }}
                  />
                  <div className="error-text">
                    <Errors />
                  </div>
                </>
              )}
            </Field>
            <Errors className="form-error" />
            <Button className="btn-add">
              {method === FormEventMethod.CREATE ? 'Create' : 'Update'}
            </Button>
          </>
        )}
      </Form>
    </div>
  );
}
