import _ from 'lodash';
import { promises as fs } from 'fs';
import path from 'path';
import uniqid from 'uniqid';

const dataPath = path.resolve('./src/data/', 'services.json');

const getAllServices = async () => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const dataServices = await data ? data : '{}';
    const services = JSON.parse(dataServices);
    return services;
  } catch (e) {
    console.log(e);
  }
  return [];
};

const addServices = async (services, idAccount) => {
  const allServices = getAllServices();
  const servicesWithKeys = services.map(service => ({ ...service, id: uniqid() }));
  const newServices = { ...allServices, [idAccount]: servicesWithKeys };
  try {
    const data = JSON.stringify(newServices);
    const resultWrite = await fs.writeFile(dataPath, data);
    return true;
  } catch (e) {
    return false;
  }
};

const getServices = async ({ idAccount, offset, count }) => {
  const servicesData = await getAllServices()
  if (!servicesData[idAccount]) {
    return [];
  }
  const currentServices = servicesData[idAccount];
  const services = currentServices.slice(offset, offset + count);
  return {
    countItems: currentServices.length,
    services,
  };
};

export {
  getAllServices,
  addServices,
  getServices,
};
