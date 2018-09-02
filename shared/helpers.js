const moment = require('moment');
const random = require('lodash.random');

const tokenGenerator = (str, tlen) => {
  const arr = [...str];
  const max = arr.length - 1;
  let token = '';
  for (i=0; i < tlen; i++){
    const int = random(max);
    token += arr[int];
  }
  return token;
}

module.exports = {
	currentDate: () => ( moment().utcOffset(-7).toISOString(true) ),
	createRandomToken: () => (tokenGenerator('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$/.', 64)),
	createRandomString: () => (tokenGenerator('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 32)),
	sendError: (err, res, done) => {
		return res.status(500).json({ err: err.toString() })
		done();
	}
}
