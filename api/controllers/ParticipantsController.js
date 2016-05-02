/*
    File: ResultsController.js
    Desc: HTTP handlers for the Participant concept
*/

"use strict";

const moment = require('moment')
const dbUtil = require('../common/db_util')
let queryDatabase

function getSqlUserObj(id) {
    return `SELECT user.id, firstname, lastname, start_nbr AS startNbr, heat_id AS heatNbr, end_time AS endTime, tag_nbr AS tagNbr FROM user WHERE user.id = ${id}`
}


let db
let logger

const init = (common) => {

    let config = common.config
    logger = common.logger


    queryDatabase = dbUtil.create(config, logger)

    return {
        get: getResults,
        getOne: getResultFor,
        setEndTime: setFinishedAtFor,
        setTag: setTagFor,
        update: update
    }
}

const getResults = function*() {
    const sql = 'select user.id, firstname, lastname, start_nbr as startNbr, heat_id as heatNbr, end_time as endTime, tag_nbr as tagNbr from user;'
    let res = yield queryDatabase(sql)
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res, null, 4)
}

const getResultFor = function*(id) {
    logger.silly('getResultFor', id)
    let res
    if (!isNumeric(id)) {
        logger.silly('id is not a number')
        this.response = 400
        this.body = {}
        return
    }

    const sql = getSqlUserObj(id)
    res = yield queryDatabase(sql)
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res[0], null, 4)
}

const setFinishedAtFor = function*(id) {
    logger.silly('setFinishedAtFor')
    if (!isNumeric(id)) {
        logger.silly('id is not a number')
        this.response = 400
        this.body = {}
        return
    }

    let finishedAt = this.request.query.finishedAt

    let sql = `update user set end_time = '${finishedAt}' where id = ${id}`
    logger.silly(sql)
    yield queryDatabase(sql)
    sql = getSqlUserObj(id)
    let res = yield (queryDatabase(sql))
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify({finishedAt: finishedAt}, null, 4)
}

const setTagFor = function*(id) {
    logger.silly('setTagFor')
    if (!isNumeric(id)) {
        logger.silly('id is not a number')
        this.response = 400
        this.body = {}
        return
    }
    let tag = this.request.query.tag

    let sql = `update user set tag_nbr = '${tag}' where id = ${id}`
    logger.silly(sql)

    let res = yield queryDatabase(sql)
    res = yield queryDatabase(getSqlUserObj(id))
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res, null, 4)
}

const update = function*(id) {
    logger.silly('update')
    if (!isNumeric(id)) {
        logger.silly('id is not a number')
        this.response = 400
        this.body = {}
        return
    }

    if (!this.request.body.id) {
        logger.silly('body does not have an id')
        this.response = 400
        return
    }

    // console.log('body', this.request.body)

    let sql = "update user " + dbUtil.objectToSql(this.request.body) + ` where id = ${id}`;

    // console.log('*** sql', sql)

    let res = yield queryDatabase(sql)
    res = yield queryDatabase(getSqlUserObj(id))
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res, null, 4)
}

function isNumeric(nbr) {
    let n = parseInt(nbr, 10)
    return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
}

/*
    Backup data after race is finished

    CREATE TABLE user_backup LIKE user;
    INSERT user_backup SELECT * FROM user;
*/

module.exports = init
