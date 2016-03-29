
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
    // var sql = 'select * from user;'
    // var res = yield getFromDatabase(sql)
    // this.set('Content-Type', 'application/json')
    // this.body = JSON.stringify(res, null, 4)

    //Using MOCK data in order to not impede Android app dev
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(participantsMockData, null, 4)
}

var getResultFor = function*(id) {
    if (! ('' + id).match(/[1-9]/)) {
        this.response = 404
        return
    }
    // var sql = `select * from user where id = ${id}`
    // var res = yield getFromDatabase(sql)
    // this.set('Content-Type', 'application/json')
    // this.body = JSON.stringify(res[0], null, 4)

    //Using MOCK data in order to not impede Android app dev
    this.set('Content-Type', 'application/json')
    this.body = JSON.stringify(participantsMockData[id], null, 4)
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


/* Mock data */
var participantsMockData = [
    {"id": 1, "firstName": "John", "lastName": "Oneil", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 2, "firstName": "Jin", "lastName": "Miles", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 3, "firstName": "Francis", "lastName": "Schneider", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 4, "firstName": "Aaron", "lastName": "Joseph", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 5, "firstName": "Keaton", "lastName": "Allison", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 6, "firstName": "Beck", "lastName": "Fulton", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 7, "firstName": "Vincent", "lastName": "Bowen", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 8, "firstName": "Drake", "lastName": "Berry", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 9, "firstName": "Paul", "lastName": "Simmons", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 10, "firstName": "Cameron", "lastName": "Morgan", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 11, "firstName": "Orlando", "lastName": "Newton", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 12, "firstName": "Yasir", "lastName": "Mcbride", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 13, "firstName": "Demetrius", "lastName": "Rollins", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 14, "firstName": "Nolan", "lastName": "Stephenson", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 15, "firstName": "Vernon", "lastName": "Nieves", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 16, "firstName": "Brett", "lastName": "Roach", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 17, "firstName": "Boris", "lastName": "Whitehead", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 18, "firstName": "Quamar", "lastName": "Schneider", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 19, "firstName": "Armand", "lastName": "Marquez", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 20, "firstName": "Hamish", "lastName": "Mcmahon", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 21, "firstName": "Norman", "lastName": "Irwin", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 22, "firstName": "Nathan", "lastName": "Park", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 23, "firstName": "Lyle", "lastName": "Slater", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 24, "firstName": "Vernon", "lastName": "Love", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 25, "firstName": "Chaney", "lastName": "Saunders", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 26, "firstName": "Magee", "lastName": "Hull", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 27, "firstName": "Paul", "lastName": "Kerr", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 28, "firstName": "Basil", "lastName": "England", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 29, "firstName": "Warren", "lastName": "Beasley", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 30, "firstName": "Garrett", "lastName": "Hudson", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 31, "firstName": "Eric", "lastName": "Arnold", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 32, "firstName": "Neville", "lastName": "Lloyd", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 33, "firstName": "Ali", "lastName": "Short", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 34, "firstName": "Cooper", "lastName": "Reid", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 35, "firstName": "Micah", "lastName": "Vazquez", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 36, "firstName": "Jack", "lastName": "Weaver", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 37, "firstName": "Melvin", "lastName": "Schmidt", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 38, "firstName": "Jordan", "lastName": "Burks", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 39, "firstName": "Zachery", "lastName": "Melendez", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 40, "firstName": "Tyrone", "lastName": "Booth", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 41, "firstName": "Amery", "lastName": "Melendez", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 42, "firstName": "Berk", "lastName": "Reyes", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 43, "firstName": "Chaim", "lastName": "Burke", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 44, "firstName": "Ezra", "lastName": "Bray", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 45, "firstName": "Garth", "lastName": "Skinner", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 46, "firstName": "Brock", "lastName": "Walker", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 47, "firstName": "Kadeem", "lastName": "Sellers", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 48, "firstName": "Eagan", "lastName": "Morris", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 49, "firstName": "Xavier", "lastName": "Francis", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 50, "firstName": "Jerome", "lastName": "Garner", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 51, "firstName": "Neil", "lastName": "Osborne", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 52, "firstName": "Vladimir", "lastName": "Stevens", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 53, "firstName": "Aaron", "lastName": "York", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 54, "firstName": "Gil", "lastName": "Kirkland", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 55, "firstName": "Allen", "lastName": "Shaw", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 56, "firstName": "Merritt", "lastName": "Atkinson", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 57, "firstName": "Lucius", "lastName": "Leonard", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 58, "firstName": "Fulton", "lastName": "Greer", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 59, "firstName": "Christian", "lastName": "Weber", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 60, "firstName": "Anthony", "lastName": "Mclean", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 61, "firstName": "Dexter", "lastName": "Griffith", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 62, "firstName": "Hasad", "lastName": "Hensley", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 63, "firstName": "Dorian", "lastName": "Hudson", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 64, "firstName": "Xavier", "lastName": "Phelps", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 65, "firstName": "Ulric", "lastName": "Bean", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 66, "firstName": "Merrill", "lastName": "Wolf", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 67, "firstName": "Damon", "lastName": "Wall", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 68, "firstName": "Connor", "lastName": "Dyer", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 69, "firstName": "Brent", "lastName": "Travis", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 70, "firstName": "Thaddeus", "lastName": "Benson", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 71, "firstName": "Knox", "lastName": "Barber", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 72, "firstName": "Lucas", "lastName": "Pace", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 73, "firstName": "Ian", "lastName": "Vance", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 74, "firstName": "Luke", "lastName": "Moses", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 75, "firstName": "Joshua", "lastName": "Wilson", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 76, "firstName": "Hamilton", "lastName": "Skinner", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 77, "firstName": "Xavier", "lastName": "Todd", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 78, "firstName": "Abdul", "lastName": "Chang", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 79, "firstName": "Isaiah", "lastName": "Dejesus", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 80, "firstName": "Kareem", "lastName": "Strong", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 81, "firstName": "Darius", "lastName": "Valdez", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 82, "firstName": "Kadeem", "lastName": "Richard", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 83, "firstName": "Paul", "lastName": "Duran", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 84, "firstName": "Rigel", "lastName": "Sloan", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 85, "firstName": "Linus", "lastName": "Kirby", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 86, "firstName": "Kirk", "lastName": "Meyers", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 87, "firstName": "Giacomo", "lastName": "Rutledge", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 88, "firstName": "Ralph", "lastName": "Boone", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 89, "firstName": "Dominic", "lastName": "Lang", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 90, "firstName": "Allistair", "lastName": "Parrish", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 91, "firstName": "Malachi", "lastName": "Gardner", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 92, "firstName": "Rudyard", "lastName": "Rogers", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 93, "firstName": "Holmes", "lastName": "Keller", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 94, "firstName": "Fletcher", "lastName": "Horne", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 95, "firstName": "Dane", "lastName": "Hicks", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 96, "firstName": "Ali", "lastName": "Ramsey", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 97, "firstName": "Cadman", "lastName": "Koch", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 98, "firstName": "Cooper", "lastName": "Hayden", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 99, "firstName": "Axel", "lastName": "Weber", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"},
    {"id": 100, "firstName": "Acton", "lastName": "Campbell", "heatNbr": "1", "tagId": "1A2B3C", "endTime": "123456789"}
];
