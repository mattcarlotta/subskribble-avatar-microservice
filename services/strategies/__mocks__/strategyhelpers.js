import db from "db";
import {
  createAvatar,
  createNewUser,
  findUserByEmail,
  verifyEmail,
} from "queries";
import { currentDate, createRandomString, createRandomToken } from "helpers";
import config from "env";

const env = process.env.NODE_ENV;
const { apiURL } = config[env];

const signupUser = async (email, company, createfakeavatar) => {
  const startDate = currentDate();
  const token = createRandomToken();
  const newPassword = createRandomString();

  await db.task("setup-signup", async (dbtask) => {
    await dbtask.none(createNewUser, [
      email,
      newPassword,
      "Beta",
      "Tester",
      company,
      token,
      startDate,
    ]);

    await dbtask.none(verifyEmail, [email]);
  });

  const newUser = await db.oneOrNone(findUserByEmail, [email]);

  if (createfakeavatar) {
    const randomString = createRandomString();
    const filename = `${randomString}-fakeimage.png`;
    const avatarfilepath = `uploads/${filename}`;
    const avatarurl = `${apiURL}/${avatarfilepath}`;

    await db.none(createAvatar, [newUser.id, avatarurl, avatarfilepath, token]);
  }

  return newUser;
};

const mockRequest = (session, file, err) => ({
  session,
  file,
  err,
});

const mockResponse = () => {
  const res = {};
  res.clearCookie = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export { mockRequest, mockResponse, signupUser };
