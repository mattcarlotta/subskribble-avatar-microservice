const bcrypt				= require(`bcrypt`);
const bodyParser 		= require(`body-parser`);
const cookieParser 	= require(`cookie-parser`);
const cookieSession	= require(`cookie-session`);
const cors					= require(`cors`);
const express 			= require(`express`);
const fs						= require(`fs`);
const moment				= require(`moment`);
const morgan 				= require(`morgan`);
const path					= require(`path`);
const multer				= require(`multer`);
const sharp					= require(`sharp`);
const config				= require(`../env/config.js`);

const env = process.env.NODE_ENV;
const currentENV = () => {
  const envirnoment = config[env];
  const keys = Object.keys(envirnoment);
  const values = Object.values(envirnoment);

  let variables = '';
  for (let i = 0; i < keys.length; i += 1) {
    variables += `\x1b[33m• ${keys[i].toUpperCase()}\x1b[0m: ${values[i]} \n `;
  }
  return variables;
};

// eslint-disable-next-line no-console
console.log(`
  \n[ \x1b[1mSUBSKRIBBLE AVATAR MICROSERVICE ${env.toUpperCase()} ENVIRONMENT\x1b[0m ]\n ${currentENV()}`
);

if (env !== 'development') {
  // eslint-disable-next-line no-console
  console.log(
    `\n\x1b[1mYour application is running on: ${config[env].portal}\x1b[0m`,
  );
}

//============================================================//
/* APP MIDDLEWARE */
//============================================================//
module.exports = app => {
	/// CONFIGS ///
	app.set(`apiURL`, config[env].apiURL); // sets current api route
	app.set(`env`, env); // sets current env mode (development, production or test)
	app.set(`cookieKey`, config[env].cookieKey); // sets unique cookie key
	app.set(`dbpassword`, config[env].dbpassword); // sets database password
	app.set(`dbport`, config[env].dbport); // sets database port
	app.set(`dbowner`, config[env].dbowner); // sets owner of database
	app.set(`database`, config[env].database); // sets database name
	app.set(`port`, config[env].port); // current listening port
	app.set(`portal`, config[env].portal); // sets current front-end url

	/// FRAMEWORKS ///
	app.set(`bcrypt`, bcrypt); // framework for hashing/salting passwords
	app.set(`express`, express); // framework for serving assets
	app.set(`fs`, fs); // file stream framework (used for deleting images and/or saving gifs)
	app.set(`moment`, moment); // framework for managing time
	app.set(`path`, path); // framework for directory paths
	app.set(`multer`, multer); // framework for parsing multi-part forms
	app.set(`sharp`, sharp); // framework for saving images
	app.use(cors({credentials: true, origin: config[env].portal})) // allows receiving of cookies from front-end
	app.use(morgan(`tiny`)); // logging framework
	app.use(multer({
		limits: {
			fileSize: 10240000,
			files: 1,
			fields: 1
		},
		fileFilter: (req, file, next) => {
			if (!/\.(jpe?g|png|gif|bmp)$/i.test(file.originalname)) {
				req.err = `That file extension is not accepted!`
				next(null, false)
			}
	 		next(null, true);
		}
	}).single(`file`))
	app.use(bodyParser.json()); // parses header requests (req.body)
	app.use(bodyParser.urlencoded({ limit: `10mb`, extended: true })); // allows objects and arrays to be URL-encoded
	app.use(cookieParser()); // parses header cookies
	app.use(cookieSession({ // sets up a cookie session as req.session ==> set in passport local login strategy
		name: `Authorization`,
		maxAge: 30 * 24 * 60 * 60 * 1000, // expire after 30 days, 24hr/60m/60s/1000ms
		keys: [config[env].cookieKey] // unique cookie key to encrypt/decrypt
	}));
	app.set(`json spaces`, 2); // sets JSON spaces for clarity
};
