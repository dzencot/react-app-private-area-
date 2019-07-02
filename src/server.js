import express from 'express';
import _ from 'lodash';
import session from 'express-session';
import encrypt from './utils/encrypt';
import { sendEmail } from './utils/emailServer';
import {
  getUsers,
  checkUser,
  checkLogin,
  addUser,
} from './utils/adminUsers';

const app = express();


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

app.post('/auth', async (req, res) => {
  const { login, pass } = req.body;
  const passEncrypt = encrypt(pass);
  const user = {
    login, pass
  };
  const isCorrectUser = await checkUser(user);
  console.log('is correct:');
  console.log(isCorrectUser);
  console.log(req.get('host'));
});

app.get('/registration', async (req, res) => {
  const { login, key } = req.query;
  console.log(login);
  console.log(key);
  res.send('hi');
});

app.post('/registration', async (req, res) => {
  const { login, pass } = req.body;
  const hasAlreadyLogin = await checkLogin(login);
  if (hasAlreadyLogin) {
    res.send(JSON.encode({
      result: 0, error: {
        text: 'Пользователь с таким логином уже существует',
      }
    }));
    return;
  }

  const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const linkActivation = `http://${req.get('host')}/registration?login=${login}&key=${randomString}`;

  const email = {
    from: 'test@example.com',
    subject: 'Подтверждение электронного адреса',
    text: `Для окончания регистрации на сайте Telecom Demo подтвердите регистрацию пройдя по ссылке: ${linkActivation}`,
    to: login,
  };

  sendEmail(email);
  const passEncrypt = encrypt(pass);
  const user = {
    login, pass: encrypt, activated: false, linkActivation };
  const result = await addUser(user);
  console.log('result add user:');
  console.log(result);
});

app.get('/', (req, res) => {
  console.log('test!');
  res.send('good bye');
});

app.listen(8000, () => {
  console.log('Server started');
});
