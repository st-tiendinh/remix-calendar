import { z } from 'zod';

import { Form } from '~/shared/components/form';
import { EventData } from '../utils/types.server';
import { useLocation } from '@remix-run/react';

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

export enum FormEventMethod {
  CREATE = 'create',
  UPDATE = 'update',
}
interface FormEventProps {
  method: FormEventMethod;
  event?: EventData;
}

export default function FormEvent({ method, event }: FormEventProps) {
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
            <form method="post">
              <button
                className="btn-delete"
                type="submit"
                name="_action"
                value="delete"
              >
                <i className="icon icon-trash"></i>
              </button>
            </form>
          )}
      </div>
      <Form schema={eventSchema} method="post" values={event}>
        {({ Field, Errors, Button }) => (
          <>
            <Field name="title" className="form-input-group">
              {({ Label, SmartInput, Errors }) => (
                <>
                  <Label className="form-label">Title</Label>
                  <SmartInput className="form-input" placeholder="Add title" />
                  <Errors className="form-error" />
                </>
              )}
            </Field>
            <Field name="description" className="form-input-group">
              {({ Label, SmartInput, Errors }) => (
                <>
                  <Label className="form-label">Description</Label>
                  <SmartInput
                    className="form-input"
                    placeholder="Add descriptopn"
                  />
                  <Errors className="form-error" />
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
                    <SmartInput type='time' className="form-input" placeholder="From..." />
                    <Errors className="form-error" />
                  </>
                )}
              </Field>
              <Field name="timeEnd" className="form-input-group col col-6">
                {({ Label, SmartInput, Errors }) => (
                  <>
                    <Label className="form-label">Time End</Label>
                    <SmartInput type='time' className="form-input" placeholder="To..." />
                    <Errors className="form-error" />
                  </>
                )}
              </Field>
            </div>
            <Field name="location" className="form-input-group">
              {({ Label, SmartInput, Errors }) => (
                <>
                  <Label className="form-label">Location</Label>
                  <SmartInput
                    className="form-input"
                    placeholder="Add location"
                  />
                  <Errors className="form-error" />
                </>
              )}
            </Field>
            <Field name="meetingLink" className="form-input-group">
              {({ Label, SmartInput, Errors }) => (
                <>
                  <Label className="form-label">Meeting Link</Label>
                  <SmartInput
                    className="form-input"
                    placeholder="Add meeting link"
                  />
                  <Errors className="form-error" />
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
