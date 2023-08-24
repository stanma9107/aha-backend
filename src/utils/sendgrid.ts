import sendGrid from '@sendgrid/mail';

sendGrid.setApiKey(process.env.SENDGRID_API_KEY ?? '');

const sendEmail = async (to: string, subject: string, text: string) => {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL ?? '',
    subject,
    text,
  };
  try {
    await sendGrid.send(msg);
    return {
      sent: true,
    };
  } catch (err) {
    return {
      sent: false,
      err,
    };
  }
};

export default {
  sendEmail,
};
