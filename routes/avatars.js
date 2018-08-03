module.exports = app => {
	const { avatars: { create, getOne, deleteOne, updateOne } } = app.controllers;
	const { requireAuth } = app.services.strategies;
	const saveImage = app.services.sharp;

	app.post('/api/avatar/create', requireAuth, saveImage, create);
	app.put('/api/avatar/update', requireAuth, saveImage, updateOne);
	app.delete('/api/avatar/delete', requireAuth, deleteOne);
}
