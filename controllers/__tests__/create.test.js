import { create } from "controllers/avatars";
import { unableToLocateFile } from "authErrors";
import { createRandomString } from "helpers";
import config from "env";
import { mockRequest, mockResponse, signupUser } from "../__mocks__/helpers";

const env = process.env.NODE_ENV;
const { apiURL } = config[env];

const randomString = createRandomString();

const emptyfile = {
  path: "",
};

const savedfile = {
  path: `uploads/${Date.now()}-${randomString}-testavatar.png`,
};

describe("Create Controller", () => {
  let user;
  beforeAll(async () => {
    user = await signupUser(
      "betatestercreate@subskribble.com",
      "Create Avatar LLC",
    );
  });

  let res;
  beforeEach(() => {
    res = mockResponse();
  });

  it("handles empty file responses", async () => {
    const req = mockRequest(null, null, null, null, emptyfile);

    await create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ err: unableToLocateFile });
  });

  it("handles valid create avatar responses", async () => {
    const req = mockRequest(user, null, null, null, savedfile);
    const avatarurl = `${apiURL}/${savedfile.path}`;

    await create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ avatarurl });
    expect(req.session).toEqual({
      ...user,
      avatarurl,
    });
  });
});
