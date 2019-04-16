import app from 'utils/setup';
import { fetchOne } from 'controllers/avatars';
import { requireAuth } from 'strategies';

jest.mock('controllers/avatars', () => ({
  ...require.requireActual('controllers/avatars'),
  fetchOne: jest.fn(done => done()),
}));

jest.mock('services/strategies', () => ({
  ...require.requireActual('services/strategies'),
  requireAuth: jest.fn((req, res, done) => done()),
}));

describe('Fetch An Avatar Route', () => {
  it('routes requests to the fetchOne controller', async () => {
    await app()
      .get('/api/avatar/current-user')
      .then(() => {
        expect(requireAuth).toHaveBeenCalledTimes(1);
        expect(fetchOne).toHaveBeenCalledTimes(1);
      });
  });
});
