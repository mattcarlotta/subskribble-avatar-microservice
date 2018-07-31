module.exports = app => {
	const { db, query: { createAvatar, getCurrentAvatar, deleteAvatar, updateAvatar } } = app.database;
	const { sendError } = app.shared.helpers;
	const multer = app.get("multer");
	const portal = app.get("portal");
	const fs = app.get("fs");

	return {
		// SAVES A NEW AVATAR
		create: (req, res, done) => {
			if (!req.file) return sendError('Unable to locate the new avatar image.', res, next);

			try {
				const avatarURL = `${portal}${req.file.path}`;
				const avatarFileName = req.file.name
				// req.body.image = {
				// 	fileName: req.file.filename,
				// 	originalName: req.file.originalname,
				// 	path: req.file.path,
				// 	apiURL: env.APIURL + req.file.path,
				// 	size: req.file.size
				// };

				await db.result(createAvatar, [req.session.id, avatarURL, avatarFileName ]);
				res.status(201).json({ message: 'Succesfully saved your new avatar.' });
			} catch (err) { return sendError(err, res, next); }
		},
		// DELETES CURRENT AVATAR
		deleteOne: (req, res, done) => {
			try {
				const avatar = db.oneOrNone(getCurrentAvatar(), [req.session.id])
				if (!avatar) return sendError('Could not locate your current avatar.', res, done)

				fs.unlink(`../uploads/${avatar.avatarFileName}`, async err => {
					if (err) return sendError(err, res, done);

					await db.result(deleteAvatar(), [req.session.id]);
					res.status(201).json({ message: 'Succesfully removed your current avatar.' });
				});
			} catch (err) { return sendError(err, res, next); }
		},
		// DELETES CURRENT AVATAR
		updateOne: (req, res, done) => {
			// try {
			//   const avatar = db.oneOrNone(getCurrentAvatar(), [req.session.id])
			//   if (!avatar) return sendError('Could not locate your current avatar.', res, done)
			//
			//   fs.unlink(`../uploads/${avatar.avatarFileName}`, async err => {
			//     if (err) return sendError(err, res, done);
			//
			//     await db.result(deleteAvatar(), [req.session.id]);
			//     res.status(201).json({ message: 'Succesfully removed your current avatar.' });
			//   });
			// } catch (err) { return sendError(err, res, next); }
		}
	}
}
