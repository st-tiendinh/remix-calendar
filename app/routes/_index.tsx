import type { MetaFunction } from '@remix-run/node';
import { z } from 'zod';
import { Form } from '~/shared/components/form';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix Calendar App' },
    { name: 'description', content: 'Welcome to Remix Calendar App!' },
  ];
};

const schema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  date: z.date().refine((data) => data > new Date(), {
    message: 'Date must be in the future',
  }),
  timeStart: z.number().min(1).max(24),
  timeEnd: z.number().min(1).max(24),
  location: z.string().min(1, { message: 'Location is required' }),
  meetingLink: z.string().optional(),
});

export default function Index() {
  return (
    <div className="home">
      <div className="row">
        <div className="col col-3">
          <div className="sidebar">
            <h2 className="form-title">Create New Event</h2>
            <Form schema={schema}>
              {({ Field, Errors, Button }) => (
                <>
                  <Field name="title" className="form-input-group">
                    {({ Label, SmartInput, Errors }) => (
                      <>
                        <Label className="form-label">Title</Label>
                        <SmartInput className="form-input" />
                        <Errors className="form-error" />
                      </>
                    )}
                  </Field>
                  <Field name="description" className="form-input-group">
                    {({ Label, SmartInput, Errors }) => (
                      <>
                        <Label className="form-label">Description</Label>
                        <SmartInput className="form-input" />
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
                    <Field
                      name="timeStart"
                      className="form-input-group col col-6"
                    >
                      {({ Label, SmartInput, Errors }) => (
                        <>
                          <Label className="form-label">Time Start</Label>
                          <SmartInput className="form-input" />
                          <Errors className="form-error" />
                        </>
                      )}
                    </Field>
                    <Field
                      name="timeEnd"
                      className="form-input-group col col-6"
                    >
                      {({ Label, SmartInput, Errors }) => (
                        <>
                          <Label className="form-label">Time End</Label>
                          <SmartInput className="form-input" />
                          <Errors className="form-error" />
                        </>
                      )}
                    </Field>
                  </div>
                  <Field name="location" className="form-input-group">
                    {({ Label, SmartInput, Errors }) => (
                      <>
                        <Label className="form-label">Location</Label>
                        <SmartInput className="form-input" />
                        <Errors className="form-error" />
                      </>
                    )}
                  </Field>
                  <Field name="meetingLink" className="form-input-group">
                    {({ Label, SmartInput, Errors }) => (
                      <>
                        <Label className="form-label">Meeting Link</Label>
                        <SmartInput className="form-input" />
                        <Errors className="form-error" />
                      </>
                    )}
                  </Field>
                  <Errors className="form-error" />
                  <Button className="btn-add" />
                </>
              )}
            </Form>
          </div>
        </div>
        <div className="col col-9"></div>
      </div>
    </div>
  );
}
