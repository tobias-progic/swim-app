/*
    File: logger.js
    Desc: Customize winston settings
*/

"use strict";

const winston = require('winston')

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: 'all'
    })
  ]
})

module.exports = logger
