const jwt = require('jwt-simple');

module.exports = app => {
	const { db, query: { findUserByEmail } } = app.database;
	const { badCredentials, emailConfirmationReq } = app.shared.authErrors;
	const bcrypt = app.get("bcrypt");
	const cookieKey = app.get("cookieKey");
	const LocalStrategy = app.get("LocalStrategy");
	const passport = app.get("passport");

	passport.use('local-login', new LocalStrategy({
		// override username with email
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback: true
		},
		async (req, email, password, done) => {
			// check to see if both an email and password were supplied
			if (!email || !password) return done(badCredentials, false);

			// check to see if the user already exists
			const existingUser = await db.oneOrNone(findUserByEmail(), [email]);
			if (!existingUser) return done(badCredentials, false);
			if (!existingUser.verified) return done(emailConfirmationReq, false);

			// compare password to existingUser password
			const validPassword = await bcrypt.compare(password, existingUser.password);
			if (!validPassword) return done(badCredentials, false);

			const loggedinUser = { ...existingUser, token:  jwt.encode({ sub: existingUser.id, iat: new Date().getTime()}, cookieKey)}

			req.session = loggedinUser;

			return done(null, loggedinUser);
		})
	);
}
