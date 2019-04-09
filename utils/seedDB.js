/* eslint-disable */
require("@babel/register");
const bcrypt = require("bcrypt");
const moment = require("moment");
const db = require("../database/db");
const {
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

const SEED = process.env.SEED;

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

const planTableOptions = `(
    id UUID DEFAULT uuid_generate_v1mc(),
    key SERIAL PRIMARY KEY,
    userid UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR DEFAULT 'active',
    planName VARCHAR NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    setupFee DECIMAL(12,2),
    billEvery VARCHAR NOT NULL,
    trialPeriod VARCHAR,
    startDate TIMESTAMP WITH TIME ZONE NOT NULL,
    subscribers INTEGER DEFAULT 0
  )`;

const promoTableOptions = `(
    id UUID DEFAULT uuid_generate_v1mc(),
    key SERIAL PRIMARY KEY,
    userid UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR DEFAULT 'active',
    plans TEXT ARRAY NOT NULL,
    promoCode VARCHAR NOT NULL,
    amount INTEGER NOT NULL,
    discountType VARCHAR NOT NULL,
    startDate TIMESTAMP WITH TIME ZONE NOT NULL,
    endDATE TIMESTAMP WITH TIME ZONE NOT NULL,
    maxUsage INTEGER NOT NULL,
    totalUsage INTEGER DEFAULT 0
  )`;

const subTableOptions = `(
    id UUID DEFAULT uuid_generate_v1mc(),
    key SERIAL PRIMARY KEY,
    userid UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR DEFAULT 'active',
    email VARCHAR,
    subscriber VARCHAR NOT NULL,
    planName VARCHAR NOT NULL,
    credits DECIMAL(12,2) DEFAULT 0.00,
    amount DECIMAL(12,2),
    billingAddress TEXT,
    billingCity TEXT,
    billingState TEXT,
    billingUnit TEXT,
    billingZip TEXT,
    contactAddress TEXT,
    contactCity TEXT,
    contactState TEXT,
    contactUnit TEXT,
    contactZip TEXT,
    contactPhone VARCHAR,
    promoCode TEXT,
    sameBillingAddress BOOLEAN,
    startDate TIMESTAMP WITH TIME ZONE NOT NULL,
    endDATE TIMESTAMP WITH TIME ZONE
  )`;

const templateTableOptions = `(
    id UUID DEFAULT uuid_generate_v1mc(),
    key SERIAL PRIMARY KEY,
    userid UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR DEFAULT 'active',
    fromSender VARCHAR NOT NULL,
    subject VARCHAR NOT NULL,
    templateName VARCHAR UNIQUE,
    uniqueTemplateName VARCHAR UNIQUE,
    message TEXT NOT NULL,
    plans TEXT ARRAY NOT NULL
  )`;

const transTableOptions = `(
    id UUID DEFAULT uuid_generate_v1mc(),
    key SERIAL PRIMARY KEY,
    userid UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR,
    invoice UUID DEFAULT uuid_generate_v1mc(),
    planName VARCHAR NOT NULL,
    subscriber VARCHAR NOT NULL,
    email VARCHAR,
    processor VARCHAR NOT NULL,
    amount DECIMAL(12,2),
    chargeDate TEXT,
    refundDate TEXT
  )`;

const messageTableOptions = `(
    id UUID DEFAULT uuid_generate_v1mc(),
    key SERIAL PRIMARY KEY,
    userid UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fromSender VARCHAR NOT NULL,
    subject VARCHAR NOT NULL,
    sentDate TEXT NOT NULL,
    template VARCHAR,
    plans TEXT ARRAY NOT NULL
  )`;

const feedbackTableOptions = `(
    id UUID DEFAULT uuid_generate_v1mc(),
    key SERIAL PRIMARY KEY,
    company VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    reason TEXT
  )`;

const avatarTableOptions = `(
    userid UUID NOT NULL,
    key SERIAL PRIMARY KEY,
    avatarURL TEXT DEFAULT NULL,
    avatarFilePath TEXT DEFAULT NULL,
    token VARCHAR UNIQUE
  )`;

const noteProperties = "(userid, icon, message, read, messageDate)";
const planProperties =
  "(userid, status, planName, description, amount, setupFee, billEvery, trialPeriod, startDate, subscribers)";
const promoProperties =
  "(userid, status, plans, promoCode, amount, discountType, maxUsage, totalUsage, startDate, endDate)";
const subProperties =
  "(userid, status, email, subscriber, contactPhone, planName, startDate, endDate, amount)";
const templateProperties =
  "(userid, status, templateName, uniqueTemplateName, fromSender, subject, message, plans)";
const transProperties =
  "(userid, status, planName, email, subscriber, processor, amount, chargeDate, refundDate)";
const messageProperties =
  "(userid, template, fromSender, subject, sentDate, plans)";

const planValues = id => `
  (${selectUserid(
    id
  )}, 'active', 'Carlotta Prime', 'Carlotta Subscription', 99.99, null, 'Monthly', null, '${startDate}', 12),
  (${selectUserid(
    id
  )}, 'active', 'Carlotta Switch', 'Carlotta Subscription', 49.99, null, 'Bi-Monthly', '2 Weeks', '${startDate}', 1),
  (${selectUserid(
    id
  )}, 'active', 'Carlotta Corp', 'Carlotta Subscription', 299.99, 4.99, 'Monthly', null, '${startDate}', 10),
  (${selectUserid(
    id
  )}, 'active', 'Carlotta Inc.', 'Carlotta Subscription', 1999.99, 399.99, 'Annually', '3 Months', '${startDate}', 5),
  (${selectUserid(
    id
  )}, 'active', 'Carlotta LLC', 'Carlotta Subscription', 499.99, 299.99, 'Quarterly', '2 Weeks', '${startDate}', 11),
  (${selectUserid(
    id
  )}, 'active', 'Carlotta Dealership', 'Carlotta Subscription', 699.99, 24.99, 'Quarterly', null, '${startDate}', 6),
  (${selectUserid(
    id
  )}, 'active', 'Carlotta Affiliates', 'Carlotta Subscription', 79.99, 9.99, 'Bi-Weekly', '1 Month', '${startDate}', 0),
  (${selectUserid(
    id
  )}, 'active', 'Carlotta Sales', 'Carlotta Subscription', 9.99, null, 'Weekly', '1 Week', '${startDate}', 4),
  (${selectUserid(
    id
  )}, 'active', 'Carlotta Automechs', 'Carlotta Subscription', 14.99, 249.99, 'Monthly', '1 Month', '${startDate}', 22),
  (${selectUserid(
    id
  )}, 'active', 'Carlotta Solar', 'Carlotta Subscription', 44.99, 199.99, 'Monthly', '2 Weeks', '${startDate}', 5),
  (${selectUserid(
    id
  )}, 'active', 'Carlotta Twitch', 'Carlotta Subscription', 4.99, null, 'Bi-Monthly', '2 Months', '${startDate}', 2),
  (${selectUserid(
    id
  )}, 'active', 'Carlotta Youtube', 'Carlotta Subscription', 1.99, null, 'Weekly', null, '${startDate}', 8),
  (${selectUserid(
    id
  )}, 'suspended', 'Carlotta .com', 'Carlotta Subscription', 69.99, null, 'Monthly', '1 Month', '${startDate}', 3),
  (${selectUserid(
    id
  )}, 'suspended', 'Carlotta Partners', 'Carlotta Subscription', 99.99, null, 'Bi-Monthly', '1 Month', '${startDate}', 2),
  (${selectUserid(
    id
  )}, 'suspended', 'Carlotta Church', 'Carlotta Subscription', 0.00, null, 'Annually', null, '${startDate}', 4),
  (${selectUserid(
    id
  )}, 'suspended', 'Carlotta Industries', 'Carlotta Subscription', 149.99, 29.99, 'Annually', null, '${startDate}', 6),
  (${selectUserid(
    id
  )}, 'suspended', 'Carlotta Workshops', 'Carlotta Subscription', 39.99, 5.99, 'Bi-Weekly', '1 Month', '${startDate}', 7),
  (${selectUserid(
    id
  )}, 'suspended', 'Carlotta Sports', 'Carlotta Subscription', 19.99, null, 'Monthly', null, '${startDate}', 6),
  (${selectUserid(
    id
  )}, 'suspended', 'Carlotta Cars Magazine', 'Carlotta Subscription', 2.99, null, 'Weekly', '1 Week', '${startDate}', 2),
  (${selectUserid(
    id
  )}, 'suspended', 'Carlotta Flagships', 'Carlotta Subscription', 18.99, null, 'Bi-Monthly', '2 Months', '${startDate}', 5),
  (${selectUserid(
    id
  )}, 'suspended', 'Carlotta Protocols', 'Carlotta Subscription', 15.99, null, 'Bi-Monthly', '2 Months', '${startDate}', 7),
  (${selectUserid(
    id
  )}, 'suspended', 'Carlotta ISP', 'Carlotta Subscription', 89.99, 99.90, 'Monthly', null, '${startDate}', 9),
  (${selectUserid(
    id
  )}, 'suspended', 'Carlotta Pumps', 'Carlotta Subscription', 279.99, 198.89, 'Quarterly', '2 Weeks', '${startDate}', 4),
  (${selectUserid(
    id
  )}, 'suspended', 'Carlotta Assoc.', 'Carlotta Subscription', 69.99, null, 'Monthly', '1 Month', '${startDate}', 5);
  `;

const promoValues = id => `
  (${selectUserid(
    id
  )}, 'active', ARRAY ['Carlotta Prime'], 'FIRST10KACCOUNTS', '5', '%', 10000, 29, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'active', ARRAY ['Carlotta Prime'], '10PERCENTOFF', '10', '%', 100, 85, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'active', ARRAY ['Carlotta Dealership'], 'FALLBACKSALE', '15', '$', 200, 48, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'active', ARRAY ['Carlotta Twitch'], 'EVERYLOWPRICES', '20', '%', 100, 5, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'active', ARRAY ['Carlotta Solar'], 'MILITARYDISCOUNT', '25', '%', 50, 11, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'active', ARRAY ['Carlotta Prime'], '30PERCENTOFF', '30', '%', 1000, 40, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'active', ARRAY ['Carlotta Sales'], 'SPRINGSALE', '50', '$', 30, 29, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'active', ARRAY ['Carlotta Prime'], '60PERCENTOFF', '60', '%', 50, 12, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'active', ARRAY ['Carlotta Switch'], '70PERCENTOFF', '70', '%', 20, 19, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'active', ARRAY ['Carlotta Prime'], '80PERCENTOFF', '80', '%', 10, 1, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'active', ARRAY ['Carlotta Youtube'], '90PERCENTOFF', '90', '%', 10, 6, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'active', ARRAY ['Carlotta Prime'], 'FREETRIAL', '100', '%', 2147483647, 8, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'suspended', ARRAY ['Carlotta .com'], 'FREETRIALOFFER', '100', '%', 20, 20, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'suspended', ARRAY ['Carlotta Partners'], 'XCLUSIVECLUB', '20', '$', 500, 24, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'suspended', ARRAY ['Carlotta Church'], '4CHARITY', '100', '%', 1000, 45, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'suspended', ARRAY ['Carlotta Industries'], 'HARDWORKENVBENEFITS', '200', '$', 1000, 54, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'suspended', ARRAY ['Carlotta Workshops'], 'WORKXSHOPPE', '10', '%', 100, 4, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'suspended', ARRAY ['Carlotta Sports'], 'GETAWORKOUT', '20', '%', 20, 11, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'suspended', ARRAY ['Carlotta Cars Magazine'], '1FREECARMAGZ', '2', '$', 100, 23, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'suspended', ARRAY ['Carlotta Flagships'], '20PERCENTOFF', '20', '%', 125, 25, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'suspended', ARRAY ['Carlotta Protocols'], 'FOLLOWGUIDELINES', '5', '$', 500, 48, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'suspended', ARRAY ['Carlotta ISP'], 'SIGNMEUP', '10', '$', 328, 28, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'suspended', ARRAY ['Carlotta Pumps'], '1FREEPUMP', '100', '$', 5, 4, '${startDate}', '${endDate}'),
  (${selectUserid(
    id
  )}, 'suspended', ARRAY ['Carlotta Assoc.'], 'ASSOCIATED', '100', '$', 10, 5, '${startDate}', '${endDate}');
  `;

const subValues = id => `
  (${selectUserid(
    id
  )}, 'active', 'betatester1@subskribble.com', 'Guilty Spark', '(555) 555-5555', 'Carlotta Prime', '${startDate}', null, 29.99),
  (${selectUserid(
    id
  )}, 'active', 'betatester2@subskribble.com', 'Sherry Waters', '(555) 555-5555', 'Carlotta Prime', '${startDate}', null, 29.99),
  (${selectUserid(
    id
  )}, 'active', 'betatester3@subskribble.com', 'Bob Aronssen', '(555) 555-5555', 'Carlotta Prime', '${startDate}', null, 29.99),
  (${selectUserid(
    id
  )}, 'active', 'betatester4@subskribble.com', 'Shaniqua Smith', '(555) 555-5555', 'Carlotta Prime', '${startDate}', null, 29.99),
  (${selectUserid(
    id
  )}, 'active', 'betatester5@subskribble.com', 'Tanya Ballschin', '(555) 555-5555', 'Carlotta Prime', '${startDate}', null, 29.99),
  (${selectUserid(
    id
  )}, 'active', 'betatester6@subskribble.com', 'Siemen Walker', '(555) 555-5555', 'Carlotta Prime', '${startDate}', null, 29.99),
  (${selectUserid(
    id
  )}, 'active', 'betatester7@subskribble.com', 'Jenny Tanks', '(555) 555-5555', 'Carlotta Prime', '${startDate}', null, 29.99),
  (${selectUserid(
    id
  )}, 'active', 'betatester8@subskribble.com', 'Amber Lalampas', '(555) 555-5555', 'Carlotta Prime', '${startDate}', null, 29.99),
  (${selectUserid(
    id
  )}, 'active', 'betatester9@subskribble.com', 'Kyle Teegue', '(555) 555-5555', 'Carlotta Prime', '${startDate}', null, 29.99),
  (${selectUserid(
    id
  )}, 'active', 'betatester10@subskribble.com', 'Gary Pilkinson', '(555) 555-5555', 'Carlotta Prime', '${startDate}', null, 29.99),
  (${selectUserid(
    id
  )}, 'active', 'betatester11@subskribble.com', 'Yasmin Rodrigues', '(555) 555-5555', 'Carlotta Prime', '${startDate}', null, 29.99),
  (${selectUserid(
    id
  )}, 'active', 'betatester12@subskribble.com', 'Adam Johnson', '(555) 555-5555', 'Carlotta Prime', '${startDate}', null, 29.99),
  (${selectUserid(
    id
  )}, 'inactive', 'betatester13@subskribble.com', 'Carl Sagan', '(555) 555-555', 'Carlotta Prime', '${startDate}', '${endDate}', 29.99),
  (${selectUserid(
    id
  )}, 'inactive', 'betatester14@subskribble.com', 'Mark Canelo', '(555) 555-555', 'Carlotta Prime', '${startDate}', '${endDate}', 29.99),
  (${selectUserid(
    id
  )}, 'suspended', 'betatester15@subskribble.com', 'Axle Root', '(555) 555-555', 'Carlotta Prime', '${startDate}', '${endDate}', 29.99),
  (${selectUserid(
    id
  )}, 'inactive', 'betatester16@subskribble.com', 'Adam Vicks', '(555) 555-555', 'Carlotta Prime', '${startDate}', '${endDate}', 29.99),
  (${selectUserid(
    id
  )}, 'inactive', 'betatester17@subskribble.com', 'Wes Walls', '(555) 555-555', 'Carlotta Prime', '${startDate}', '${endDate}', 29.99),
  (${selectUserid(
    id
  )}, 'suspended', 'betatester18@subskribble.com', 'Kelly Ullman', '(555) 555-555', 'Carlotta Prime', '${startDate}', '${endDate}', 29.99),
  (${selectUserid(
    id
  )}, 'inactive', 'betatester19@subskribble.com', 'Adam Oates', '(555) 555-555', 'Carlotta Prime', '${startDate}', '${endDate}', 29.99),
  (${selectUserid(
    id
  )}, 'suspended', 'betatester20@subskribble.com', 'Scott Parker', '(555) 555-555', 'Carlotta Prime', '${startDate}', '${endDate}', 29.99),
  (${selectUserid(
    id
  )}, 'suspended', 'betatester21@subskribble.com', 'Emily Loz', '(555) 555-555', 'Carlotta Prime', '${startDate}', '${endDate}', 29.99),
  (${selectUserid(
    id
  )}, 'inactive', 'betatester22@subskribble.com', 'Parker Posey', '(555) 555-555', 'Carlotta Prime', '${startDate}', '${endDate}', 29.99),
  (${selectUserid(
    id
  )}, 'suspended', 'betatester23@subskribble.com', 'Alisha Tallis', '(555) 555-555', 'Carlotta Prime', '${startDate}', '${endDate}', 29.99),
  (${selectUserid(
    id
  )}, 'suspended', 'betatester24@subskribble.com', 'Damien Smith', '(555) 555-5555', 'Carlotta Prime', '${startDate}', '${endDate}', 29.99);
  `;

const templateValues = id => `
  (${selectUserid(
    id
  )}, 'active', 'Partners Template', 'partners-template', 'betatester@subskribble.com', 'Test Template Subject', '<span>${fakeText()}</span>', ARRAY ['Carlotta Dealership', 'Carlotta Prime', 'Carlotta Sales', 'Carlotta Youtube']),
  (${selectUserid(
    id
  )}, 'active', 'Affiliates Template', 'affiliates-template', 'betatester@subskribble.com', 'Test Template Subject', '<span>${fakeText()}</span>', ARRAY ['Carlotta Prime', 'Carlotta Dealership', 'Carlotta Solar'] ),
  (${selectUserid(
    id
  )}, 'active', 'Subscriber Template', 'subscriber-template', 'betatester@subskribble.com', 'Test Template Subject', '<span>${fakeText()}</span>', ARRAY ['Carlotta Prime']),
  (${selectUserid(
    id
  )}, 'active', 'Employee Template', 'employee-template', 'betatester@subskribble.com', 'Test Template Subject', '<span>${fakeText()}</span>', ARRAY ['Carlotta Corp']),
  (${selectUserid(
    id
  )}, 'suspended', 'General Newsletter Template', 'general-newsletter-template', 'betatester@subskribble.com', 'Test Template Subject', '<span>${fakeText()}</span>', ARRAY ['Carlotta Cars Magazine', 'Carlotta Sports']),
  (${selectUserid(
    id
  )}, 'suspended', 'Flagships Template', 'flagships-template', 'betatester@subskribble.com', 'Test Template Subject', '<span>${fakeText()}</span>', ARRAY ['Carlotta Flashships'] ),
  (${selectUserid(
    id
  )}, 'suspended', 'Billing ISP Template', 'billing-isp-template', 'betatester@subskribble.com', 'Test Template Subject', '<span>${fakeText()}</span>', ARRAY ['Carlotta ISP']),
  (${selectUserid(
    id
  )}, 'suspended', 'Billing Cars Template', 'billing-cars-template', 'betatester@subskribble.com', 'Test Template Subject', '<span>${fakeText()}</span>', ARRAY ['Carlotta Cars Magazine']);
  `;

const transValues = id => `
  (${selectUserid(
    id
  )}, 'paid', 'Carlotta Prime', 'betatester2@subskribble.com', 'Sherry Waters', 'Paypal', 29.99, '${startDate}', null),
  (${selectUserid(
    id
  )}, 'due', 'Carlotta Prime', 'betatester22@subskribble.com', 'Parker Posey', '', 29.99, null, null),
  (${selectUserid(
    id
  )}, 'paid', 'Carlotta Prime', 'betatester3@subskribble.com', 'Bob Aronssen', 'Venmo', 29.99, '${startDate}', null),
  (${selectUserid(
    id
  )}, 'paid', 'Carlotta Prime', 'betatester4@subskribble.com', 'Shaniqua Smith', 'Stripe', 29.99, '${startDate}', null),
  (${selectUserid(
    id
  )}, 'paid', 'Carlotta Prime', 'betatester5@subskribble.com', 'Tanya Ballschin', 'Stripe', 29.99,'${startDate}', null),
  (${selectUserid(
    id
  )}, 'due', 'Carlotta Prime', 'betatester19@subskribble.com', 'Adam Oates', '', 29.99, null, null),
  (${selectUserid(
    id
  )}, 'due', 'Carlotta Prime', 'betatester17@subskribble.com', 'Wes Walls', '', 29.99, null, null),
  (${selectUserid(
    id
  )}, 'paid', 'Carlotta Prime', 'betatester6@subskribble.com', 'Siemen Walker', 'Visa Checkout', 29.99,'${startDate}', null),
  (${selectUserid(
    id
  )}, 'paid', 'Carlotta Prime', 'betatester7@subskribble.com', 'Jenny Tanks', 'Stripe', 29.99,'${startDate}', null),
  (${selectUserid(
    id
  )}, 'due', 'Carlotta Prime', 'betatester16@subskribble.com', 'Adam Vicks', '', 29.99, null, null),
  (${selectUserid(
    id
  )}, 'due', 'Carlotta Prime', 'betatester14@subskribble.com', 'Mark Canelo', '', 29.99, null, null),
  (${selectUserid(
    id
  )}, 'paid', 'Carlotta Prime', 'betatester8@subskribble.com', 'Amber Lalampas', 'Paypal', 29.99,'${startDate}', null),
  (${selectUserid(
    id
  )}, 'refund', 'Carlotta Prime', 'betatester14@subskribble.com', 'Mark Canelo', 'Paypal', 29.99, null, '${startDate}'),
  (${selectUserid(
    id
  )}, 'refund', 'Carlotta Prime', 'betatester15@subskribble.com', 'Axle Root', 'Stripe', 29.99, null, '${startDate}'),
  (${selectUserid(
    id
  )}, 'refund', 'Carlotta Prime', 'betatester10@subskribble.com', 'Gary Pilkinson', 'Venmo', 29.99, null, '${startDate}'),
  (${selectUserid(
    id
  )}, 'credit', 'Carlotta Prime', 'betatester18@subskribble.com', 'Kelly Ullman', '', 29.99, null, '${startDate}'),
  (${selectUserid(
    id
  )}, 'refund', 'Carlotta Prime', 'betatester11@subskribble.com', 'Yasmin Rodrigues', 'Stripe', 29.99, null, '${startDate}'),
  (${selectUserid(
    id
  )}, 'credit', 'Carlotta Prime', 'betatester19@subskribble.com', 'Adam Oates', '', 29.99, null, '${startDate}'),
  (${selectUserid(
    id
  )}, 'credit', 'Carlotta Prime', 'betatester17@subskribble.com', 'Wes Walls', '', 29.99, null, '${startDate}'),
  (${selectUserid(
    id
  )}, 'credit', 'Carlotta Prime', 'betatester9@subskribble.com', 'Kyle Teegue', '', 29.99, null, '${startDate}'),
  (${selectUserid(
    id
  )}, 'refund', 'Carlotta Prime', 'betatester23@subskribble.com', 'Alisha Tallis', 'Stripe', 29.99, null, '${startDate}'),
  (${selectUserid(
    id
  )}, 'credit', 'Carlotta Prime', 'betatester20@subskribble.com', 'Scott Parker', '', 29.99, null, '${startDate}'),
  (${selectUserid(
    id
  )}, 'refund', 'Carlotta Prime', 'betatester21@subskribble.com', 'Emily Voz', 'Visa Checkout', 29.99, null, '${startDate}'),
  (${selectUserid(
    id
  )}, 'refund', 'Carlotta Prime', 'betatester13@subskribble.com', 'Carl Sagan', 'Paypal', 29.99, null, '${startDate}');
  `;

const noteValues = id => `
  (${selectUserid(
    id
  )}, 'people_outline', 'Sherry Waters has been added to the Carlotta Prime plan.', false, '${startDate}'),
  (${selectUserid(
    id
  )}, 'payment', 'Sherry Waters has been charged $107.49 for the Carlotta Prime membership!', false, '${startDate}'),
  (${selectUserid(
    id
  )}, 'people_outline', 'Carl Sagan has cancelled his membership to the Carlotta Twitch plan.', true, '${startDate}'),
  (${selectUserid(
    id
  )}, 'payment', 'Parker Posey is late to pay $29.99 for the Carlotta Prime plan.', true, '${startDate}'),
  (${selectUserid(
    id
  )}, 'payment', 'Bob Aronssen has been charged $75.24 for the Carlotta Prime membership!', true, '${startDate}'),
  (${selectUserid(
    id
  )}, 'people_outline', 'Axle Root has been suspended due to non-payment.', true, '${startDate}'),
  (${selectUserid(
    id
  )}, 'payment', 'Shaniqua Smith has been charged $107.49 for the Carlotta Prime membership!', false, '${startDate}'),
  (${selectUserid(
    id
  )}, 'people_outline', 'Adam Vicks has parked his membership and is now an inactive subscriber.', false, '${startDate}'),
  (${selectUserid(
    id
  )}, 'new_releases', 'A new promotional: FREETRIAL, has been added to the following plan: Carlotta Prime.', false, '${startDate}'),
  (${selectUserid(
    id
  )}, 'new_releases', 'The following promotional: FIRST10KACCOUNTS, has been succesfully edited and updated.', false, '${startDate}');
  `;

const messageValues = id => `
  (${selectUserid(
    id
  )}, 'Partners Template', 'betatester@subskribble.com', 'Partners Template Subject', '${startDate}', ARRAY ['Carlotta Dealership', 'Carlotta Prime', 'Carlotta Sales', 'Carlotta Youtube']),
  (${selectUserid(
    id
  )}, 'Affiliates Template', 'betatester@subskribble.com', 'Affiliates Template Subject', '${startDate}', ARRAY ['Carlotta Prime', 'Carlotta Dealership', 'Carlotta Solar']),
  (${selectUserid(
    id
  )}, 'Subscriber Template', 'betatester@subskribble.com', 'Subscriber Template Subject', '${startDate}', ARRAY ['Carlotta Prime']),
  (${selectUserid(
    id
  )}, 'Employee Template', 'betatester@subskribble.com', 'Employee Template Subject', '${startDate}', ARRAY ['Carlotta Corp']),
  (${selectUserid(
    id
  )}, 'General Newsletter Template', 'betatester@subskribble.com', 'General Newsletter Template Subject', '${startDate}', ARRAY ['Carlotta Cars Magazine', 'Carlotta Sports']);
  `;

const seedDB = async () => {
  try {
    await db.task("seed-database", async dbtask => {
      // create DB tables
      await dbtask.none(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            CREATE TABLE users ${userTableOptions};
            CREATE TABLE plans ${planTableOptions};
            CREATE TABLE promotionals ${promoTableOptions};
            CREATE TABLE notifications ${noteTableOptions};
            CREATE TABLE subscribers ${subTableOptions};
            CREATE TABLE templates ${templateTableOptions};
            CREATE TABLE transactions ${transTableOptions};
            CREATE TABLE messages ${messageTableOptions};
            CREATE TABLE feedback ${feedbackTableOptions};
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

      // inset fake data into created tables
      await dbtask.none(`
            INSERT INTO plans ${planProperties} VALUES ${planValues(id)};
            INSERT INTO notifications ${noteProperties} VALUES ${noteValues(
        id
      )};
            INSERT INTO promotionals ${promoProperties} VALUES ${promoValues(
        id
      )};
            INSERT INTO subscribers ${subProperties} VALUES ${subValues(id)};
            INSERT INTO templates ${templateProperties} VALUES ${templateValues(
        id
      )};
            INSERT INTO transactions ${transProperties} VALUES ${transValues(
        id
      )};
            INSERT INTO messages ${messageProperties} VALUES ${messageValues(
        id
      )};
            `);

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
  } finally {
    if (SEED) {
      process.exit(0);
    }
  }
};

if (SEED) seedDB();

module.exports = seedDB;

/* eslint-enable */
