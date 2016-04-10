/*
    File: ResultsController.js
    Desc: HTTP handlers
*/

"use strict";

const mysql = require('mysql')
const moment = require('moment')

let db
let logger

const init = (common) => {

    let config = common.config
    logger = common.logger

    const connection = mysql.createConnection({
      host     : config.database.host,
      user     : config.database.user,
      password : config.database.password,
      port     : config.database.port,
      database : config.database.database
    })

    db = connection

    return {
        get: getResults,
        getOne: getResultFor,
        setOne: setFinishedAtFor
    }
}

const getResults = function*() {
    const sql = 'select * from user;'
    let res = yield getFromDatabase(sql)
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res, null, 4)
}

const getResultFor = function*(id) {
    if (! ('' + id).match(/[1-9]/)) {
        this.response = 404
        return
    }
    const sql = `select * from user where id = ${id}`
    let res = yield getFromDatabase(sql)
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res[0], null, 4)
}

const setFinishedAtFor = function*(id) {
    if (! ('' + id).match(/[1-9]/)) {
        this.response = 404
        return
    }

    let finishedAt = this.request.query.finishedAt
    if (! ('' + id).match(/[1-9]/)) {
        this.response = 400
        return
    }

    const sql = `update user set end_time = '${finishedAt}' where id = ${id}`
    logger.silly(sql)
    yield getFromDatabase(sql)
    let res = yield (getFromDatabase(`select * from user where id = ${id}`))
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res, null, 4)
}

const getFromDatabase = (sql) => {
    return new Promise(function(resolve, reject) {
        db.query(sql, (err, result) => {
            if (err) {
                logger.error(err)
                reject({msg: err})
            } else {
                resolve(result)
            }
        })
    })
}

module.exports = init
