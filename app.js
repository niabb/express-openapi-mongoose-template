const app = require('express')();
const bodyParser = require('body-parser');
const fs = require('fs');
const openapi = require('express-openapi');
const path = require('path');
const cors = require('cors');

const config = require('./config');
const logger = require('./logger');

require('./mongo.js');

app.use(cors());
app.use(bodyParser.json());

openapi.initialize({
  apiDoc: fs.readFileSync(path.resolve(__dirname, 'api-doc.yml'), 'utf8'),
  app,
  paths: path.resolve(__dirname, 'routes'),
  promiseMode: true,
});

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  res.status(err.status).json(err);
}

app.use(errorHandler);

module.exports = app;

app.listen(config.port);
logger.info(`Open API started in ${process.env.NODE_ENV} mode, listening on port ${config.port}.`);
