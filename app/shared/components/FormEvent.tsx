import { z } from 'zod';
import { Link, useFetcher } from '@remix-run/react';
import { Form } from '~/shared/components/RemixForm';
import { type EventData } from '../utils/types.server';

import SvgPenSolid from '~/shared/components/icons/IcPenSolid';
import SvgCommentSolid from '~/shared/components/icons/CommentSolid';
import SvgCalendarDaySolid from '~/shared/components/icons/CalendarDaySolid';
import SvgClockSolid from '~/shared/components/icons/ClockSolid';
import SvgExternalLinkAltSolid from '~/shared/components/icons/ExternalLinkAltSolid';

import SvgClose from '~/shared/components/icons/CloseSolid';
import SvgBuilding from '~/shared/components/icons/Building';
import SvgUserGroup from '~/shared/components/icons/IcUserGroup';
import { useEffect, useState } from 'react';

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
  guests: z
    .array(z.object({ userId: z.string(), email: z.string().email() }))
    .optional(),
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
  let userFetcher = useFetcher();
  let [query, setQuery] = useState('');

  useEffect(() => {
    console.log('USER FETCH', userFetcher);
    userFetcher.submit(
      { search: query },
      {
        method: 'GET',
        action: '/user/search',
      }
    );
  }, [query]);

  const minDate = () => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  };

  return (
    <div className="form-event">
      <div className="form-header">
        <h2 className="form-title">
          {method === FormEventMethod.CREATE
            ? 'Create New Event'
            : 'Update Event'}
        </h2>

        <Link className="btn btn-modal-close" to={'/events'}>
          <SvgClose />
        </Link>
      </div>
      <Form
        schema={eventSchema}
        method="post"
        action={
          method === FormEventMethod.CREATE
            ? '/events/create'
            : `/events/${eventId}/edit`
        }
        values={{ ...event, guests: [] }}
      >
        {({ Field, Errors, Button, register, watch, setValue }) => {
          const guests = watch('guests');

          return (
            <>
              <Field name="title" className="form-input-group">
                {({ Label, Errors }) => (
                  <>
                    <label className="form-label">Event Title</label>
                    <div className="input-icons">
                      <SvgPenSolid />
                      <input
                        type="text"
                        {...register('title')}
                        className="form-input"
                        placeholder="Enter event title"
                        onBlur={(e) => {
                          e.target.value = e.target.value.trim();
                        }}
                      />
                    </div>

                    <div className="form-error">
                      <Errors />
                    </div>
                  </>
                )}
              </Field>
              <Field name="description" className="form-input-group">
                {({ Label, Errors }) => (
                  <>
                    <label className="form-label">Description</label>
                    <div className="input-icons">
                      <SvgCommentSolid />
                      <input
                        type="text"
                        {...register('description')}
                        className="form-input"
                        placeholder="Enter description"
                        onBlur={(e) => {
                          e.target.value = e.target.value.trim();
                        }}
                      />
                    </div>
                    <div className="form-error">
                      <Errors />
                    </div>
                  </>
                )}
              </Field>
              <Field name="date" className="form-input-group">
                {({ Label, SmartInput, Errors }) => (
                  <>
                    <label className="form-label">Date</label>
                    <div className="input-icons">
                      <SvgCalendarDaySolid />

                      <input
                        className="form-input"
                        min={minDate()}
                        type="text"
                        placeholder="Date of event"
                        onFocus={(event) => {
                          event.currentTarget.type = 'date';
                        }}
                        onBlur={(event) => {
                          event.currentTarget.type = 'text';
                        }}
                      />
                    </div>
                    <Errors className="form-error" />
                  </>
                )}
              </Field>
              <div className="row">
                <Field name="timeStart" className="form-input-group col col-6">
                  {({ Errors }) => (
                    <>
                      <label className="form-label">Time start</label>
                      <div className="input-icons">
                        <SvgClockSolid />
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Time start"
                          onFocus={(event) => {
                            event.currentTarget.type = 'time';
                          }}
                          onBlur={(event) => {
                            event.currentTarget.type = 'text';
                          }}
                        />
                      </div>
                      <Errors className="form-error" />
                    </>
                  )}
                </Field>
                <Field name="timeEnd" className="form-input-group col col-6">
                  {({ Label, SmartInput, Errors }) => (
                    <>
                      <label className="form-label">Time end</label>
                      <div className="input-icons">
                        <SvgClockSolid />
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Time end"
                          onFocus={(event) => {
                            event.currentTarget.type = 'time';
                          }}
                          onBlur={(event) => {
                            event.currentTarget.type = 'text';
                          }}
                        />
                      </div>
                      <Errors className="form-error" />
                    </>
                  )}
                </Field>
              </div>
              <Field name="location" className="form-input-group">
                {({ Label, Errors }) => (
                  <>
                    <label className="form-label">Location</label>
                    <div className="input-icons">
                      <SvgBuilding />
                      <input
                        type="text"
                        {...register('location')}
                        className="form-input"
                        placeholder="Choose a location"
                        onBlur={(e) => {
                          e.target.value = e.target.value.trim();
                        }}
                      />
                    </div>
                    <div className="form-error">
                      <Errors />
                    </div>
                  </>
                )}
              </Field>
              {/* <Field name="guests" className="form-input-group">
                {({ Errors }) => (
                  <>
                    <label className="form-label">Guests</label>
                    <div className="input-icons">
                      <SvgUserGroup />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Add guests"
                        onBlur={(e) => {
                          e.target.value = e.target.value.trim();
                        }}
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setValue('guests', [
                          ...(guests as []),
                          { userId: '123', email: 'viet@gmail.com' },
                        ]);
                      }}
                    >
                      CLick
                    </button>
                    <fieldset>
                      {guests &&
                        guests.length >= 1 &&
                        Object.values(guests).map((guest) => {
                          return <span>{guest.email}</span>;
                        })}
                    </fieldset>
                    <div className="form-error">
                      <Errors />
                    </div>
                  </>
                )}
              </Field> */}
              <userFetcher.Form method="GET" action="/user/search">
                <div className="form-input-group">
                  <label htmlFor="userSearch" className="form-label">
                    Guests
                  </label>
                  <div className="input-icons">
                    <SvgUserGroup />
                    <input
                      id="userSearch"
                      type="text"
                      className="form-input"
                      placeholder="Add guests"
                      onBlur={(e) => {
                        e.target.value = e.target.value.trim();
                      }}
                      onChange={(event) => setQuery(event.currentTarget.value)}
                    />
                  </div>

                  {guests &&
                    guests.length >= 1 &&
                    guests.map((guest) => {
                      return <span>{guest.email}</span>;
                    })}
                </div>
              </userFetcher.Form>
              <Field name="meetingLink" className="form-input-group">
                {({ Errors }) => (
                  <>
                    <label className="form-label">Meeting Link</label>
                    <div className="input-icons">
                      <SvgExternalLinkAltSolid />
                      <input
                        type="text"
                        {...register('meetingLink')}
                        className="form-input"
                        placeholder="Enter meeting link"
                        onBlur={(e) => {
                          e.target.value = e.target.value.trim();
                        }}
                      />
                    </div>
                    <div className="form-error">
                      <Errors />
                    </div>
                  </>
                )}
              </Field>
              <Errors className="form-error" />
              <div className="form-btn-group">
                <Link
                  to={
                    method === FormEventMethod.CREATE
                      ? '/events'
                      : `/events/${eventId}`
                  }
                  className="form-btn cancel"
                >
                  Cancel
                </Link>
                <Button className="form-btn save">
                  {method === FormEventMethod.CREATE ? 'Create' : 'Save'}
                </Button>
              </div>
            </>
          );
        }}
      </Form>
    </div>
  );
}
