const moment = require('moment');

module.exports = {
	currentDate: () => ( moment().utcOffset(-7).toISOString(true) ),
	sendError: (err, res, done) => {
		return res.status(500).json({ err: err.toString() })
		done();
	}
}
