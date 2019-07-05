import _ from 'lodash';
import { promises as fs } from 'fs';
import path from 'path';
import uniqid from 'uniqid';

const dataPath = path.resolve('./src/data/', 'payments.json');

const getAllPayments = async () => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const dataPayments = await data ? data : '{}';
    const payments = JSON.parse(dataPayments);
    return payments;
  } catch (e) {
    throw e;
  }
  return [];
};

const addPayments = async (payments, idAccount) => {
  const allPayments = await getAllPayments();
  const paymentsWithKeys = payments.map(payment => ({ ...payment, id: uniqid() }));
  const newPayments = { ...allPayments, [idAccount]: paymentsWithKeys };
  try {
    const data = JSON.stringify(newPayments);
    const resultWrite = await fs.writeFile(dataPath, data);
    return true;
  } catch (e) {
    return false;
  }
};

const getPayments = async ({ idAccount, offset, count }) => {
  const paymentsData = await getAllPayments()
  if (!paymentsData[idAccount]) {
    return [];
  }
  const currentPayments = paymentsData[idAccount];
  const sortedPayments = currentPayments.sort((pay1, pay2) => {
    const date1 = new Date(pay1.date);
    const date2 = new Date(pay2.date);
    const time1 = date1.getTime();
    const time2 = date2.getTime();
    return time1 < time2 ? 1 : -1;
  });
  const payments = sortedPayments.slice(offset, offset + count);
  return {
    countItems: currentPayments.length,
    payments,
  };
};

export {
  getAllPayments,
  addPayments,
  getPayments,
};
