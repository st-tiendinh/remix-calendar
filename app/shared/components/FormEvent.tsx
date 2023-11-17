import { z } from 'zod';
import { Form } from '~/shared/components/form';

const eventSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(40, { message: 'Must be 40 or fewer characters long' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(160, { message: 'Must be 160 or fewer characters long' }),
  date: z.coerce
    .date()
    // .min(new Date(), { message: 'Please select a date and time' })
    .refine((data) => data > new Date(), {
      message: 'Date must be in the future',
    }),
  timeStart: z.coerce
    .number()
    .min(1, { message: 'Time start is required' })
    .max(24),
  timeEnd: z.coerce
    .number()
    .min(1, { message: 'Time End is required' })
    .max(24),
  location: z.string().min(1, { message: 'Location is required' }),
  meetingLink: z.string().optional(),
});

export default function FormEvent() {
  const handleDeleteEvent = () => {
    if (window.confirm('Are you want to delete event?')) {
      // handle API delete event
    }
  };
  return (
    <div className="form-event">
      <div className="form-header">
        <h2 className="form-title">Create New Event</h2>
        <i className="icon icon-trash" onClick={handleDeleteEvent}></i>
      </div>
      <Form schema={eventSchema} method="post">
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
                  <SmartInput className="form-input" />
                  <Errors className="form-error" />
                </>
              )}
            </Field>
            <div className="row">
              <Field name="timeStart" className="form-input-group col col-6">
                {({ Label, SmartInput, Errors }) => (
                  <>
                    <Label className="form-label">Time Start</Label>
                    <SmartInput className="form-input" placeholder="From..." />
                    <Errors className="form-error" />
                  </>
                )}
              </Field>
              <Field name="timeEnd" className="form-input-group col col-6">
                {({ Label, SmartInput, Errors }) => (
                  <>
                    <Label className="form-label">Time End</Label>
                    <SmartInput className="form-input" placeholder="To..." />
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
            <Button className="btn-add">Create</Button>
          </>
        )}
      </Form>
    </div>
  );
}
