module.exports = app => (req, res, next) => {
	const fs = app.get('fs');
	const multer = app.get('multer');
	const sharp = app.get('sharp');

	const uploadImage = multer({
		fileFilter: (req, file, next) => {
			return (!/\.(jpe?g|png|gif|bmp)$/i.test(file.originalname))
				? next('That file extension is not accepted!', false)
				: next(null, true);
		}
	}).single('file');

	uploadImage(req, res, (err) => {
		console.log('req.file was parsed:', req.file.originalname);
		if (err) return next(err, null);
		if (!req.file) return next('Unable to locate the requested file to be saved', null);

		const filename = Date.now() + '-' + req.file.originalname;
		const filepath = `uploads/${filename}`;

		if (/\.(gif)$/i.test(req.file.originalname) || /\.(bmp)$/i.test(req.file.originalname)) {
			fs.writeFile(filepath, req.file.buffer, (err) => {
				if (err) return next('There was a problem saving the image.', null)
				req.file.filename = filename;
				req.file.path = filepath;
				return next(null, req.file);
			})
		} else {
			sharp(req.file.buffer)
			.resize(256, 256)
			.max()
			.withoutEnlargement()
			.toFile(filepath)
			.then(() => {
				req.file.filename = filename;
				req.file.path = filepath;
				console.log('file was saved to:', filepath);
				return next(null, req.file);
			})
		}
	});

	return uploadImage;
}
