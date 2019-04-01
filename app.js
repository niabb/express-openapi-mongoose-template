const app = require('express')();
const bodyParser = require('body-parser');
const fs = require('fs');
const openapi = require('express-openapi');
const bearerToken = require('express-bearer-token');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const config = require('./config');
const logger = require('./logger');

require('./mongo.js');

app.use(bearerToken());

app.use(cors());
app.use(bodyParser.json());

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
    response.details.push(...err.errors.map(e => `${e.location} ${e.message}`));
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
      const decoded = jwt.verify(req.token, config.jwt.secret);
      logger.debug(decoded);
      req.decodedToken = decoded;
      return Promise.resolve(decoded);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  return Promise.reject(new Error('You must provide a token.'));
}

openapi.initialize({
  apiDoc: fs.readFileSync(path.resolve(__dirname, 'api-doc.yml'), 'utf8'),
  app,
  paths: path.resolve(__dirname, 'routes'),
  securityHandlers: {
    bearerAuth,
  },
  errorMiddleware,
  promiseMode: true,
});

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  res.status(err.status).json(err);
}

app.use(errorHandler);

module.exports = app;

app.listen(config.port);
logger.info(`Open API started in ${process.env.NODE_ENV} mode, listening on port ${config.port}.`);
