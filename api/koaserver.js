/*
    File: koaserver.js
    Desc: Create and setup the koa app
*/
"use strict";

const koa = require('koa')
const app = koa()
const bodyParser = require('koa-bodyparser')
const parse = require('co-busboy')
const route = require('koa-route')
const fs = require('fs')
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
    app.use(bodyParser())

    // Hacky solution to handle uploads to one specific route only and then hand over control to the next middleware (in this case the file parsing functionality)
    app.use(function*(next) {
        console.log('mw multipart')
        // ignore non-POSTs
        if ('POST' != this.method) {
            console.log('illegal upload http verb', this.path)
            return yield next;
        }
        // handle only participant file uploads
        if ('/api/1/participants/file' !== this.path) {
            console.log('illegal path', this.path)
            return yield next;
        }

        // multipart upload
        var parts = parse(this);
        var part;

        while (part = yield parts) {
            if (part.length) {
                // Ignore other form fields than the actual file itself since we're hard-coding the filename anyway for now
            } else {
                var stream = fs.createWriteStream('participants.xlsx');
                part.pipe(stream);
                console.log('uploading %s -> %s', part.filename, stream.path);
            }

        }

        yield next
    });

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
