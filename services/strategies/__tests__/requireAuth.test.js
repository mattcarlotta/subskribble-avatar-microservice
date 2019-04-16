import { requireAuth } from "strategies";
import { badCredentials } from "authErrors";
import {
  mockRequest,
  mockResponse,
  signupUser,
} from "../__mocks__/strategyhelpers";

const next = jest.fn();

describe("Require Authentication Middleware", () => {
  let user;
  beforeAll(async () => {
    user = await signupUser(
      "betatesterrequireauth@test.com",
      "Require Auth Inc",
    );
  });

  let res;
  beforeEach(() => {
    res = mockResponse();
  });

  it("handles missing login sessions", async (done) => {
    const req = mockRequest({});

    await requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ err: badCredentials });
    done();
  });

  it("handles valid login sessions", async (done) => {
    const req = mockRequest(user);

    await requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    done();
  });
});
