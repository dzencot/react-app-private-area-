import express from 'express';
import _ from 'lodash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import validator from 'validator';
import { encrypt, getRandomKey } from './utils/encrypt';
import { sendEmail } from './utils/emailServer';
import config from '../config';
import cors from 'cors';
import * as adminUsers from './utils/adminUsers';
import * as generator from './utils/generatorFakeData';
import * as servicesLib from './utils/servicesLib';
import * as paymentsLib from './utils/paymentsLib';

const app = express();

const sessionKeyName = 'telecomDemoSession';

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

app.use(cors({ credentials: true, }));

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
    const sessionKey = getRandomKey();
    // TODO: настроить сессионные куки
    req.cookies[sessionKeyName] = sessionKey;
    // TODO: сделать сохранение разных сессий
    // if (!currentUser.sessions) {
    //   currentUser.sessions = [];
    // }
    currentUser.sessions = [];
    currentUser.sessions.push(sessionKey);
    adminUsers.updateUser(currentUser);
    res.send(JSON.stringify({
      status: 1,
      result: 'authorized',
      key: sessionKey,
    }));

    return;
  }
  res.send(JSON.stringify({
    status: 1,
    result: 'unathorized',
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

  // sendEmail(mail);
  const passEncrypt = encrypt(pass);
  const user = {
    login,
    pass: passEncrypt,
    activated: false,
    sessions: [],
    name,
    lastName,
    email,
    activationKey: randomString,
  };
  const result = await adminUsers.addUser(user);
  if (result) {
    res.send(JSON.stringify({
      result: 1, status: 1, text: 'success' }));

    // создаем фейковые данные для демо
    const services = [];
    for (let i = 0; i < 50; i += 1) {
      const service = generator.generateService();
      service.idAccount = result.id;
      services.push(service);
    }
    servicesLib.addServices(services, result.id);

    const payments = [];
    for (let i = 0; i < 100; i += 1) {
      const payment = generator.generatePayment();
      payment.idAccount = result.id;
      payments.push(payment);
    }
    paymentsLib.addPayments(payments, result.id);
  }
  res.send(JSON.stringify({
    result: 0, status: 0, text: 'error' }));
});

app.get('/info', (req, res) => {
  const sessionKey = req.cookies[sessionKeyName];
  const { key } = req.query;
  res.send('good bye');
});

app.get('/payments', async (req, res) => {
  const sessionKey = req.cookies[sessionKeyName];
  const { key, page } = req.query;
  const user = await adminUsers.getUserBySession(key);
  if (user.length === 0) {
    res.send(JSON.stringify({
      result: 0, status: 'unathorized', text: 'unathorized',
    }));
    return;
  }

  const currentAccount = user[0];
  const count = 10;
  const offset = count * page;
  const { payments, countItems } = await paymentsLib.getPayments({ idAccount: currentAccount.id, offset, count });
  const pages = parseInt(countItems / count);
  res.send(JSON.stringify({
    result: 1, status: 1,
    currentPage: page,
    pages, payments,
    offset,
  }));
});

app.get('/services', async (req, res) => {
  const sessionKey = req.cookies[sessionKeyName];
  const { key, page } = req.query;
  const user = await adminUsers.getUserBySession(key);
  if (user.length === 0) {
    res.send(JSON.stringify({
      result: 0, status: 'unathorized', text: 'unathorized',
    }));
    return;
  }

  const currentAccount = user[0];
  const count = 10;
  const offset = count * page;
  const { services, countItems } = await servicesLib.getServices({ idAccount: currentAccount.id, offset, count });
  const pages = parseInt(countItems / count);
  res.send(JSON.stringify({
    result: 1, status: 1,
    currentPage: page,
    pages, services,
    offset,
  }));
});

app.listen(8000, () => {
  console.log('Server started');
});
