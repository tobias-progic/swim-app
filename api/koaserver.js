/*
    File: koaserver.js
    Desc: Create and setup the koa app
*/
"use strict";

const koa = require('koa')
const app = koa()
// const jsonBody = require('koa-json-body')
const bodyParser = require('koa-bodyparser')
const parse = require('co-busboy')
const route = require('koa-route')
const routes = require('./routes')
const serve = require('koa-static')
const koaLogger = require('koa-logger')
const cors = require('kcors')

// koa server entry point
const server = (config, logger, staticServe) => {

    app.use(cors({
        origin: '*'
    }))

    app.use(koaLogger())

    app.use(bodyParser({strict: true, enableTypes:'json'}))

    // app.use(jsonBody({
    //     limit: '500kb'
    // }))



    app.context.db = require('./common/db_util').create(config, logger)

    const inject = {
        config,
        logger
    }
    routes(inject, app)

    app.on('error', (err) => {
        logger.error(err)
    })

    app.use(serve(staticServe.root))

    return app

}

module.exports = server
