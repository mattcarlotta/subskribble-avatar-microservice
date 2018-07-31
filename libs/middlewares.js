const bcrypt        = require('bcrypt');
const bodyParser 		= require('body-parser');
const cookieParser 	= require('cookie-parser');
const cookieSession = require('cookie-session');
const cors					= require('cors');
const fs            = require('fs');
const passport 			= require('passport');
const moment				= require('moment');
const LocalStrategy = require('passport-local').Strategy;
const morgan 				= require('morgan');
const multer				= require('multer');
const sharp					= require('sharp');
const vars        	= require('../config/vars.js');

const env = process.env.NODE_ENV;
console.log(`[SUBSKRIBBLE AVATAR MICROSERVICE ${env.toUpperCase()} ENVIRONMENT] \n`, vars[env], "\n");
//============================================================//
/* APP MIDDLEWARE */
//============================================================//
module.exports = app => {
	/// CONFIGS ///
	app.set('env', env); // sets current env mode (development, production or test)
	app.set("cookieKey", vars[env].cookieKey); // sets unique cookie key
	app.set('dbpassword', vars[env].dbpassword); // sets database password
	app.set('dbport', vars[env].dbport); // sets database port
	app.set('dbowner', vars[env].dbowner); // sets owner of database
	app.set('database', vars[env].database); // sets database name
	app.set("port", vars[env].port); // current listening port
	app.set('portal', vars[env].portal); // sets current front-end url

	/// FRAMEWORKS ///
	app.set('bcrypt', bcrypt); // framework for hashing/salting passwords
	app.set('fs', fs); // file stream framework (used for deleting images and/or saving gifs)
	app.set('LocalStrategy', LocalStrategy); // passport LocalStrategy framework
	app.set("moment", moment); // framework for managing time
	app.set("multer", multer); // framework for parsing mult-part forms
	app.set("passport", passport); // framework for authenticating users
	app.set("sharp", sharp); // framework for saving images
	app.use(cors({credentials: true, origin: vars[env].portal})) // allows receiving of cookies from front-end
	app.use(morgan('tiny')); // logging framework
	app.use(bodyParser.json()); // parses header requests (req.body)
	app.use(bodyParser.urlencoded({ extended: true })); // allows objects and arrays to be URL-encoded
	app.use(cookieParser()); // parses header cookies
	app.use(cookieSession({ // sets up a cookie session as req.session ==> set in passport local login strategy
		name: 'Authorization',
		maxAge: 30 * 24 * 60 * 60 * 1000, // expire after 30 days, 24hr/60m/60s/1000ms
		keys: [vars[env].cookieKey] // unique cookie key to encrypt/decrypt
	}));
	app.use(passport.initialize()); // initialize passport routes to accept req/res/next
	app.set('json spaces', 2); // sets JSON spaces for clarity
};
