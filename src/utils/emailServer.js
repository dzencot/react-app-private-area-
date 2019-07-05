import mailServer from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

mailServer.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (msg) => {
  mailServer.send(msg);
};

export { sendEmail };
