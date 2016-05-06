"use strict"

const moment = require('moment')
const Excel = require('exceljs')
const fs = require('fs')
let queryDatabase

function getSqlUserObj(id) {
    return `SELECT user.id, firstname, lastname, start_nbr AS startNbr, heat_id AS heatNbr, end_time AS endTime, tag_nbr AS tagNbr FROM user WHERE user.id = ${id}`
}


let db
let logger
const EXCEL_FILE_SUFFIX = 'xlsx'

const init = (common) => {

    let config = common.config
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
    const sql = 'SELECT * FROM user WHERE end_time <> -1;'
    let users = yield queryDatabase(sql)
    let races = yield queryDatabase('SELECT * FROM race WHERE 1;')

    let timeOffsets = {
        basetime: races[0].basetime,
        '1': races[0].heat1,
        '2': races[0].heat2,
        '3': races[0].heat3
    }

    let results = users.map( (user) => {
        return {
            startNbr: user.start_nbr,
            firstname: user.firstname,
            lastname: user.lastname,
            endTime: user.end_time,
            netTime: user.end_time - timeOffsets[user.heat_id],
            gender: user.gender
        }
    }).reduce((res, user) => {
        res['male'] = res['male'] || []
        res['female'] = res['female'] || []

        if (user.gender === 'male') {
            res['male'].push(user)
        }
        if (user.gender === 'female') {
            res["female"].push(user)
        }
        return res

    }, {})


    console.log('responseType:', responseType, responseType === undefined)

    switch (responseType) {
        case EXCEL_FILE_SUFFIX:
            return renderExcelFile(results)
            break;
        default:
            this.set('Content-Type', 'application/json')
            this.body = JSON.stringify(results, null, 4)
            break;

    }

    // this.set('Content-Type', 'application/json')
    // this.body = JSON.stringify(results, null, 4)

}


const renderExcelFile = (results) => {

    return new Promise((resolve, reject) => {

        var workbook = new Excel.Workbook();
        workbook.creator = 'Progic.se';
        workbook.lastModifiedBy = 'Progic.se';
        workbook.created = new Date();
        workbook.modified = new Date();

        var worksheet = workbook.addWorksheet('Resultat');
        worksheet.columns = [
            { header: 'startnummer', key: 'start_nbr', width: 12 },
            { header: 'Förnamn', key: 'firstname', width: 20 },
            { header: 'Efternamn', key: 'lastname', width: 30 },
            { header: 'sluttid', key: 'endTime', width: 12 },
            { header: 'netto', key: 'netTime', width: 12 },
            { header: 'kön', key: 'gender', width: 8 }
        ];

        results.male.forEach((p) => {
            worksheet.addRow({start_nbr: p.startNbr, firstname: p.firstname, lastname: p.lastname, endTime: p.endTime, netTime: p.netTime, gender: p.gender});
        })

        results.female.forEach((p) => {
            worksheet.addRow({start_nbr: p.startNbr, firstname: p.firstname, lastname: p.lastname, endTime: p.endTime, netTime: p.netTime, gender: p.gender});
        })

        workbook.xlsx.writeFile('results.xlsx')
        .then(function() {
            console.log('done')

            resolve(fs.createReadStream('results.xlsx'))

        })
    })


}


module.exports = init
