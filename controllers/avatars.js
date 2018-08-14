const randomToken  = require('random-token').create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

module.exports = app => {
	const { db, query: { createAvatar, deleteAvatar, deleteAccountAvatar, getCurrentAvatarPath, getCurrentAvatarURL, updateAvatar } } = app.database;
	const { sendError } = app.shared.helpers;
	const apiURL = app.get("apiURL");
	const fs = app.get("fs");

	return {
		// SAVES A NEW AVATAR
		create: async (req, res, done) => {
			try {
				const avatarurl = `${apiURL}/${req.file.path}`;
				const token = randomToken(32);

				await db.result(createAvatar(), [req.session.id, avatarurl, req.file.path, token]);
				req.session.avatarurl = avatarurl;

				res.status(201).json({ avatarurl, message: 'Succesfully saved your new avatar.' });
			} catch (err) { return sendError(err, res, done); }
		},
		// DELETES CURRENT AVATAR WHILE LOGGED IN
		deleteOne: async (req, res, done) => {
			try {
				const { avatarfilepath } = await db.oneOrNone(getCurrentAvatarPath(), [req.session.id])
				if (!avatarfilepath) return sendError('Unable to locate your current avatar file path', res, done);

				await fs.unlink(`${avatarfilepath}`, async err => {
					if (err) return sendError(err, res, done);
				});

				await db.none(deleteAvatar(), [req.session.id]);
				req.session.avatarurl = undefined;

				res.status(201).json({ message: 'Succesfully removed your current avatar.' });
			} catch (err) { return sendError(err, res, done); }
		},
		// FETCHES CURRENT AVATAR WHEN USER LOGINS IN
		fetchOne: async (req, res, done) => {
			try {
				const { avatarurl } = await db.oneOrNone(getCurrentAvatarURL(), [req.session.id])

				if (avatarurl) req.session.avatarurl = avatarurl;

				return avatarurl
				? res.status(201).json({ avatarurl })
				: res.status(201).json({})

			} catch (err) { return sendError(err, res, done); }
		},
		// DELETES CURRENT AVATAR WHEN USER ACCOUNT HAS BEEN CLOSED
		removeAccount: async (req, res, done) => {
			if (!req.body || !req.body.token || !req.body.userid) return sendError('Missing avatar delete parameters.', res, done);
			const { token, userid } = req.body;

			console.log('userid', userid);

			try {
				const { avatarfilepath } = await db.oneOrNone(getCurrentAvatarPath(), [userid])
				if (!avatarfilepath) return sendError('Unable to locate your current avatar file path.', res, done);

				await fs.unlink(`${avatarfilepath}`, async err => {
					if (err) return sendError(err, res, done);
				});

				await db.none(deleteAccountAvatar(), [userid, token])

				res.status(201).json({});
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
