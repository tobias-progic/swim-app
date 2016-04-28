"use strict"

const moment = require('moment')
let queryDatabase

function getSqlUserObj(id) {
    return `SELECT user.id, firstname, lastname, start_nbr AS startNbr, heat_id AS heatNbr, end_time AS endTime, tag_nbr AS tagNbr FROM user WHERE user.id = ${id}`
}


let db
let logger

const init = (common) => {

    let config = common.config
    logger = common.logger

    queryDatabase = require('../common/db_util').create(config, logger)

    return {
        get: getAll
    }
}

const getAll = function*() {
    const sql = 'SELECT * FROM user WHERE end_time <> -1;'
    let users = yield queryDatabase(sql)
    let races = yield queryDatabase('SELECT * FROM race WHERE 1;')

    let timeOffsets = {
        basetime: races[0].basetime,
        heat1: races[0].heat1,
        heat2: races[0].heat2,
        heat3: races[0].heat3
    }

    let results = users.map( (user) => {
        return {
            startNbr: user.start_nbr,
            firstname: user.firstname,
            lastname: user.lastname,
            endTime: user.end_time - timeOffsets[user.heat_id],
            gender: user.gender
        }
    }).reduce((res, user) => {
        console.log(user)
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


    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(results, null, 4)
}

module.exports = init
