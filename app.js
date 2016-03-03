// file: app.js
// desc: main entry point
// author: tobias.gasslander@progic.se

var config = require('./config/default')
var api = require('./api/handler')
var logger = require('./logger')

logger.level = config.logging.level || 'error'

logger.info('swim server boot')



var app = api(config)
