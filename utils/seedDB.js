/* eslint-disable */
import db from "db";

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

const noteTableOptions = `(
    id UUID DEFAULT uuid_generate_v1mc(),
    key SERIAL PRIMARY KEY,
    userid UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    read BOOLEAN DEFAULT false,
    icon VARCHAR,
    messageDate TEXT NOT NULL,
    message TEXT NOT NULL,
    deleted BOOLEAN DEFAULT false
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
    // create DB tables
    await db.none(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            CREATE TABLE users ${userTableOptions};
            CREATE TABLE notifications ${noteTableOptions};
            CREATE TABLE avatars ${avatarTableOptions};
          `);

    return console.log(
      "\n\x1b[7m\x1b[32;1m PASS \x1b[0m \x1b[2mutils/\x1b[0m\x1b[1mseedDB.js"
    );
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
