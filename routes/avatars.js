module.exports = app => {
	const { avatars: { create, getOne, deleteOne, updateOne } } = app.controllers;
	const { db, query: { getCurrentAvatar, deleteAvatar, updateAvatar } } = app.database;
	const { requireAuth } = app.services.strategies;
	const { sendError } = app.shared.helpers;
	const saveImage = app.services.sharp;

	app.post('/api/avatar/create', requireAuth, saveImage, create);
	app.get('/api/avatar/fetch-user-avatar', requireAuth, getOne);
	app.delete('/api/avatar/delete?', requireAuth, deleteOne);
	app.put('/api/avatar/update?', requireAuth, updateOne);
}
