var koa = require('koa')
var app = koa()
var jsonBody = require('koa-json-body')
var routes = require('./routes')
var serve = require('koa-static')

// koa server entry point
var server = function(config, logger, static) {

    var inject = {config,logger}
    routes(inject, app)

    app.use(jsonBody({ limit: '50kb' }))

    app.on('error', function(err) {
        logger.error(err)
    })

    app.use(serve(static.root));

    app.listen(config.server.port)
    logger.silly('server running on', config.server.port)
}

module.exports = server
