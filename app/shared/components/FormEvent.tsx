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
import { useEffect, useRef, useState } from 'react';
import SvgIcPlusCircle from './icons/IcPlusCircle';
import SvgCloseSolid from '~/shared/components/icons/CloseSolid';

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
    .object({ userId: z.string(), email: z.string() })
    .array()
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
  let userFetcher = useFetcher<any>();
  let [query, setQuery] = useState('');
  const searchUserRef = useRef<HTMLInputElement>(null);
  const userIdRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
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

          useEffect(() => {
            console.log('GUESS', guests);
          }, [guests]);
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
              <Field name="guests">
                {() => (
                  <>
                    {/* <userFetcher.Form> */}
                    <label htmlFor="userSearch" className="form-label">
                      Guests
                    </label>
                    <div className="input-icons">
                      <SvgUserGroup />
                      <input
                        {...register('guests')}
                        id="userSearch"
                        type="text"
                        ref={searchUserRef}
                        className="form-input"
                        placeholder="Add guests"
                        onBlur={(e) => {
                          e.target.value = e.target.value.trim();
                        }}
                        onChange={(event) =>
                          setQuery(event.currentTarget.value)
                        }
                      />
                      <button className="btn btn-primary">
                        <SvgIcPlusCircle />
                      </button>
                      {userFetcher.data !== undefined &&
                        (searchUserRef.current as any).value &&
                        userFetcher.data.status === 200 && (
                          <ul className="search-list">
                            {(userFetcher.data as any)?.users?.map(
                              (user: any) => {
                                return (
                                  <li
                                    className="search-item"
                                    key={user.id}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setValue(
                                        'guests',
                                        [
                                          ...(guests as any),
                                          {
                                            userId: user.id,
                                            email: user.email,
                                          },
                                        ],
                                        { shouldValidate: true }
                                      );
                                      (searchUserRef.current as any).value = '';
                                    }}
                                  >
                                    <span>{user.email}</span>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        )}
                    </div>
                    {/* </userFetcher.Form> */}

                    <ul className="guest-list">
                      {guests &&
                        guests.map((guest) => {
                          return (
                            <li className="guest-item">
                              <span>{guest.email}</span>
                              <SvgCloseSolid
                                onClick={() => {
                                  const filterUser = guests.filter(
                                    (user) => user.userId !== guest.userId
                                  );
                                  setValue('guests', filterUser);
                                  (searchUserRef.current as any).value = '';
                                }}
                              />
                            </li>
                          );
                        })}
                    </ul>
                  </>
                )}
              </Field>

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
