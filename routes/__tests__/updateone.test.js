import app from 'utils/setup';
import { updateOne } from 'controllers/avatars';
import { requireAuth, saveImage } from 'strategies';

jest.mock('controllers/avatars', () => ({
  ...require.requireActual('controllers/avatars'),
  updateOne: jest.fn(done => done()),
}));

jest.mock('services/strategies', () => ({
  requireAuth: jest.fn((req, res, done) => done()),
  saveImage: jest.fn((req, res, done) => done()),
}));

describe('Update An Avatar Route', () => {
  it('routes requests to the updateOne controller', async () => {
    await app()
      .put('/api/avatar/update')
      .then(() => {
        expect(requireAuth).toHaveBeenCalledTimes(1);
        expect(saveImage).toHaveBeenCalledTimes(1);
        expect(updateOne).toHaveBeenCalledTimes(1);
      });
  });
});
