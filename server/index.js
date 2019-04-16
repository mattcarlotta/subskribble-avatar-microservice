import express from 'express';
import config from 'env';

export default (app) => {
  const env = process.env.NODE_ENV;
  //= ===========================================================//
  // EXPRESS SERVE AVATAR IMAGES
  //= ===========================================================//
  app.use('/uploads', express.static('uploads'));

  //= ===========================================================//
  /* CREATE EXPRESS SERVER */
  //= ===========================================================//
  app.listen(config[env].port);
};
