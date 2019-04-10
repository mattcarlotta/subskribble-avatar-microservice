// const { badCredentials } = require('authErrors');

describe('Create Avatar', () => {
  it('should handle invalid create avatar requests', async () => {
    // not logged in
    // await app()
    //   .post("/api/avatar/create")
    //   .then(res => {
    //     expect(res.statusCode).toEqual(401);
    //     expect(res.body.err).toEqual(badCredentials);
    //   });
    // logged in but missing create params
    // await app()
    //   .post("/api/avatar/create")
    //   .set("Cookie", cookie)
    //   .then(res => {
    //     expect(res.statusCode).toEqual(400);
    //     expect(res.body.err).toEqual(missingCreationParams);
    //   });
  });

  it('should handle valid create avatar requests', async () => {
    // await app()
    //   .post("/api/avatar/create")
    //   .send({
    //     amount: 0.99,
    //     billevery: "Monthly",
    //     planname: "Carlotta Test Plan",
    //     description: "Carlotta Subscription"
    //   })
    //   .set("Cookie", cookie)
    //   .then(res => {
    //     expect(res.statusCode).toEqual(201);
    //   });
  });
});
