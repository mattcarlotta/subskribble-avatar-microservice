import { fetchOne } from "controllers/avatars";
import { mockRequest, mockResponse, signupUser } from "../__mocks__/helpers";

describe("FetchOne Controller", () => {
  let user;
  beforeAll(async () => {
    user = await signupUser(
      "betatesterfetchone@test.com",
      "Fetch One Avatar LLC",
      true,
    );
  });

  let res;
  beforeEach(() => {
    res = mockResponse();
  });

  it("handles no avatar created yet requests", async () => {
    const req = mockRequest({ id: "008b2cbe-5bb6-11e9-8d9f-0ff6b40024c3" });

    await fetchOne(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(null);
  });

  it("handles valid fetchOne requests", async () => {
    const req = mockRequest(user);

    await fetchOne(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      avatarurl: user.avatarurl,
    });
    expect(req.session).toEqual({
      ...user,
    });
  });
});
