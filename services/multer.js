const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');

const uploadImage = multer({
	fileFilter: (req, file, next) => {
		if (!/\.(jpe?g|png|gif|bmp)$/i.test(file.originalname)) {
			return next('That file extension is not accepted!', false);
		}
		next(null, true);
	}
}).single('file');

module.exports = (req, res, done) => {
	uploadImage(req, res, (err) => {
		if (err) return done(null, false, err);
		if (!req.file) return done(null, false);
		
		const filename = Date.now() + '-' + req.file.originalname;
		const filepath = `uploads/${filename}`;

		if (/\.(gif)$/i.test(req.file.originalname)) {
			fs.writeFile(filepath, req.file.buffer, (err) => {
				if (err) return done(null, false, 'There was a problem saving the gif image.')
				req.file.filename = filename;
				req.file.path = filepath;
				return done(null, true);
			})
		} else {
			sharp(req.file.buffer)
			.resize(800, 600)
			.max()
			.withoutEnlargement()
			.toFile(filepath)
			.then(() => {
				req.file.filename = filename;
				req.file.path = filepath;
				return done(null, true);
			});
		}
	});
};
