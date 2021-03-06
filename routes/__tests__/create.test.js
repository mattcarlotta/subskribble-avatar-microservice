import app from 'utils/setup';
import { create } from 'controllers/avatars';
import { requireAuth, saveImage } from 'strategies';

jest.mock('controllers/avatars', () => ({
  ...require.requireActual('controllers/avatars'),
  create: jest.fn(done => done()),
}));

jest.mock('services/strategies', () => ({
  requireAuth: jest.fn((req, res, done) => done()),
  saveImage: jest.fn((req, res, done) => done()),
}));

describe('Create Avatars Route', () => {
  it('routes requests to the create controller', async () => {
    await app()
      .post('/api/avatar/create')
      .then(() => {
        expect(requireAuth).toHaveBeenCalledTimes(1);
        expect(saveImage).toHaveBeenCalledTimes(1);
        expect(create).toHaveBeenCalledTimes(1);
      });
  });
});
