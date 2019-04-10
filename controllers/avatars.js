const fs = require('fs');
const db = require('db');
const {
  createAvatar,
  createNotification,
  deleteAvatar,
  deleteAccountAvatar,
  getCurrentAvatarPath,
  getCurrentAvatarURL,
  updateAvatar,
} = require('queries');
const { createRandomToken, currentDate, sendError } = require('helpers');
const { missingDeleteParams, unableToLocateAvatar } = require('authErrors');

const config = require('env');

const env = process.env.NODE_ENV;
const { apiURL } = config[env];

module.exports = {
  // SAVES A NEW AVATAR
  create: async (req, res, done) => {
    try {
      await db.task('create-avatar', async (dbtask) => {
        const avatarurl = `${apiURL}/${req.file.path}`;
        const token = createRandomToken();
        const date = currentDate();

        await dbtask.result(createAvatar, [
          req.session.id,
          avatarurl,
          req.file.path,
          token,
        ]);
        req.session.avatarurl = avatarurl;

        await dbtask.none(createNotification, [
          req.session.id,
          'settings',
          'Succesfully saved your avatar.',
          date,
        ]);

        res.status(201).json({ avatarurl });
      });
    } catch (err) {
      return sendError(err, res, done);
    }
  },
  // DELETES CURRENT AVATAR WHILE LOGGED IN
  deleteOne: async (req, res, done) => {
    try {
      await db.task('delete-avatar', async (dbtask) => {
        const { avatarfilepath } = await dbtask.oneOrNone(
          getCurrentAvatarPath,
          [req.session.id],
        );
        if (!avatarfilepath) {
          return sendError(unableToLocateAvatar, res, done);
        }

        await fs.unlink(`${avatarfilepath}`, async (err) => {
          if (err) return sendError(err, res, done);
        });

        await dbtask.result(deleteAvatar, [req.session.id]);
        req.session.avatarurl = undefined;

        res
          .status(201)
          .json({ message: 'Succesfully removed your current avatar.' });
      });
    } catch (err) {
      return sendError(err, res, done);
    }
  },
  // FETCHES CURRENT AVATAR WHEN USER LOGINS IN
  fetchOne: async (req, res, done) => {
    try {
      const avatar = await db.oneOrNone(getCurrentAvatarURL, [req.session.id]);
      if (!avatar) {
        res.status(200).send(null);
      } else {
        req.session.avatarurl = avatar.avatarurl;
        res.status(201).json({ avatarurl: avatar.avatarurl });
      }
    } catch (err) {
      return sendError(err, res, done);
    }
  },
  // DELETES CURRENT AVATAR WHEN USER ACCOUNT HAS BEEN CLOSED
  removeAccount: async (req, res, done) => {
    const { token, userid } = req.body;

    if (!token || !userid) return sendError(missingDeleteParams, res, done);

    try {
      await db.task('remove-avatar-account', async (dbtask) => {
        const { avatarfilepath } = await dbtask.oneOrNone(
          getCurrentAvatarPath,
          [userid],
        );
        if (!avatarfilepath) {
          return sendError(unableToLocateAvatar, res, done);
        }

        await fs.unlink(`${avatarfilepath}`, async (err) => {
          if (err) return sendError(err, res, done);
        });

        await dbtask.none(deleteAccountAvatar, [userid, token]);

        res.status(201).send(null);
      });
    } catch (err) {
      return sendError(err, res, done);
    }
  },
  // DELETES CURRENT AVATAR
  updateOne: async (req, res, done) => {
    try {
      await db.task('update-avatar', async (dbtask) => {
        const { avatarfilepath } = await dbtask.oneOrNone(
          getCurrentAvatarPath,
          [req.session.id],
        );
        if (!avatarfilepath) {
          return sendError(unableToLocateAvatar, res, done);
        }

        await fs.unlink(`${avatarfilepath}`, async (err) => {
          if (err) return sendError(err, res, done);
        });

        const avatarurl = `${apiURL}/${req.file.path}`;
        await dbtask.result(updateAvatar, [
          req.session.id,
          avatarurl,
          req.file.path,
        ]);
        req.session.avatarurl = avatarurl;

        const date = currentDate();
        await dbtask.none(createNotification, [
          req.session.id,
          'settings',
          'Succesfully updated your avatar.',
          date,
        ]);

        res.status(201).json({ avatarurl });
      });
    } catch (err) {
      return sendError(err, res, done);
    }
  },
};
