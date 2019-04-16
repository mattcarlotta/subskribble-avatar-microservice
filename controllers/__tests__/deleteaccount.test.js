import fs from "fs";
import { removeAccount } from "controllers/avatars";
import { missingDeleteParams, unableToLocateAvatar } from "authErrors";
import { createRandomToken } from "helpers";
import { mockRequest, mockResponse, signupUser } from "../__mocks__/helpers";

const emptybody = {
  token: "",
  userid: "",
};

describe("RemoveAccount Controller", () => {
  let user;
  beforeAll(async () => {
    user = await signupUser(
      "betatesterdeleteaccount@test.com",
      "Delete Account Avatar LLC",
      true,
    );
  });

  let res;
  beforeEach(() => {
    res = mockResponse();
  });

  it("handles empty body requests", async () => {
    const req = mockRequest(null, emptybody);

    await removeAccount(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ err: missingDeleteParams });
  });

  it("invalid user id requests", async () => {
    const req = mockRequest(null, {
      token: user.token,
      userid: "008b2cbe-5bb6-11e9-8d9f-1ee6b40024c4",
    });

    await removeAccount(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ err: unableToLocateAvatar });
  });

  it("invalid token requests", async () => {
    const req = mockRequest(null, {
      token: `${createRandomToken}`,
      userid: user.id,
    });

    await removeAccount(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ err: unableToLocateAvatar });
  });

  it("handles valid removeAccount requests", async () => {
    const req = mockRequest(null, {
      token: user.token,
      userid: user.id,
    });

    await removeAccount(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(fs.unlink).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(null);
    expect(req.session).toBeNull();
  });
});
