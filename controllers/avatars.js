module.exports = app => {
	const { db, query: { getCurrentAvatar, deleteAvatar, updateAvatar } } = app.database;
	const { sendError } = app.shared.helpers;
	const upload = app.services.multer;
	const apiURL = app.get("apiURL");
	const fs = app.get("fs");

	return {
		// SAVES A NEW AVATAR
		create: (req, res, done) => upload(req, res, async (err, file) => {
			if ( err || !file) return sendError(err || 'Unable to save the new avatar image.', res, next);

			try {
				await db.result(updateAvatar(), [req.session.id, `${apiURL}/${req.file.path}`, req.file.path]);

				res.status(201).json({ message: 'Succesfully saved your new avatar.' });
			} catch (err) { return sendError(err, res, done); }
		})(req, res, done),
		// GETS USER CURRENT AVATAR
		getOne: async (req, res, done) => {
			try {
				const { avatarurl } = await db.oneOrNone(getCurrentAvatar(), [req.session.id])
					if (!avatarurl) return res.status(201).send(null);

				res.status(201).json({ avatarurl });
			} catch (err) { return sendError(err, res, done); }
		},
		// DELETES CURRENT AVATAR
		deleteOne: async (req, res, done) => {
			try {
				const avatar = db.oneOrNone(getCurrentAvatar(), [req.session.id])
				if (!avatar) return sendError('Could not locate your current avatar.', res, done)

				fs.unlink(`../${avatarFilePath}`, async err => {
					if (err) return sendError(err, res, done);
				});

				await db.result(deleteAvatar(), [req.session.id]);
				res.status(201).json({ message: 'Succesfully removed your current avatar.' });
			} catch (err) { return sendError(err, res, done); }
		},
		// DELETES CURRENT AVATAR
		updateOne: async (req, res, done) => {
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
			// } catch (err) { return sendError(err, res, done); }
		}
	}
}
