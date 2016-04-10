/*
    File: app.js
    Desc: main entry point
*/

"use strict";

const config = require('./config')
const api = require('./api/koaserver')
const logger = require('./api/common/logger')

logger.level = config.logging.level || 'error'

logger.info('swim server boot')
logger.silly(JSON.stringify(config, null, 4))

const staticServe = {
    root : './client'
}

const app = api(config, logger, staticServe)

app.listen(config.server.port)
logger.silly('server running on', config.server.port)


module.exports = {
    app: api(config, logger, staticServe)
}
