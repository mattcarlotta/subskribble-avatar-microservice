module.exports = app => {
	const { avatars: { create, deleteOne, updateOne } } = app.controllers;
	const { requireAuth } = app.services.strategies;

	app.delete('/api/avatar/create', requireAuth, create);
	app.delete('/api/avatar/delete?', requireAuth, deleteOne);
	app.put('/api/avatar/update?', requireAuth, updateOne);
}
