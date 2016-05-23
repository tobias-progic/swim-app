/*
    File: HeatController.js
    Desc: HTTP handlers for the Heat concept
*/

"use strict";

// Join tag och heat
// POST för tag
// PUT för tag

const moment = require('moment')
const resultsUtil = require('../common/results_util.js')
const reportUtil = require('../common/report_util.js')

let logger
let config
let queryDatabase

const init = (common) => {

    config = common.config
    logger = common.logger

    queryDatabase = require('../common/db_util').create(config, logger)

    return {
        get: getAll,
        setup: setup,
        reset: reset,
        finishRace: setFinished
    }
}

const getAll = function*() {
    const sql = 'select * from race;'
    let res = yield queryDatabase(sql)
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res, null, 4)
}

const setup = function*(id) {

    let sql

    // safeguard against accidental re-setup of the race

    // sql = 'select basetime from race where basetime <> -1'
    sql = 'select basetime from race where id = 1'
    let safeguard = yield queryDatabase(sql)
    // logger.silly("safeguard")
    // logger.silly(JSON.stringify(safeguard))

    if (safeguard[0].basetime != -1) {
        this.set('Content-Type', 'application/json')
        this.status = 403
    } else {
        const basetime = this.request.body.basetime || undefined
        const heat1 = this.request.body.heat1 || undefined
        const heat2 = this.request.body.heat2 || undefined
        const heat3 = this.request.body.heat3 || undefined

        if (basetime === undefined) {
            sql = `UPDATE race SET \`heat1\` = '${heat1}', \`heat2\` = '${heat2}', \`heat3\` = '${heat3}' WHERE id = ${id};`
        } else {
            sql = `UPDATE race SET \`basetime\` = '${basetime}', \`finished\` = 0 WHERE id = ${id};`
        }

        let res = yield queryDatabase(sql)
        this.set('Content-Type', 'application/json')
        this.body = JSON.stringify({msg: "updated race", id: res.insertId}, null, 4);
        console.log(res);
        this.status = (res.affectedRows && res.affectedRows !== 0) ? 200 : 400

    }

}

const reset = function*(id) {

    let keepTags = this.request.query.tags === 'keep'

    logger.silly('keepTags', keepTags)

    // let sql = `UPDATE race SET \`basetime\` = NULL, \`heat1\` = NULL, \`heat2\` = NULL, \`heat3\` = NULL, \`finished\` = 0 WHERE id = ${id}`
    let sql = `UPDATE race SET \`basetime\` = -1, \`heat1\` = 0, \`heat2\` = 0, \`heat3\` = 0, \`finished\` = 0 WHERE id = ${id}`
    let res = yield queryDatabase(sql)
    let ok = (res.affectedRows && res.affectedRows != 0)

    sql = `UPDATE user SET \`tag_nbr\` = NULL, \`end_time\` = NULL WHERE 1`

    if (keepTags) {
        sql = `UPDATE user SET \`end_time\` = NULL WHERE 1`
    }


    res = yield queryDatabase(sql)
    ok &= (res.affectedRows && res.affectedRows != 0)
    this.set('Content-Type', 'application/json')
    // this.body = JSON.stringify(res, null, 4)
    this.status = (ok != 0) ? 200 : 404
}

const setFinished = function*(id) {
    let sql = `UPDATE race SET \`finished\` = 1 WHERE id = ${id}`
    let res = yield queryDatabase(sql)
    let ok = (res.affectedRows && res.affectedRows != 0)
    yield backupRace()
    this.set('Content-Type', 'application/json')
    this.status = (ok != 0) ? 200 : 404
}

/*
    Backup data after race is finished
*/
const backupRace = function*() {
    let sql = "DROP TABLE IF EXISTS `user_backup`;"
    yield queryDatabase(sql)
    sql = "DROP TABLE IF EXISTS `race_backup`;"
    yield queryDatabase(sql)
    sql = "CREATE TABLE race_backup LIKE race;"
    yield queryDatabase(sql)
    sql = "INSERT race_backup SELECT * FROM race;"
    yield queryDatabase(sql)
    sql = "CREATE TABLE user_backup SELECT * FROM user;"
    yield queryDatabase(sql)
    sql = "INSERT user_backup SELECT * FROM user;"
    yield queryDatabase(sql)
    let results = yield resultsUtil.getResults(config, logger)

    let thisMoment = moment(new Date())
    thisMoment.locale('sv')

    let backupFileName = thisMoment.format('YYYY-MM-DD_h:mm:ss') + '.xlsx'
    reportUtil.renderExcelFile(results, backupFileName)
}


module.exports = init
