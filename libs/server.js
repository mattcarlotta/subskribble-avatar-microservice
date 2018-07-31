const path    = require('path');
const express = require('express');

module.exports = app => {
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
