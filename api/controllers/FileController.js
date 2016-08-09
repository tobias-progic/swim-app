'use strict'

const moment = require('moment')


const reportUtil = require('../common/report_util.js')
const resultsUtil = require('../common/results_util.js')
const parse = require('co-busboy')
const fs = require('fs')
const excelFileParser = require('../common/excelFileParser.js')

let queryDatabase

// function getSqlUserObj(id) {
//     return `SELECT user.id, firstname, lastname, start_nbr AS startNbr, heat_id AS heatNbr, end_time AS endTime, tag_nbr AS tagNbr FROM user WHERE user.id = ${id}`
// }


let config
let logger

const PARTICIPANTS_FILE = 'participants.xlsx'

const init = (common) => {

    config = common.config
    logger = common.logger

    queryDatabase = require('../common/db_util').create(config, logger)

    return {
        uploadParticipants: upload
    }
}

const upload = function*(req) {

        // ignore non-POSTs
        if ('POST' != this.method) {
            logger.error(`Trying upload route with ${this.method}`)
            this.status = 500
            return
        }

        logger.silly('parsing form data', this)

        // multipart upload
        var parts = parse(this);
        var part;

        while (part = yield parts) {
            var stream = fs.createWriteStream(PARTICIPANTS_FILE);
            part.pipe(stream);
            logger.silly('uploading %s -> %s', part.filename, stream.path);
        }

        logger.silly('parsing uploaded file')

        let result = yield excelFileParser.parse(PARTICIPANTS_FILE)

        logger.silly('# participants', result.length)
        logger.silly(result)

        let sqlValues = ''

        result.forEach((user, idx, arr) => {
            sqlValues += `('${idx+1}','${user[1]}','${user[2]}')`
            if (idx !== arr.length -1) {
                sqlValues += ','
            }
        })


        let truncateUsers = 'TRUNCATE user'
        let dbResult = yield queryDatabase(truncateUsers)
        logger.silly(dbResult)

        let insertUsers = 'INSERT INTO USER(`start_nbr`,`firstname`,`lastname`) VALUES' + sqlValues
        logger.silly(insertUsers)

        dbResult = yield queryDatabase(insertUsers)
        logger.silly(dbResult)

        this.status = 200

}

module.exports = init
