import config from '../../config';
import mailServer from '@sendgrid/mail';

mailServer.setApiKey(config.mailServer.apiKey);

const sendEmail = (msg) => {
  mailServer.send(msg);
};

export { sendEmail };
