const fs = require('fs');
const sharp = require('sharp');
const { createRandomString, sendError } = require('helpers');

module.exports = async (req, res, next) => {
  const randomString = createRandomString();

  if (req.err || !req.file) {
    return sendError(
      req.err || 'Unable to locate the requested file to be saved',
      res,
      next,
    );
  }

  const filename = `${Date.now()}-${randomString}-${req.file.originalname}`;
  const filepath = `uploads/${filename}`;

  const setFile = () => {
    req.file.path = filepath;
    return next();
  };

  /\.(gif|bmp)$/i.test(req.file.originalname)
    ? fs.writeFile(filepath, req.file.buffer, (err) => {
      if (err) return sendError('There was a problem saving the image.', res, next);
      setFile();
    })
    : sharp(req.file.buffer)
      .resize(256, 256)
      .max()
      .withoutEnlargement()
      .toFile(filepath)
      .then(() => setFile());
};
