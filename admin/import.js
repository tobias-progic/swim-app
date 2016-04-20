var fs = require('fs');
var parse = require('csv-parse');

var parser = parse({delimiter: ';'}, function(err, data) {

    var participants = data.map(function(participant) {
        return {
            email: participant[0],
            name: participant[3],
            competitionClass: participant[12],
            gender: participant[13]
        }
    });
    console.log(JSON.stringify(participants, null, 4));
    // console.log(data);
});

process.argv.forEach(function(val, index, array) {

    if(index > 1){

        var filePath = array[index];
        fs.createReadStream(filePath).pipe(parser);

    }
});
