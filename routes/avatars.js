module.exports = app => {
	const { avatars: { create, deleteOne, fetchOne, removeAccount, updateOne } } = app.controllers;
	const { requireAuth } = app.services.strategies;
	const saveImage = app.services.sharp;

	app.get(`/api/avatar/current-user`, requireAuth, fetchOne);
	app.post(`/api/avatar/create`, requireAuth, saveImage, create);
	app.put(`/api/avatar/update`, requireAuth, saveImage, updateOne);
	app.delete(`/api/avatar/delete`, requireAuth, deleteOne);
	app.delete(`/api/avatar/delete-account`, removeAccount);
}
