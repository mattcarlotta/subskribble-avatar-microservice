import app from 'utils/setup';
import { deleteOne } from 'controllers/avatars';
import { requireAuth } from 'strategies';

jest.mock('controllers/avatars', () => ({
  ...require.requireActual('controllers/avatars'),
  deleteOne: jest.fn(done => done()),
}));

jest.mock('services/strategies', () => ({
  ...require.requireActual('services/strategies'),
  requireAuth: jest.fn((req, res, done) => done()),
}));

describe('Delete An Avatar Route', () => {
  it('routes requests to the deleteOne controller', async () => {
    await app()
      .delete('/api/avatar/delete')
      .then(() => {
        expect(requireAuth).toHaveBeenCalledTimes(1);
        expect(deleteOne).toHaveBeenCalledTimes(1);
      });
  });
});
