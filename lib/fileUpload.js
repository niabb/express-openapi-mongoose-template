const multer = require('multer');

function fileMiddleware(req, res, next) {
  multer().any()(req, res, (err) => {
    if (err) return next(err);
    req.files.forEach((f) => {
      req.body[f.fieldname] = '';
    });
    return next();
  });
}

module.exports = { fileMiddleware };
