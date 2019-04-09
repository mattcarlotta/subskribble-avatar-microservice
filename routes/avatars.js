const {
  create,
  deleteOne,
  fetchOne,
  removeAccount,
  updateOne,
} = require('controllers/avatars');
const requireAuth = require('strategies/requireAuth');
const saveImage = require('strategies/sharp');

module.exports = (app) => {
  app.get('/api/avatar/current-user', requireAuth, fetchOne);
  app.post('/api/avatar/create', requireAuth, saveImage, create);
  app.put('/api/avatar/update', requireAuth, saveImage, updateOne);
  app.delete('/api/avatar/delete', requireAuth, deleteOne);
  app.delete('/api/avatar/delete-account', removeAccount);
};
