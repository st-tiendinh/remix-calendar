import { LoaderFunction, json } from '@remix-run/node';
import { MailService } from '@sendgrid/mail';

export const loader: LoaderFunction = async ({ request }) => {
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY is not set');
  }

  const mailService = new MailService();
  mailService.setApiKey(apiKey);

  const msg = {
    to: 'viet.nguyen@supremetech.vn', // Change to your recipient
    from: 'thai.le@classmethod.vn', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong><a href="http://localhost:3000/events/656d39c1a29cff9f40aeedf6">Your event</a></strong>',
  };

  mailService
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });

    console.log(mailService)
  return json({ status: 200 });
};
