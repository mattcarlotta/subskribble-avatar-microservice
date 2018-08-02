module.exports = app => {
	const { avatars: { create, getOne, deleteOne, updateOne } } = app.controllers;
	const { db, query: { getCurrentAvatar, deleteAvatar, updateAvatar } } = app.database;
	const { requireAuth } = app.services.strategies;
	const { sendError } = app.shared.helpers;
	const apiURL = app.get("apiURL");
	const fs = app.get('fs');
	const sharp = app.get('sharp');
	// const multer = require('multer');
	const parseFile = app.services.multer;
	const saveImage = app.services.sharp;

	app.post('/api/avatar/create', requireAuth, parseFile, saveImage, create);
	// app.post('/api/avatar/create', requireAuth, parseFile, saveImage, async (req, res, next) => {
		// console.log('req.file', req.file);
		// return sendError('Route not working yet!', res, next);
		// if (req.err) return sendError(req.err, res, next);
		// if (!req.file) return sendError('Unable to locate the requested file to be saved', res, next);
		//
		// const filename = Date.now() + '-' + req.file.originalname;
		// const filepath = `uploads/${filename}`;
		// if (/\.(gif|bmp)$/i.test(req.file.originalname)) {
		// 	fs.writeFile(filepath, req.file.buffer, (err) => {
		// 		if (err) return sendError('There was a problem saving the image.', res, next);
		// 		// return next(null, req.file);
		// 	})
		// } else {
		// 	sharp(req.file.buffer)
		// 	.resize(256, 256)
		// 	.max()
		// 	.withoutEnlargement()
		// 	.toFile(filepath)
		// 	.then(() => {
		// 		console.log('file was saved to:', filepath);
		// 		// return next(null, req.file);
		// 	})
		// }

		// try {
		// 	const avatarurl = `${apiURL}/${req.file.path}`;
		//
		// 	await db.result(updateAvatar(), [req.session.id, avatarurl, req.file.path]);
		// 	req.session.avatarurl = avatarurl;
		//
		// 	res.status(201).json({ avatarurl, message: 'Succesfully saved your new avatar.' });
		// } catch (err) {
		// 	console.log('err', err)
		// 	return sendError(err, res, next);
		// }
	// });
	app.get('/api/avatar/fetch-user-avatar', requireAuth, getOne);
	app.delete('/api/avatar/delete?', requireAuth, deleteOne);
	app.put('/api/avatar/update?', requireAuth, updateOne);
}
