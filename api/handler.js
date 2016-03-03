var logger = require('../logger')
var _ = require('koa-route')
var koa = require('koa')
var app = koa()

var db = {
    42: {
        group: 1,
        finished: new Date()
    },
    89: {
        group: 2,
        finished: new Date()
    },
    47: {
        group: 3,
        finished: new Date()
    }
}

var results = {
    list: function* () {
        this.body = JSON.stringify(db)
    },
    getOne: function* (number) {
        var result = db[number]
        if (!result) {
            return this.throw('participant number not found', 404)
        }
        this.body = result
    }
}

// koa server entry point
var server = function(config) {

    app.use(_.get('/results', results.list))
    app.use(_.get('/results/:number', results.getOne))

    app.on('error', function(err) {
        logger.error(err)
    })

    app.listen(config.server.port)
    logger.silly('server running on', config.server.port)
}

module.exports = server