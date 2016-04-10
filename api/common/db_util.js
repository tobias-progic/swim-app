/*
    File: db_util.js
    Desc: common connection and query functionality
*/

"use strict";

const mysql = require('mysql')

let db
let logger
let config

const setup = function() {
    const connection = mysql.createConnection({
      host     : config.database.host,
      user     : config.database.user,
      password : config.database.password,
      port     : config.database.port,
      database : config.database.database
    })

    db = connection
}

const getFromDatabase = function(sql) {

    return new Promise(function(resolve, reject) {

        setup()

        db.query(sql, (err, result) => {
            if (err) {
                logger.error(err)
                reject({msg: err})
                db.end()

            } else {
                resolve(result)
                db.end()
            }
        })
    })
}

module.exports = {
    create: (conf, log) => {
        config = conf
        logger = log

        return getFromDatabase

    }
}
