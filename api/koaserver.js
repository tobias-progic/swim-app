/*
    File: koaserver.js
    Desc: Create and setup the koa app
*/
"use strict";

const koa = require('koa')
const app = koa()
const jsonBody = require('koa-json-body')
const routes = require('./routes')
const serve = require('koa-static')
const koaLogger = require('koa-logger')
const cors = require('kcors')

// koa server entry point
const server = (config, logger, staticServe) => {

    // app.use(bodyParser())
    app.use(cors({
        origin: '*'
    }))
    app.use(jsonBody({ limit: '500kb' }))
    app.use(koaLogger())

    const inject = {config,logger}
    routes(inject, app)

    app.on('error', (err) => {
        logger.error(err)
    })

    app.use(serve(staticServe.root))

    return app

}

module.exports = server
