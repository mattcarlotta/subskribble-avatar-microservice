module.exports = app => {
	const { db, query: { getCurrentAvatarPath, updateAvatar } } = app.database;
	const { sendError } = app.shared.helpers;
	const apiURL = app.get("apiURL");
	const fs = app.get("fs");

	return {
		// SAVES A NEW AVATAR
		create: async (req, res, done) => {
			try {
				const avatarurl = `${apiURL}/${req.file.path}`;

				await db.result(updateAvatar(), [req.session.id, avatarurl, req.file.path]);
				req.session.avatarurl = avatarurl;

				res.status(201).json({ avatarurl, message: 'Succesfully saved your new avatar.' });
			} catch (err) { return sendError(err, res, done); }
		},
		// DELETES CURRENT AVATAR
		deleteOne: async (req, res, done) => {
			try {
				const { avatarfilepath } = await db.oneOrNone(getCurrentAvatarPath(), [req.session.id])
				if (!avatarfilepath) return sendError('Unable to locate your current avatar file path', res, done);

				await fs.unlink(`${avatarfilepath}`, async err => {
					if (err) return sendError(err, res, done);
				});

				await db.result(updateAvatar(), [req.session.id, null, null]);
				req.session.avatarurl = undefined;

				res.status(201).json({ message: 'Succesfully removed your current avatar.' });
			} catch (err) { return sendError(err, res, done); }
		},
		// DELETES CURRENT AVATAR
		updateOne: async (req, res, done) => {
			try {
				const { avatarfilepath } = await db.oneOrNone(getCurrentAvatarPath(), [req.session.id])
				if (!avatarfilepath) return sendError('Unable to locate your current avatar file path', res, done);

				await fs.unlink(`${avatarfilepath}`, async err => {
					if (err) return sendError(err, res, done);
				});

				const avatarurl = `${apiURL}/${req.file.path}`;
				await db.result(updateAvatar(), [req.session.id, avatarurl, req.file.path]);
				req.session.avatarurl = avatarurl;

		    res.status(201).json({ avatarurl, message: 'Succesfully updated your avatar.' });
			} catch (err) { return sendError(err, res, done); }
		}
	}
}
