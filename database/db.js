const promise = require('bluebird');
const monitor = require('pg-monitor');

const initOptions = { promiseLib: promise }; // Database options
const pgp = require('pg-promise')(initOptions) // initialize pg-promise w/options
// Database connection logger
process.env.NODE_ENV === 'development' ? monitor.attach(initOptions, ['query', 'error']) : monitor.attach(initOptions, ['error'])

module.exports = app => (
	// Database connection details;
	pgp({
		host: app.get("host"),
		password: app.get("dbpassword"),
		port: app.get("dbport"),
		user:  app.get("dbowner"),
		database: app.get('database'),
	})
)
