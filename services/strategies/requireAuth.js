module.exports = app => (req, res, next) => {
	if (!req.session.id) return res.status(401).send({ err: "There was a problem with your login credentials. Please make sure your username and password are correct." });
	next();
};
