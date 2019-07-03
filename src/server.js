import express from 'express';
import _ from 'lodash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import validator from 'validator';
import { encrypt, getRandomKey } from './utils/encrypt';
import { sendEmail } from './utils/emailServer';
import config from '../config';
import * as adminUsers from './utils/adminUsers';

const app = express();

const sessionKeyName = 'telecomDemoSession';

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

app.use(cookieParser(config.cookieSecret));
app.use(session({
  resave: false,
  saveUninitialized: false,
}));

app.post('/auth', async (req, res) => {
  const { login, pass } = req.body;
  const passEncrypt = encrypt(pass);
  const user = {
    login, pass: passEncrypt
  };
  const currentUser = await adminUsers.getUser(user);
  if (currentUser) {
    res.send(JSON.stringify({
      status: 1,
      result: 'authorized'
    }));
    const sessionKey = getRandomKey();
    req.session[sessionKeyName] = sessionKey;

    // TODO: сделать сохранение разных сессий
    currentUser.sessions = [];
    // if (!currentUser.sessions) {
    //   currentUser.sessions = [];
    // }
    currentUser.sessions.push(sessionKey);
    adminUsers.updateUser(currentUser);
    return;
  }
  res.send(JSON.stringify({
    status: 1,
    result: 'unathorized'
  }));
});

// подтверждение регистрации по почте:
app.get('/registration', async (req, res) => {
  const { login, key } = req.query;
  if (!key) {
    res.send(JSON.stringify({
      result: 0, error: {
        text: 'Некорректный емейл',
      }
    }));
    return;
  }
  const currentUser = await adminUsers.getUser({ login, activationKey: key });
  if (currentUser) {
    currentUser.activated = true;
    const updateResult = await adminUsers.updateUser(currentUser);
    if (updateResult) {
      res.send(JSON.stringify({
        status: 1,
        result: 'Адрес успешно подтвержден',
      }));
      return;
    }
  }
  console.log('test!!!');
  console.log(currentUser);
  res.send(JSON.stringify({
    status: 0,
    result: 'что-то пошло не так',
  }));
  return;
});

// регистрация
app.post('/registration', async (req, res) => {
  const { name, lastName, email, pass } = req.body;
  if (!validator.isEmail(email)) {
    res.send(JSON.stringify({
      result: 0, error: {
        text: 'Некорректный емейл',
      }
    }));
    return;
  }

  const login = email;
  const hasAlreadyLogin = await adminUsers.hasAlreadyLogin(login);
  if (hasAlreadyLogin) {
    res.send(JSON.stringify({
      result: 0, error: {
        text: 'Пользователь с таким логином уже существует',
      }
    }));
    return;
  }

  const randomString = getRandomKey();

  const linkActivation = `http://${req.get('host')}/registration?login=${login}&key=${randomString}`;

  const mail = {
    from: 'test@example.com',
    subject: 'Подтверждение электронного адреса',
    text: `Для окончания регистрации на сайте Telecom Demo подтвердите регистрацию пройдя по ссылке: ${linkActivation}`,
    to: login,
  };

  sendEmail(mail);
  const passEncrypt = encrypt(pass);
  const user = {
    login, pass: encrypt,
    activated: false, linkActivation,
    sessions: [], name, lastName, email, activationKey: randomString };
  const result = await adminUsers.addUser(user);
});

app.get('/info', (req, res) => {
  const sessionKey = req.session[sessionKeyName];
  res.send('good bye');
});

app.listen(8000, () => {
  console.log('Server started');
});
