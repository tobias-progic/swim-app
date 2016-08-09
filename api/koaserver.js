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

    // app.use(bodyParser())
    app.use(cors({
        origin: '*'
    }))

    app.use(koaLogger())

    app.use(bodyParser())

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

    // app.use(function*(next) {
    //     // ignore non-POSTs
    //     if ('POST' != this.method) return yield next;

    //     // multipart upload
    //     var parts = parse(this);
    //     var part;

    //     while (part = yield parts) {
    //         var stream = fs.createWriteStream(path.join(os.tmpdir(), Math.random().toString()));
    //         part.pipe(stream);
    //         logger.silly('uploading %s -> %s', part.filename, stream.path);
    //     }

    //     this.redirect('/');
    // });

    return app

}

module.exports = server
