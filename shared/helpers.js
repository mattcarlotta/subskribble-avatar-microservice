const randomToken  = require('random-token').create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

module.exports = {
	createRandomToken: () => (randomToken(32)),
	parseStringToNum: str => (parseInt(str, 10)),
	sendError: (err, res, done) => {
		return res.status(500).json({ err: err.toString() })
		done();
	}
}
