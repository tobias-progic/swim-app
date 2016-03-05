
var mysql = require('mysql')
var moment = require('moment')

var db
var logger

var init = (common) => {

    var config = common.config
    logger = common.logger

    var connection = mysql.createConnection({
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

var getResults = function*() {
    var sql = 'select * from user;'
    var res = yield getFromDatabase(sql)
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res, null, 4)
}

var getResultFor = function*(id) {
    if (! ('' + id).match(/[1-9]/)) {
        this.response = 404
        return
    }
    var sql = `select * from user where id = ${id}`
    var res = yield getFromDatabase(sql)
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res[0], null, 4)
}

var setFinishedAtFor = function*(id) {
    if (! ('' + id).match(/[1-9]/)) {
        this.response = 404
        return
    }

    var timestamp = new Date(this.request.query.finishedAt)
    if (!timestamp) {
        this.response = 400
        return
    }

    var finished = moment(timestamp)

    var sql = `update user set finishedAt = '${finished.format('YYYY-MM-DD HH:mm:ss')}' where id = ${id}`
    logger.silly(sql)
    yield getFromDatabase(sql)
    var res = yield (getFromDatabase(`select * from user where id = ${id}`))
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(res, null, 4)
}

var getFromDatabase = (sql) => {
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
