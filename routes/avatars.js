module.exports = app => {
	const { avatars: { create, getOne, deleteOne, updateOne } } = app.controllers;
	const { db, query: { getCurrentAvatar, deleteAvatar, updateAvatar } } = app.database;
	const { requireAuth } = app.services.strategies;
	const { sendError } = app.shared.helpers;
	const apiURL = app.get("apiURL");
	const fs = app.get('fs');
	const sharp = app.get('sharp');
	const multer = require('multer');
	const upload = app.services.multer;
	// const upload = multer({ dest: 'uploads/'})
	// const upload = multer({
	// 	fileFilter: (req, file, next) => {
	// 		return (!/\.(jpe?g|png|gif|bmp)$/i.test(file.originalname))
	// 			? next('That file extension is not accepted!', false)
	// 			: next(null, true);
	// 	}
	// }).single('file');

	// app.post('/api/avatar/create', requireAuth, create);
	app.post('/api/avatar/create', requireAuth, upload, async (req, res, next) => {
		if (req.err) return sendError(req.err, res, next);
		if (!req.file) return sendError('Unable to locate the requested file to be saved', res, next);

		const filename = Date.now() + '-' + req.file.originalname;
		const filepath = `uploads/${filename}`;
		if (/\.(gif|bmp)$/i.test(req.file.originalname)) {
			fs.writeFile(filepath, req.file.buffer, (err) => {
				if (err) return sendError('There was a problem saving the image.', res, next);
				// return next(null, req.file);
			})
		} else {
			sharp(req.file.buffer)
			.resize(256, 256)
			.max()
			.withoutEnlargement()
			.toFile(filepath)
			.then(() => {
				console.log('file was saved to:', filepath);
				// return next(null, req.file);
			})
		}

		try {
			const avatarurl = `${apiURL}/${filepath}`;

			await db.result(updateAvatar(), [req.session.id, avatarurl, filepath]);
			req.session.avatarurl = avatarurl;

			res.status(201).json({ avatarurl, message: 'Succesfully saved your new avatar.' });
		} catch (err) {
			console.log('err', err)
			return sendError(err, res, next);
		}
	});
	app.get('/api/avatar/fetch-user-avatar', requireAuth, getOne);
	app.delete('/api/avatar/delete?', requireAuth, deleteOne);
	app.put('/api/avatar/update?', requireAuth, updateOne);
}
