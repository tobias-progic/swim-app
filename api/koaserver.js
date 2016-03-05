// var logger = require('../common/logger')
// var _ = require('koa-route')
var koa = require('koa')
var app = koa()
var jsonBody = require('koa-json-body')
// var resultsController = require('./controllers/ResultsController')
var routes = require('./routes')


// koa server entry point
var server = function(config, logger) {

    var inject = {config,logger}
    routes(inject, app)

    // var results = resultsController(inject, app)

    app.use(jsonBody({ limit: '10kb' }))

    // app.use(_.get('/results', results.get))
    // app.use(_.get('/results/:number', results.getOne))



    app.on('error', function(err) {
        logger.error(err)
    })

    app.listen(config.server.port)
    logger.silly('server running on', config.server.port)
}

module.exports = server
