import app from 'utils/setup';
import { removeAccount } from 'controllers/avatars';

jest.mock('controllers/avatars', () => ({
  ...require.requireActual('controllers/avatars'),
  removeAccount: jest.fn(done => done()),
}));

describe('Delete Account Route', () => {
  it('routes requests to the removeAccount controller', async () => {
    await app()
      .delete('/api/avatar/delete-account')
      .then(() => {
        expect(removeAccount).toHaveBeenCalledTimes(1);
      });
  });
});
