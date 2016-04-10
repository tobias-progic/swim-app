/*
    File: HeatController.js
    Desc: HTTP handlers for the Heat concept
*/

"use strict";

// Join tag och heat
// POST för tag
// PUT för tag

const moment = require('moment')

let logger
let queryDatabase

const init = (common) => {

    let config = common.config
    logger = common.logger

    queryDatabase = require('../common/db_util').create(config, logger)

    return {
        get: getAll
    }
}

const getAll = function*() {
    const sql = 'select * from heat;'
    let res = yield queryDatabase(sql)
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res, null, 4)
}


module.exports = init
