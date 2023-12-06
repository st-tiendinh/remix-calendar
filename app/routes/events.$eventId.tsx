import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { Link } from 'react-router-dom';
import { prisma } from '~/server/prisma.server';
import { z } from 'zod';

import SvgPenSolid from '~/shared/components/icons/IcPenSolid';
import SvgCommentSolid from '~/shared/components/icons/CommentSolid';
import SvgCalendarDaySolid from '~/shared/components/icons/CalendarDaySolid';
import SvgClockSolid from '~/shared/components/icons/ClockSolid';
import SvgExternalLinkAltSolid from '~/shared/components/icons/ExternalLinkAltSolid';
import SvgTrashSolid from '~/shared/components/icons/TrashAltSolid';
import SvgClose from '~/shared/components/icons/CloseSolid';
import SvgBuilding from '~/shared/components/icons/Building';
import SvgEdit from '~/shared/components/icons/Edit';
import { Form } from '~/shared/components/RemixForm';
import { getSearchParams } from '~/shared/utils/getSearchParams.server';
import { getUserId } from '~/server/auth.server';

export let loader: LoaderFunction = async ({ params, request }) => {
  const event = await prisma.event.findUnique({
    where: { id: params.eventId },
  });

  if (!event) {
    return json({ error: 'Event Not Found', status: 404 });
  }

  const author = await prisma.user.findUnique({
    where: { id: event.authorId },
  });

  const modalType = getSearchParams({ url: request.url }).modalType;

  const authorName = author?.profile;
  const userId = await getUserId(request);

  return json({ event, authorName, modalType, userId });
};

const Event = () => {
  const { event, modalType, userId } = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.state);
  const deleteEventSchema = z.object({});

  const ModalDelete = () => {
    return (
      <div className="modal-confirm-wrapper">
        <div className="modal-confirm">
          <p className="modal-confirm-title">Are you sure?</p>
          <Form
            schema={deleteEventSchema}
            method="post"
            action={`/events/${event.id}/delete`}
          >
            {({ Button }) => (
              <>
                <div className="modal-confirm-footer">
                  <Button className="btn-confirm">Delete</Button>
                  <Link to={`/events/${event.id}`} className="btn-cancel">
                    Cancel
                  </Link>
                </div>
              </>
            )}
          </Form>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="modal-wrapper">
        {modalType === 'delete' && <ModalDelete />}
        <div className="modal">
          <div className="modal-event-wrapper">
            <div className="modal-event-header">

              <button
                className="btn-modal-link"
                onClick={() =>
                  navigate(
                    userId
                      ? `/events/${event.id}/edit`
                      : `/login?redirectUrl=${encodeURIComponent(
                          `/events/${event.id}/edit`
                        )}`,
                    {
                      state: {
                        query: location.state?.query,
                      },
                    }
                  )
                }
              >
                <SvgEdit />
              </button>
              <Link
                to={
                  userId
                    ? '?modal-type=delete'
                    : `/login?redirectUrl=/events/${event.id}?modal-type=delete`
                }
                className="btn-modal-link"
              >
                <SvgTrashSolid />
              </Link>
              <Link to={`/events`} className="btn-modal-link">
                <SvgClose />
              </Link>
            </div>
            <div className="event-detail-wrapper">
              <ul className="event-info-list">
                <li className="event-info-item">
                  <div className="event-detail">
                    <SvgPenSolid />
                    <p className="event-detail-info">{event.title}</p>
                  </div>
                </li>

                <li className="event-info-item">
                  <div className="event-detail">
                    <SvgCommentSolid />

                    <p className="event-detail-info">{event.description}</p>
                  </div>
                </li>

                <li className="event-info-item">
                  <div className="event-detail">
                    <SvgCalendarDaySolid />
                    <p className="event-detail-info">
                      {new Date(event.date).getDate() +
                        '/' +
                        (new Date(event.date).getMonth() + 1) +
                        '/' +
                        new Date(event.date).getFullYear()}
                    </p>
                  </div>
                </li>

                <div className="event-info-row">
                  <li className="event-info-col ">
                    <SvgClockSolid />
                    <p className="event-detail-info">{event.timeStart}</p>
                  </li>
                  <li className="event-info-col">
                    <SvgClockSolid />
                    <p className="event-detail-info">{event.timeEnd}</p>
                  </li>
                </div>

                <li className="event-info-item">
                  <div className="event-detail">
                    <SvgBuilding />
                    <p className="event-detail-info">{event.location}</p>
                  </div>
                </li>

                <li className="event-info-item">
                  <div className="event-detail">
                    <SvgExternalLinkAltSolid />
                    <p className="event-detail-info">{event.meetingLink}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Event;
