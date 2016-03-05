// file: app.js
// desc: main entry point
// author: tobias.gasslander@progic.se

var config = require('./config')
var api = require('./api/koaserver')
var logger = require('./common/logger')

logger.level = config.logging.level || 'error'

logger.info('swim server boot')
logger.silly(JSON.stringify(config, null, 4))


var app = api(config, logger)
