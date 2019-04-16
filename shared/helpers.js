import moment from 'moment';
import random from 'lodash/random';

const tokenGenerator = (str, tlen) => {
  const arr = [...str];
  const max = arr.length - 1;
  let token = '';
  for (let i = 0; i < tlen; i += 1) {
    const int = random(max);
    token += arr[int];
  }
  return token;
};

const currentDate = () => moment()
  .utcOffset(-7)
  .toISOString(true);

const createRandomToken = () => tokenGenerator(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$/.',
  64,
);

const createRandomString = () => tokenGenerator(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  32,
);

const sendError = (err, res, done) => {
  return res.status(500).json({ err: err.toString() });
  done();
};

export {
  currentDate, createRandomToken, createRandomString, sendError,
};
