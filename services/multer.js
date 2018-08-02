const multer = require('multer');

module.exports = (req, res, next) => multer({
	fileFilter: (req, file, next) => {
		if (!/\.(jpe?g|png|gif|bmp)$/i.test(file.originalname)) {
			req.err = "That file extension is not accepted!"
			next(null, false)
		}
 		next(null, true);
	}
}).single('file');
