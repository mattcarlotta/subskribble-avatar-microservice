import { updateOne } from "controllers/avatars";
import { unableToLocateAvatar, unableToLocateFile } from "authErrors";
import { createRandomString } from "helpers";
import config from "env";
import { mockRequest, mockResponse, signupUser } from "../__mocks__/helpers";

const env = process.env.NODE_ENV;
const { apiURL } = config[env];

const randomString = createRandomString();
const newfilepath = `uploads/${randomString}-fakeimage.png`;
const newfilelocation = `${apiURL}/${newfilepath}`;

describe("UpdateOne Controller", () => {
  let user;
  beforeAll(async () => {
    user = await signupUser(
      "betatesterupdateavatar@test.com",
      "Update Account Avatar LLC",
      true,
    );
  });

  let res;
  beforeEach(() => {
    res = mockResponse();
  });

  it("handles empty file path requests", async () => {
    const req = mockRequest(null, null, null, null, { path: "" });

    await updateOne(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ err: unableToLocateFile });
  });

  it("handles invalid session id requests", async () => {
    const req = mockRequest(
      { id: "008b2cbe-5bb6-11e9-8d9f-1ee6b40024c4" },
      null,
      null,
      null,
      { path: "fake/path/test.png" },
    );

    await updateOne(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ err: unableToLocateAvatar });
  });

  it("handles valid update avatar requests", async () => {
    const req = mockRequest(user, null, null, null, { path: newfilepath });

    await updateOne(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ avatarurl: newfilelocation });
    expect(req.session).toEqual({
      ...user,
      avatarurl: newfilelocation,
    });
  });
});
