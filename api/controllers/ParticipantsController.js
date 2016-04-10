/*
    File: ResultsController.js
    Desc: HTTP handlers for the Participant concept
*/

"use strict";

const moment = require('moment')
let queryDatabase

let db
let logger

const init = (common) => {

    let config = common.config
    logger = common.logger

    queryDatabase = require('../common/db_util').create(config, logger)

    return {
        get: getResults,
        getOne: getResultFor,
        setEndTime: setFinishedAtFor,
        setTag: setTagFor
    }
}

const getResults = function*() {
    const sql = 'select firstname, lastname, start_nbr as startNbr, heat as heatNbr, end_time as endTime, tag_nbr as tagNbr from user join heat on user.heat_id = heat.id;'
    let res = yield queryDatabase(sql)
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res, null, 4)
}

const getResultFor = function*(id) {
    let res
    if (!isNumeric(id)) {
        logger.silly('id is not a number')
        this.response = 400
        this.body = {}
        return
    }
    const sql = `select firstname, lastname, start_nbr as startNbr, heat as heatNbr, end_time as endTime, tag_nbr as tagNbr from user join heat on user.heat_id = heat.id where user.id = ${id};`
    res = yield queryDatabase(sql)
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res[0], null, 4)
}

const setFinishedAtFor = function*(id) {
    if (!isNumeric(id)) {
        logger.silly('id is not a number')
        this.response = 400
        this.body = {}
        return
    }

    let finishedAt = this.request.query.finishedAt

    if (!isNumeric(finishedAt)) {
        logger.silly('finishedAt is not a number')
        this.response = 400
        this.body = {}
        return
    }

    let sql = `update user set end_time = '${finishedAt}' where id = ${id}`
    logger.silly(sql)
    yield queryDatabase(sql)
    sql = `select firstname, lastname, start_nbr as startNbr, heat as heatNbr, end_time as endTime, tag_nbr as tagNbr from user join heat on user.heat_id = heat.id where user.id = ${id};`
    let res = yield (queryDatabase(sql))
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res, null, 4)
}

const setTagFor = function*(id) {
    if (!isNumeric(id)) {
        logger.silly('id is not a number')
        this.response = 400
        this.body = {}
        return
    }

    let tag = this.request.query.tag

    if (!isNumeric(tag)) {
        logger.silly('tag is not a number')
        this.response = 400
        this.body = {}
        return
    }

    let sql = `update user set tag_nbr = '${tag}' where id = ${id}`
    logger.silly(sql)
    yield queryDatabase(sql)
    sql = `select firstname, lastname, start_nbr as startNbr, heat as heatNbr, end_time as endTime, tag_nbr as tagNbr from user join heat on user.heat_id = heat.id where user.id = ${id};`
    let res = yield (queryDatabase(sql))
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res, null, 4)
}

function isNumeric(nbr) {
    let n = parseInt(nbr, 10)
    return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
}

module.exports = init
