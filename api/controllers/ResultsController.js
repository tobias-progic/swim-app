"use strict"

const moment = require('moment')


const reportUtil = require('../common/report_util.js')
const resultsUtil = require('../common/results_util.js')
let queryDatabase

function getSqlUserObj(id) {
    return `SELECT user.id, firstname, lastname, start_nbr AS startNbr, heat_id AS heatNbr, end_time AS endTime, tag_nbr AS tagNbr FROM user WHERE user.id = ${id}`
}


let config
let logger
const EXCEL_FILE_SUFFIX = 'xlsx'

const init = (common) => {

    config = common.config
    logger = common.logger

    queryDatabase = require('../common/db_util').create(config, logger)

    return {
        get: getAll,
        getExcel: getExcel
    }
}

const getExcel = function*() {

    logger.silly('getExcel')
    this.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    this.body = yield getAll(EXCEL_FILE_SUFFIX)
}

const getAll = function*(responseType) {

    let results = yield resultsUtil.getResults(config, logger)
    logger.silly(`results= ${results}`);


    logger.silly('responseType:', responseType, responseType === undefined)

    switch (responseType) {
        case EXCEL_FILE_SUFFIX:
            return reportUtil.renderExcelFile(results, 'results.xlsx')
            break;
        default:
            this.set('Content-Type', 'application/json')
            this.body = JSON.stringify(results, null, 4)
            break;

    }

}


module.exports = init
