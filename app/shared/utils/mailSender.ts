import { MailService } from '@sendgrid/mail';

interface MailSender {
  usersEmail: string[];
  eventLink: string;
}

export const mailSender = async ({ usersEmail, eventLink }: MailSender) => {
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY is not set');
  }

  const mailService = new MailService();
  mailService.setApiKey(apiKey);

  const sendEmails = async () => {
    await Promise.all(
      usersEmail.map(async (email) => {
        const msg = {
          to: email,
          from: 'thai.le@classmethod.vn',
          subject: 'Sending with SendGrid is Fun',
          text: 'and easy to do anywhere, even with Node.js',
          html: `<strong><a href="${eventLink}">Your event</a></strong>`,
        };

        await mailService.send(msg);
      })
    );

    console.log('Emails sent');
  };

  sendEmails().catch(console.error);
};
