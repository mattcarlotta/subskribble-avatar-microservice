import fs from "fs";
import { deleteOne } from "controllers/avatars";
import { unableToLocateAvatar } from "authErrors";
import { mockRequest, mockResponse, signupUser } from "../__mocks__/helpers";

describe("DeleteOne Controller", () => {
  let user;
  beforeAll(async () => {
    user = await signupUser(
      "betatesterdelete@test.com",
      "Delete Avatar LLC",
      true,
    );
  });

  let res;
  beforeEach(() => {
    res = mockResponse();
  });

  it("handles invalid session ids", async () => {
    const req = mockRequest({ id: "008b2cbe-5bb6-11e9-8d9f-0ff6b40024c3" });

    await deleteOne(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ err: unableToLocateAvatar });
  });

  it("handles valid deleteone requests", async () => {
    const req = mockRequest(user);

    await deleteOne(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(fs.unlink).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: "Succesfully removed your current avatar.",
    });
    expect(req.session).toEqual({
      ...user,
      avatarurl: undefined,
    });
  });
});
