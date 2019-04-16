import isEmpty from 'lodash/isEmpty';
import { badCredentials } from 'authErrors';

export default (req, res, next) => {
  if (isEmpty(req.session) || !req.session.id) {
    return res.status(401).send({ err: badCredentials });
  }
  next();
};
