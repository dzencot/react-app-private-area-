import _ from 'lodash';
import { promises as fs } from 'fs';
import path from 'path';
import uniqid from 'uniqid';

const dataPath = path.resolve('./src/data/', 'users.json');

const getUsers = async () => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const dataUsers = await data ? data : '[]';
    const users = JSON.parse(dataUsers);
    return users;
  } catch (e) {
    console.log(e);
  }
  return [];
};

const checkUser = async (user) => {
  const foundUser = await getUser(user);
  if (foundUser) {
    return true;
  }
  return false;
};

const hasAlreadyLogin = async (login) => {
  const users = await getUsers();
  const hasAlreadyUser = _.find(users, { login });
  if (hasAlreadyUser) {
    return true;
  }
  return false;
};


const addUser = async (user) => {
  const users = await getUsers();
  const { login } = user;

  const checkLogin = hasAlreadyLogin(login);
  if (!checkLogin) {
    return false;
  }
  user.id = uniqid()
  users.push(user);
  try {
    const data = JSON.stringify(users);
    const resultWrite = await fs.writeFile(dataPath, data);
    return true;
  } catch (e) {
    return false;
  }
};

const updateUser = async (user) => {
  console.log('update useR!!!!');
  const users = await getUsers();
  const index = _.findIndex(users, {id: 1});
  users.splice(index, 1, user);

  console.log('users:');
  console.log(users);
  try {
    const data = JSON.stringify(users);
    const resultWrite = await fs.writeFile(dataPath, data);
    return true;
  } catch (e) {
    return false;
  }
};

const getUser = async (user) => {
  if (!user.pass && !user.activationKey) {
    return null;
  }
  const users = await getUsers();
  const foundUser = _.find(users, user);
  return foundUser;
};

const getUserBySession = async (sessionKey) => {
  const users = await getUsers();
  const foundUser = users.filter((user) => {
    return _.indexOf(user.sessions, sessionKey) !== -1;
  });
  return foundUser;
};


export {
  getUsers, checkUser, addUser,
  getUserBySession,
  hasAlreadyLogin, updateUser, getUser };
