import faker from 'faker';

faker.locale = 'ru';

const statuses = [
  'ordered',
  'paid',
];

const services = [
  'phone',
  'internet',
];

const getFormatedDate = (today) => {
  const dd = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
  const mm =
  today.getMonth() < 9
    ? '0' + (today.getMonth() + 1)
    : today.getMonth() + 1;
  const yyyy = today
    .getFullYear()
    .toString()
    .slice(-2);
  const todayDate = `${dd}/${mm}/${yyyy}`;
  return todayDate;
};

const generateService = () => {
  const status = statuses[faker.random.number({ min: 0, max: statuses.length - 1 })];
  const type = services[faker.random.number({ min: 0, max: services.length - 1 })];
  const price = faker.random.number();

  return { type, status, price };
};

const generatePayment = () => {
  const type = services[faker.random.number({ min: 0, max: services.length - 1 })];
  const price = faker.random.number();
  const data = new Date(Date.parse(faker.date.past()));
  const formatedDate = getFormatedDate(data);

  return { type, price, date: formatedDate };
};

export { generateService, generatePayment };
