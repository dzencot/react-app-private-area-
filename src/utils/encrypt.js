import crypto from 'crypto';

const encrypt = (text) => {
  const hash = crypto.createHmac('sha512', 'salt');
  hash.update(text);
  return hash.digest('hex');
};

const getRandomKey = () => {
  const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return randomString;
};

export { encrypt, getRandomKey };
