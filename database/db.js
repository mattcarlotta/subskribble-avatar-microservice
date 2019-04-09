const promise = require('bluebird');
const monitor = require('pg-monitor');

const initOptions = { promiseLib: promise }; // Database options
const pgp = require('pg-promise')(initOptions); // initialize pg-promise w/options
const config = require('env');

const env = process.env.NODE_ENV;
// Database connection logger
if (env === 'development') {
  monitor.attach(initOptions, ['query', 'error']);
} else {
  monitor.attach(initOptions, ['error']);
}

module.exports = pgp({
  host: config[env].host,
  password: config[env].dbpassword,
  port: config[env].dbport,
  user: config[env].dbowner,
  database: config[env].database,
});
