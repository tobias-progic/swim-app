'use strict'

const mapResults = function*(config, logger) {

    const queryDatabase = require('../common/db_util').create(config, logger)


    const sql = 'SELECT * FROM user WHERE end_time <> -1;'
    let users = yield queryDatabase(sql)
    let races = yield queryDatabase('SELECT * FROM race WHERE 1;')

    let timeOffsets = {
        basetime: races[0].basetime,
        '1': races[0].heat1,
        '2': races[0].heat2,
        '3': races[0].heat3
    }

    let genderMapped = users.map( (user) => {
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
            res['female'].push(user)
        }
        return res

    }, {})

    let femaleUsers
    let maleUsers


    if (genderMapped['female']) {
        femaleUsers = genderMapped['female'].sort((a,b) => {

            if (a.netTime === b.netTime) {
                return 0;
            }
            return a.netTime < b.netTime ? -1 : 1
        })
    }

    if (genderMapped['male']) {
        maleUsers = genderMapped['male'].sort((a,b) => {

            if (a.netTime === b.netTime) {
                return 0;
            }
            return a.netTime < b.netTime ? -1 : 1
        })
    }



    return {
        male: maleUsers,
        female: femaleUsers
    }

}

module.exports = {
    getResults: mapResults
}
