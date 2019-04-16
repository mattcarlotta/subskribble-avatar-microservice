import promise from 'bluebird';
import monitor from 'pg-monitor';
import pgPromise from 'pg-promise';
import config from 'env';

const initOptions = { promiseLib: promise }; // Database options
const pgp = pgPromise(initOptions); // initialize pg-promise w/options

const env = process.env.NODE_ENV;
// Database connection logger
if (env === 'development') {
  monitor.attach(initOptions, ['query', 'error']);
} else {
  monitor.attach(initOptions, ['error']);
}

export default pgp({
  host: config[env].host,
  password: config[env].dbpassword,
  port: config[env].dbport,
  user: config[env].dbowner,
  database: config[env].database,
});
