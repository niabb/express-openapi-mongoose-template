require('dotenv').config();

const app = require('express')();
const bodyParser = require('body-parser');
const fs = require('fs');
const openapi = require('express-openapi');
const bearerToken = require('express-bearer-token');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');

const logger = require('./lib/logger');
const io = require('./lib/socketIo');
const fileUpload = require('./lib/fileUpload');

module.exports = app;

const mongoose = require('./lib/mongoose');

app.use(bearerToken());

app.use(cors());

/**
 * This is the error middleware provided to the express-openapi module, to handle schema validation
 * error, according to the Open API Specification definition file.
 * It is mandatory to provide the 4 arguments, hence the eslint exception
 * @param  {Error} err the validation error
 * @param  {Object} req the Express request object
 * @param  {Object} res the Express response object
 * @param  {Function} next the function used to continue to the next middleware
 */
// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  const response = { error: 'Request validation error.', details: [] };
  // This should hand generic errors thrown in a Error object.
  if (err.message) {
    response.details.push(err.message);
  }
  // This should handle schema validation errors
  if (err.errors) {
    response.details.push(...err.errors.map((e) => `${e.path} in ${e.location} ${e.message}`));
  }
  res.status(400);
  res.json(response);
}
/**
 * This is the express-openapi security middleware which verifies the bearer token provided.
 * If the token provided is valid, the decoded token is exposed in the route handlers with the
 * req.decodedToken property.
 * @param  {Object} req the Express request object
 * @returns a rejected promise with an Error in case of incorrect token,
 * a resolved promise otherwise
 */
function bearerAuth(req /* , scopes, definition */) {
  if (req.token) {
    // console.log(req.token);
    try {
      const decoded = jwt.verify(req.token, process.env.JWT_SECRET);
      // logger.debug(decoded);
      req.decodedToken = decoded;
      return Promise.resolve(decoded);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  return Promise.reject(new Error('You must provide a token.'));
}
app.bearerAuth = bearerAuth;
const apiDoc = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, 'api-doc.yml'), 'utf8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDoc));

openapi.initialize({
  apiDoc,
  app,
  paths: path.resolve(__dirname, 'routes'),
  securityHandlers: {
    bearerAuth,
  },
  errorMiddleware,
  promiseMode: true,
  consumesMiddleware: {
    'application/json': bodyParser.json(),
    'text/text': bodyParser.text(),
    'multipart/form-data': fileUpload.fileMiddleware,
  },
});

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  res.status(err.status).json(err);
}

app.use(errorHandler);

const port = parseInt(process.env.PORT, 10);
app.server = app.listen(port);
logger.info(`Open API started in ${process.env.NODE_ENV} mode, listening on port ${port}.`);
io.init(app.server, app.bearerAuth);

function closeServer() {
  logger.info('Gracefully shutting down.');
  mongoose.disconnect();
  app.server.close(() => {
    logger.info('HTTP server closed.');
    setTimeout(process.exit, 2000);
  });
}

process.on('SIGINT', () => {
  logger.info('Received SIGINT.');
  closeServer();
});
process.on('SIGTERM', () => {
  logger.info('Received SIGTERM.');
  closeServer();
});
