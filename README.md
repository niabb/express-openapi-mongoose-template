# express-openapi-mongoose-template
Template for quickly creating a production ready REST API, compliant to the [OAS 3 protocol](https://swagger.io/specification/).

This template uses:
* winston for logging
* mongoose as MongoDB ORM
* JSON web token for authentication
* Socket.io for websocket communication.
* Swagger UI for the API documentation

For the development:
* Linting with eslint and Airbnb rule
* Mocha/chai/should for unit testing

When running, the API definition file is served on /api-docs.

## How to clone and keep up to date
Clone:
```
git clone https://github.com/niabb/express-openapi-mongoose-template.git newRepo
cd newRepo
git remote set-url origin https://github.com/userName/newRepo
git remote add upstream https://github.com/niabb/express-openapi-mongoose-template
git push origin master
git push --all
```
Keep up to date:
```
git pull upstream master
```

## How to run the app
Create the configuration file: `cp config.default.json config.json`
and edit it to match your environment.
Then start the app: `npm run start`

## Development
Run the app in development mode with nodemon: `npm run watch`
Run ESLint: `npm run lint`
Play unit tests: `npm run test`