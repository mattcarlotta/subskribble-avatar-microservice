const fs = require('fs');
const sharp = require('sharp');
const { createRandomString, sendError } = require('helpers');
const { unableToProcessFile } = require('authErrors');

module.exports = async (req, res, next) => {
  const randomString = createRandomString();

  if (req.err || !req.file) {
    return sendError(req.err || unableToProcessFile, res, next);
  }

  const filename = `${Date.now()}-${randomString}-${req.file.originalname}`;
  const filepath = `uploads/${filename}`;

  const setFile = () => {
    req.file.path = filepath;
    return next();
  };

  /\.(gif|bmp)$/i.test(req.file.originalname)
    ? fs.writeFile(filepath, req.file.buffer, (err) => {
      if (err) return sendError(unableToProcessFile, res, next);
      setFile();
    })
    : sharp(req.file.buffer)
      .resize(256, 256)
      .max()
      .withoutEnlargement()
      .toFile(filepath)
      .then(() => setFile());
};
