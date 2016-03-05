// File: routes.js
// Desc: add routes specifications in the routes hash
//       Controllers are required to be located in the ./controllers folder and must be named
//       exactly as in the routes specification

var _ = require('koa-route')

// add your routes specifications here
var routes = {
    'get /api/1/results': 'ResultsController.get',
    'get /api/1/results/:id': 'ResultsController.getOne',
    'put /api/1/results/:id': 'ResultsController.setOne'
}


// traverse the routes and add handlers to the koa app accordingly
var mount = (common, app) => {

    Object.keys(routes).map((k) => {
        common.logger.debug('mounting', k, routes[k])

        var handlerFunc = routes[k].split('.')
        var path = k.split(' ')

        var method = path[0]
        var route = path[1]

        var controller = require('./controllers/' + handlerFunc[0])
        var ctrl = controller(common)
        var handler = ctrl[handlerFunc[1]]

        common.logger.silly(`adding handler for ${method} at ${route} using ${handlerFunc[0]}.${handlerFunc[1]}`)
        app.use(_[method](route, handler))

    })

}

module.exports = mount
