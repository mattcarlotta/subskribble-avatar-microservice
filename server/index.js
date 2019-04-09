const express = require('express');
const config = require('env');

module.exports = (app) => {
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
