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

// koa server entry point
const server = (config, logger, staticServe) => {

    const inject = {config,logger}
    routes(inject, app)

    app.use(jsonBody({ limit: '50kb' }))

    app.on('error', (err) => {
        logger.error(err)
    })

    app.use(serve(staticServe.root))

    return app

}

module.exports = server
