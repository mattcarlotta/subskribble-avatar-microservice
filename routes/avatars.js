module.exports = app => {
	const { avatars: { create, getOne, deleteOne, updateOne } } = app.controllers;
	const { db, query: { getCurrentAvatar, deleteAvatar, updateAvatar } } = app.database;
	const { requireAuth } = app.services.strategies;
	const { sendError } = app.shared.helpers;
	const apiURL = app.get("apiURL");
	const fs = app.get('fs');
	const multer = app.get('multer');
	const sharp = app.get('sharp');
	// const upload = multer({ dest: 'uploads/'})
	const upload = multer({
		fileFilter: (req, file, next) => {
			return (!/\.(jpe?g|png|gif|bmp)$/i.test(file.originalname))
				? next('That file extension is not accepted!', false)
				: next(null, true);
		}
	}).single('file');

	// app.post('/api/avatar/create', requireAuth, create);
	app.post('/api/avatar/create', requireAuth, upload, async (req, res, next) => {
		// if (err) return sendError(err, res, next);
		if (!req.file) return sendError('Unable to locate the requested file to be saved', res, next);
		console.log('req.file', req.file);
		const filename = Date.now() + '-' + req.file.originalname;
		const filepath = `uploads/${filename}`;

		if (/\.(gif)$/i.test(req.file.originalname) || /\.(bmp)$/i.test(req.file.originalname)) {
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
			await db.result(updateAvatar(), [req.session.id, `${apiURL}/${filepath}`, filepath]);

			res.status(201).json({ message: 'Succesfully saved your new avatar.' });
		} catch (err) {
			console.log('err', err)
			return sendError(err, res, next);
		}
	});
	app.get('/api/avatar/fetch-user-avatar', requireAuth, getOne);
	app.delete('/api/avatar/delete?', requireAuth, deleteOne);
	app.put('/api/avatar/update?', requireAuth, updateOne);
}
