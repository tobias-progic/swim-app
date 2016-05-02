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

const getFromDatabase = (sql) => {

    return new Promise((resolve, reject) => {

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

const snakeToCamel = (s) => {

    return s.replace(/_\w/g, (m) => {return m[1].toUpperCase()})
}

const camelToSnake = (s) => {

    return s.replace(/([A-Z])/g, (c) => {return "_" + c.toLowerCase()})

}

const objectToSql = (o, table) => {
    let set = Object.keys(o).map( (v) => {

        if (v === 'heatNbr') {
            v = 'heatId'
            return ` ${camelToSnake(v)} = '${o['heatNbr']}'`
        } else {
            return ` ${camelToSnake(v)} = '${o[v]}'`
        }
    })
    .reduce((c,p) => {
        return c += p + ","
    }, "set")

    return set.substr(0, set.length-1);
}

module.exports = {
    create: (conf, log) => {
        config = conf
        logger = log

        return getFromDatabase

    },
    objectToSql: objectToSql
}
