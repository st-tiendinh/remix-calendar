import { z } from 'zod';
import { useFetcher } from '@remix-run/react';
import { useLocation, useNavigate } from '@remix-run/react';
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
    .array(z.object({ userId: z.string(), email: z.string() }))
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

interface Guest {
  userId: string;
  email: string;
  status?: string;
}

export default function FormEvent({ method, event, eventId }: FormEventProps) {
  let userFetcher = useFetcher<any>();
  let [query, setQuery] = useState('');
  const searchUserRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query) {
      userFetcher.submit(
        { search: query },
        {
          method: 'GET',
          action: '/user/search',
        }
      );
    }
  }, [query]);

  const minDate = () => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  };
  const navigate = useNavigate();
  const location = useLocation();

  const checkGuestExist = (userId: string, guests: Guest[]) => {
    const isExist = guests.some((guest) => guest.userId === userId);
    return isExist;
  };

  return (
    <div className="form-event">
      <div className="form-header">
        <h2 className="form-title">
          {method === FormEventMethod.CREATE
            ? 'Create New Event'
            : 'Update Event'}
        </h2>
        <button
          className="btn btn-modal-close"
          onClick={() =>
            location?.state?.query
              ? navigate(`/events${location.state.query}`)
              : navigate('/events')
          }
        >
          {' '}
          <SvgClose />
        </button>
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

              <Field name="guests">
                {() => (
                  <>
                    <userFetcher.Form>
                      <label htmlFor="userSearch" className="form-label">
                        Guests
                      </label>
                      <div className="input-icons">
                        <SvgUserGroup />
                        <input
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

                        {userFetcher.data !== undefined &&
                          query &&
                          (userFetcher.data.status === 200 ? (
                            <ul className="search-list">
                              {(userFetcher.data as any)?.users?.map(
                                (user: any) => {
                                  const isGuestExist = checkGuestExist(
                                    user.id,
                                    guests as any
                                  );
                                  return (
                                    <li
                                      className={`search-item ${
                                        isGuestExist ? 'disabled' : ''
                                      }`}
                                      key={user.id}
                                      onClick={() => {
                                        if (isGuestExist) {
                                          return;
                                        }
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
                                        (searchUserRef.current as any).value =
                                          '';
                                        setQuery('');
                                      }}
                                    >
                                      <span>{user.email}</span>
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          ) : (
                            <ul className="search-list">
                              {userFetcher.data?.error}
                            </ul>
                          ))}
                      </div>
                    </userFetcher.Form>
                  </>
                )}
              </Field>
              <ul className="guest-list">
                {guests &&
                  guests.map((guest, index) => {
                    return (
                      <>
                        <li key={guest.userId} className="guest-item">
                          <span>{guest.email}</span>
                          <SvgClose
                            className="icon-delete"
                            onClick={() => {
                              const filterUser = guests.filter(
                                (user) => user.userId !== guest.userId
                              );
                              setValue('guests', filterUser);
                              (searchUserRef.current as any).value = '';
                            }}
                          />
                        </li>
                        <input
                          type="hidden"
                          name={`guests[${index}][userId]`}
                          value={guest.userId}
                        />
                        <input
                          type="hidden"
                          name={`guests[${index}][email]`}
                          value={guest.email}
                        />
                      </>
                    );
                  })}
              </ul>
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
                <button
                  className="form-btn cancel"
                  onClick={() =>
                    navigate(
                      method === FormEventMethod.CREATE
                        ? `/events${location.state?.query}`
                        : `/events/${eventId}`,
                      {
                        state: {
                          query: location.state?.query,
                        },
                      }
                    )
                  }
                >
                  Cancel
                </button>
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
