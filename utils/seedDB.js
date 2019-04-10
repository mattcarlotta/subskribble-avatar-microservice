/* eslint-disable */
require("@babel/register");
const bcrypt = require("bcrypt");
const moment = require("moment");
const db = require("../database/db");
const {
  createAvatar,
  createNewUser,
  findUserByEmail,
  setUserAsAdmin,
  verifyEmail
} = require("../database/queries");
const {
  currentDate,
  createRandomText,
  createRandomToken
} = require("../shared/helpers");

const fakeText = () => createRandomText();
const selectUserid = id => `(SELECT id FROM users WHERE id='${id}')`;
const endDate = moment()
  .utcOffset(-7)
  .add(30, "days")
  .toISOString(true);
const startDate = currentDate();

const userTableOptions = `(
    id UUID DEFAULT uuid_generate_v1mc() UNIQUE,
    key SERIAL PRIMARY KEY,
    verified BOOLEAN DEFAULT FALSE,
    email VARCHAR NOT NULL UNIQUE,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    password VARCHAR NOT NULL UNIQUE,
    company VARCHAR NOT NULL UNIQUE,
    startDate TIMESTAMP WITH TIME ZONE NOT NULL,
    credit INTEGER DEFAULT 0,
    token VARCHAR UNIQUE,
    collapseSideNav BOOLEAN DEFAULT FALSE,
    isGod BOOLEAN DEFAULT FALSE
  )`;

const avatarTableOptions = `(
      userid UUID NOT NULL,
      key SERIAL PRIMARY KEY,
      avatarURL TEXT DEFAULT NULL,
      avatarFilePath TEXT DEFAULT NULL,
      token VARCHAR UNIQUE
    )`;

const seedDB = async () => {
  try {
    await db.task("seed-database", async dbtask => {
      // create DB tables
      await dbtask.none(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            CREATE TABLE users ${userTableOptions};
            CREATE TABLE avatars ${avatarTableOptions};
          `);

      // create new user
      const token = createRandomToken(); // a token used for email verification
      const newPassword = await bcrypt.hash("password123", 12); // hash password before attempting to create the user
      await dbtask.none(createNewUser, [
        "betatester@subskribble.com",
        newPassword,
        "Beta",
        "Tester",
        "Subskribble",
        token,
        startDate
      ]);

      // get newly created user info
      const existingUser = await dbtask.oneOrNone(findUserByEmail, [
        "betatester@subskribble.com"
      ]);
      if (!existingUser) {
        return console.log(
          "\n--[ERROR]-- Seed FAILED to find the newly created user! Process has been terminated."
        );
      }

      // verify newly created user's email
      await dbtask.none(verifyEmail, [existingUser.email]);

      // set users as admin
      const { id } = existingUser;
      await dbtask.none(setUserAsAdmin, [id]);

      // create a fake avatar
      const avatarurl =
        "http://localhost:4000/uploads/1554851587204-ZkLaOKVrrgWTcBr0oUre9dVx9OYVwAV8-test.png";
      const avatarfilepath =
        "uploads/1554851587204-ZkLaOKVrrgWTcBr0oUre9dVx9OYVwAV8-test.png";
      await dbtask.none(createAvatar, [id, avatarurl, avatarfilepath, token]);

      // create a second fake avatar
      const token2 = createRandomToken();
      const id2 = "6d9a7d66-5b19-11e9-8d93-87d364087f65";
      const avatarurl2 =
        "http://localhost:4000/uploads/1554851587204-ZkLaOKVrrgWTcBr0oUre9dVx9OYVwAV8-test2.png";
      const avatarfilepath2 =
        "uploads/1554851587204-ZkLaOKVrrgWTcBr0oUre9dVx9OYVwAV8-test2.png";
      await dbtask.none(createAvatar, [
        id2,
        avatarurl2,
        avatarfilepath2,
        token2
      ]);

      return console.log(
        "\n\x1b[7m\x1b[32;1m PASS \x1b[0m \x1b[2mutils/\x1b[0m\x1b[1mseedDB.js"
      );
    });
  } catch (err) {
    return console.log(
      "\n\x1b[7m\x1b[31;1m FAIL \x1b[0m \x1b[2mutils/\x1b[0m\x1b[31;1mseedDB.js\x1b[0m\x1b[31m\n" +
        err.toString() +
        "\x1b[0m"
    );
  }
};

module.exports = seedDB;

/* eslint-enable */
