module.exports = app => {
	const { db, query: { createAvatar, createNotification, deleteAvatar, deleteAccountAvatar, getCurrentAvatarPath, getCurrentAvatarURL, updateAvatar } } = app.database;
	const { createRandomToken, currentDate, sendError } = app.shared.helpers;
	const apiURL = app.get(`apiURL`);
	const fs = app.get(`fs`);

	return {
		// SAVES A NEW AVATAR
		create: async (req, res, done) => {
			try {
				const avatarurl = `${apiURL}/${req.file.path}`;
				const token = createRandomToken();
				const date = currentDate();

				await db.result(createAvatar, [req.session.id, avatarurl, req.file.path, token]);
				req.session.avatarurl = avatarurl;

				await db.none(createNotification, [req.session.id, 'settings', `Succesfully saved your avatar.`, date]);

				res.status(201).json({ avatarurl });
			} catch (err) { return sendError(err, res, done); }
		},
		// DELETES CURRENT AVATAR WHILE LOGGED IN
		deleteOne: async (req, res, done) => {
			try {
				const { avatarfilepath } = await db.oneOrNone(getCurrentAvatarPath, [req.session.id])
				if (!avatarfilepath) return sendError(`Unable to locate your current avatar file path`, res, done);

				await fs.unlink(`${avatarfilepath}`, async err => {
					if (err) return sendError(err, res, done);
				});

				await db.result(deleteAvatar, [req.session.id]);
				req.session.avatarurl = undefined;

				res.status(201).json({ message: `Succesfully removed your current avatar.` });
			} catch (err) { return sendError(err, res, done); }
		},
		// FETCHES CURRENT AVATAR WHEN USER LOGINS IN
		fetchOne: async (req, res, done) => {
			try {
				const avatar = await db.oneOrNone(getCurrentAvatarURL, [req.session.id])
				if (!avatar) {
					res.status(201).send(null);
				} else {
					req.session.avatarurl = avatar.avatarurl;
					res.status(201).json({ avatarurl: avatar.avatarurl });
				}
			} catch (err) { return sendError(err, res, done); }
		},
		// DELETES CURRENT AVATAR WHEN USER ACCOUNT HAS BEEN CLOSED
		removeAccount: async (req, res, done) => {
			if (!req.body || !req.body.token || !req.body.userid) return sendError(`Missing avatar delete parameters.`, res, done);
			const { token, userid } = req.body;

			try {
				const { avatarfilepath } = await db.oneOrNone(getCurrentAvatarPath, [userid]);
				if (!avatarfilepath) return sendError(`Unable to locate your current avatar file path.`, res, done);

				await fs.unlink(`${avatarfilepath}`, async err => {
					if (err) return sendError(err, res, done);
				});

				await db.none(deleteAccountAvatar, [userid, token]);

				res.status(201).send(null);
			} catch (err) { return sendError(err, res, done); }
		},
		// DELETES CURRENT AVATAR
		updateOne: async (req, res, done) => {
			try {
				const { avatarfilepath } = await db.oneOrNone(getCurrentAvatarPath, [req.session.id]);
				if (!avatarfilepath) return sendError(`Unable to locate your current avatar file path`, res, done);

				await fs.unlink(`${avatarfilepath}`, async err => {
					if (err) return sendError(err, res, done);
				});

				const avatarurl = `${apiURL}/${req.file.path}`;
				await db.result(updateAvatar, [req.session.id, avatarurl, req.file.path]);
				req.session.avatarurl = avatarurl;

				const date = currentDate();
				await db.none(createNotification, [req.session.id, 'settings', `Succesfully updated your avatar.`, date]);

		    res.status(201).json({ avatarurl });
			} catch (err) { return sendError(err, res, done); }
		}
	}
}
