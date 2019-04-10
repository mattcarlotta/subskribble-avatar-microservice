const isEmpty = require('lodash/isEmpty');
const { badCredentials } = require('authErrors');

module.exports = (req, res, next) => {
  if (isEmpty(req.session) || !req.session.id) {
    return res.status(401).send({ err: badCredentials });
  }
  next();
};
