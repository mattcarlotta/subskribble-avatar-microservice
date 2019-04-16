/* eslint-disable */
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import config from "env";

const env = process.env.NODE_ENV;
const inTesting = env === "test";

if (!inTesting) {
  const currentENV = () => {
    const envirnoment = config[env];
    const keys = Object.keys(envirnoment);
    const values = Object.values(envirnoment);

    let variables = "";
    for (let i = 0; i < keys.length; i += 1) {
      variables += `\x1b[33m• ${keys[i].toUpperCase()}\x1b[0m: ${
        values[i]
      } \n `;
    }
    return variables;
  };
  // eslint-disable-next-line no-console
  console.log(
    `\n[ \x1b[1m${env.toUpperCase()} ENVIRONMENT\x1b[0m ]\n ${currentENV()}`
  );

  if (env !== "development") {
    // eslint-disable-next-line no-console
    console.log(
      `\n\x1b[1mYour application is running on: ${config[env].portal}\x1b[0m`
    );
  }
}

//= ===========================================================//
/* APP MIDDLEWARE */
//= ===========================================================//
export default app => {
  app.use(cors({ credentials: true, origin: config[env].portal })); // allows receiving of cookies from front-end
  if (!inTesting) app.use(morgan("tiny")); // logging framework
  app.use(
    multer({
      limits: {
        fileSize: 10240000,
        files: 1,
        fields: 1
      },
      fileFilter: (req, file, next) => {
        if (!/\.(jpe?g|png|gif|bmp)$/i.test(file.originalname)) {
          req.err = "That file extension is not accepted!";
          next(null, false);
        }
        next(null, true);
      }
    }).single("file")
  );
  app.use(bodyParser.json()); // parses header requests (req.body)
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: true })); // allows objects and arrays to be URL-encoded
  app.use(cookieParser()); // parses header cookies
  app.use(
    cookieSession({
      // sets up a cookie session as req.session ==> set in passport local login strategy
      name: "Authorization",
      maxAge: 30 * 24 * 60 * 60 * 1000, // expire after 30 days, 24hr/60m/60s/1000ms
      keys: [config[env].cookieKey] // unique cookie key to encrypt/decrypt
    })
  );
  app.set("json spaces", 2); // sets JSON spaces for clarity
};
/* eslint enable */
