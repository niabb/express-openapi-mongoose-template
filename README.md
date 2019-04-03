# express-openapi-mongoose-template
Template for quick production ready REST API, based on the OAS 3 protocol.
This template uses:
* winston for logging
* mongoose as MongoDB ORM
* JSON web token for authentication

For the development:
* Linting with eslint and Airbnb rule
* Mocha/chai/should for unit testing

When running, the API definition file is served on /api-docs

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