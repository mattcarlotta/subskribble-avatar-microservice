module.exports = app => {
	const express = app.get("express");
	const path = app.get("path");
	const PORT = app.get("port");

	//============================================================//
	// EXPRESS SERVE AVATAR IMAGES
	//============================================================//
	app.use('/uploads', express.static('uploads'));

	//============================================================//
	/* CREATE EXPRESS SERVER */
	//============================================================//
	app.listen(PORT);
};
