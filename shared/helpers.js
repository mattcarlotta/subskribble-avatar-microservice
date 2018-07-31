module.exports = {
	sendError: (err, res, done) => {
		return res.status(500).json({ err: err.toString() })
		done();
	}
}
