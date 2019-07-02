import _ from 'lodash';
import { promises as fs } from 'fs';
import path from 'path';
import uniqid from 'uniqid';

const dataPath = path.resolve('./src/data/', 'users.json');

const getUsers = async () => {
  try {
    const dataUsers = await fs.readFile(dataPath);
    const users = JSON.parse(dataUsers);
    return users;
  } catch (e) {
    console.log(e);
  }
  return [];
};

const checkUser = async (user) => {
  console.log('check user');
  console.log(user);
  const users = await getUsers();
  console.log(users);
  const foundUser = _.find(users, user);
  console.log(foundUser);
  if (foundUser) {
    return true;
  }
  return false;
};

const checkLogin = async (login) => {
  const users = await getUsers();
  const hasAlreadyUser = _.find(users, { login });
  if (hasAlreadyUser) {
    return false;
  }
  return true;
};


const addUser = async (user) => {
  const users = await getUsers();
  const { login } = user;
  const hasAlreadyUser = checkLogin(login);
  if (hasAlreadyUser) {
    return false;
  }
  user.id = uniqid()
  users.push(user);
  try {
    const data = JSON.stringify(users);
    const resultWrite = await fs.write(dataPath, data);
    console.log('result write:');
    console.log(resultWrite);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const updateUser = async (user) => {
  const users = getUsers();
  const index = _.findIndex(arr, {id: 1});
  arr.splice(index, 1, user);

  try {
    const data = JSON.stringify(users);
    const resultWrite = await fs.write(dataPath, data);
    console.log('result write:');
    console.log(resultWrite);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};



export {
  getUsers, checkUser, addUser,
  checkLogin, updateUser };
