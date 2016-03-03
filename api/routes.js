var routes = {
    'get': [
        {'/results': 'getResults'}, 
        {'/users': 'getUsers'}
    ],
    'put': [
        {'/results': 'putResults'}, 
        {'/users': 'putUsers'}
    ]
};

module.exports = routes;