const app = require('express')();
const bodyParser = require('body-parser');
const fs = require('fs');
const openapi = require('express-openapi');
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

openapi.initialize({
  apiDoc: fs.readFileSync(path.resolve(__dirname, 'api-doc.yml'), 'utf8'),
  app,
  paths: path.resolve(__dirname, 'routes'),
  operations: {},
});

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  res.status(err.status).json(err);
}

app.use(errorHandler);

module.exports = app;

const port = parseInt(process.argv[2], 10);
if (port) {
  app.listen(port);
}
