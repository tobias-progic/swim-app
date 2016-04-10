/*
    File: routes.js
    Desc: add routes specifications in the routes hash
          Controllers are required to be located in the ./controllers folder and must be named
          exactly as in the routes specification
*/

"use strict";

const _ = require('koa-route')

// add your routes specifications here
const routes = {
    'get /api/1/participants': 'ParticipantsController.get',
    'get /api/1/participants/:id': 'ParticipantsController.getOne',
    'put /api/1/participants/:id/tag': 'ParticipantsController.setTag',
    'put /api/1/participants/:id/endtime': 'ParticipantsController.setEndTime',
    // 'post /api/1/heat': 'HeatController.createOne',
    // 'put /api/1/heat/:id': 'HeatController.setOne',
    // 'delete /api/1/heat/:id' : 'HeatController.deleteOne',
    'get /api/1/heats': 'HeatController.get'
}


// traverse the routes and add handlers to the koa app accordingly
const mount = (common, app) => {

    Object.keys(routes).map((k) => {
        common.logger.debug('mounting', k, routes[k])

        let handlerFunc = routes[k].split('.')
        let path = k.split(' ')

        let method = path[0]
        let route = path[1]

        let controller = require('./controllers/' + handlerFunc[0])
        let ctrl = controller(common)
        let handler = ctrl[handlerFunc[1]]

        common.logger.silly(`adding handler for ${method} at ${route} using ${handlerFunc[0]}.${handlerFunc[1]}`)
        app.use(_[method](route, handler))

    })

}

module.exports = mount
