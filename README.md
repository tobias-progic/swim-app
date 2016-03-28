# swim
**Note: This is work in progress**
A small `node.js` based promotional back-end project to support an open water swimclub with timing of swimmers at a competition.
This git contains the server and single-page app. There is also an Android&trade; app involved with this project in another git, TBD.

## Components
* koa.js
* react.js
* mysql
* winston
* es2015
* node.js (tested with v4.2.6)
* webpack


## Running the server
The server requires a bunch of environment variables

* `PORT` - HTTP port (default: 3000)
* `LOGGING_LEVEL` - `error | warn | info | verbose | debug | silly` (default: `error`)
* `DB_HOST` - name of database host (default: `undefined`)
* `DB_USER` - database username (default: `undefined`)
* `DB_PASS` - database password (default: `undefined`)
* `DB_NAME` - database name (default: `undefined`)
* `DB_PORT` - database port (default: 3306)

### Example command to run the server using `nodemon`
```shell 
PORT=3000 LOGGING_LEVEL="silly" DB_HOST="localhost" DB_USER="some_user" DB_PASS="some_password" DB_NAME="database_name" nodemon app.js
```
