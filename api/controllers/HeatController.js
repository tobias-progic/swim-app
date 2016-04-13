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
        post: create,
        remove: remove
    }
}

const getAll = function*() {
    const sql = 'select * from heat;'
    let res = yield queryDatabase(sql)
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res, null, 4)
}

const create = function*() {

    const heatNbr = this.request.body.heat
    const desc = this.request.body.desc
    const basetime = this.request.body.basetime

    if (!!heatNbr && !!desc && !!basetime) {
    const sql = `INSERT INTO heat(\`heat\`,\`desc\`, \`basetime\`) VALUES ('${heatNbr}', '${desc}', '${basetime}');`
        let res = yield queryDatabase(sql)
        this.set('Content-Type', 'application/json')
        this.body = JSON.stringify({msg: "created new heat", id: res.insertId}, null, 4);
        this.status = (res.insertId && res.insertId > 0) ? 200 : 400
    } else {
        this.status = 400
    }

}

const remove = function*(id) {
    const sql = `DELETE FROM heat WHERE id = ${id}`
    const res = yield queryDatabase(sql)
    this.set('Content-Type', 'application/json')
    // this.body = JSON.stringify(res, null, 4)
    this.status = (res.affectedRows && res.affectedRows != 0) ? 200 : 404
}


module.exports = init
