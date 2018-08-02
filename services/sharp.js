module.exports = app => async (req, res, next) => {
  const { sendError } = app.shared.helpers;
  const fs = app.get('fs');
  const sharp = app.get('sharp');

  if (req.err) return sendError(req.err, res, next);
  if (!req.file) return sendError('Unable to locate the requested file to be saved', res, next);

  const filename = Date.now() + '-' + req.file.originalname;
  const filepath = `uploads/${filename}`;

  if (/\.(gif|bmp)$/i.test(req.file.originalname)) {
    fs.writeFile(filepath, req.file.buffer, (err) => {
      if (err) return sendError('There was a problem saving the image.', res, next);
			req.file.path = filepath;
      return next();
    })
  } else {
    sharp(req.file.buffer)
    .resize(256, 256)
    .max()
    .withoutEnlargement()
    .toFile(filepath)
    .then(() => {
      req.file.path = filepath;
      return next();
    })
  }
}
