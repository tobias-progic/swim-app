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
        get: getAll,
        setup: setup,
        reset: reset
    }
}

const getAll = function*() {
    const sql = 'select * from race;'
    let res = yield queryDatabase(sql)
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res, null, 4)
}

const setup = function*(id) {



    const basetime = this.request.body.basetime || undefined
    const heat1 = this.request.body.heat1 || undefined
    const heat2 = this.request.body.heat2 || undefined
    const heat3 = this.request.body.heat3 || undefined

    let sql

    if (basetime === undefined) {
        sql = `UPDATE race SET \`heat1\` = '${heat1}', \`heat2\` = '${heat2}', \`heat3\` = '${heat3}' WHERE id = ${id};`
    } else {
        sql = `UPDATE race SET \`basetime\` = '${basetime}' WHERE id = ${id};`
    }

    let res = yield queryDatabase(sql)
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify({msg: "updated race", id: res.insertId}, null, 4);
    this.status = (res.insertId && res.insertId > 0) ? 200 : 400


}

const reset = function*(id) {
    const sql = `UPDATE race SET \`basetime\` = NULL, \`heat1\` = NULL, \`heat2\` = NULL, \`heat3\` = NULL WHERE id = ${id}`
    const res = yield queryDatabase(sql)
    this.set('Content-Type', 'application/json')
    // this.body = JSON.stringify(res, null, 4)
    this.status = (res.affectedRows && res.affectedRows != 0) ? 200 : 404
}

/*
    Backup data after race is finished

    CREATE TABLE race_backup LIKE race;
    INSERT race_backup SELECT * FROM race;
*/


module.exports = init
