import {
  create,
  deleteOne,
  fetchOne,
  removeAccount,
  updateOne,
} from 'controllers/avatars';
import { requireAuth, saveImage } from 'strategies';

export default (app) => {
  app.get('/api/avatar/current-user', requireAuth, fetchOne);
  app.post('/api/avatar/create', requireAuth, saveImage, create);
  app.put('/api/avatar/update', requireAuth, saveImage, updateOne);
  app.delete('/api/avatar/delete', requireAuth, deleteOne);
  app.delete('/api/avatar/delete-account', removeAccount);
};
