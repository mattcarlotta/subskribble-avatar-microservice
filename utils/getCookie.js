const app = require('./setup');

module.exports = async (
  suppliedEmail = 'betatester@subskribble.com',
  suppliedPassword = 'password123',
) => {
  let cookie;
  await app()
    .post('/api/signin')
    .send({
      email: suppliedEmail,
      password: suppliedPassword,
    })
    .expect(201)
    .then((res) => {
      cookie = res.header['set-cookie'];
    });
  return cookie;
};
