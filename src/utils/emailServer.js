import mailServer from '@sendgrid/mail';

mailServer.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (msg) => {
  mailServer.send(msg);
};

export { sendEmail };
