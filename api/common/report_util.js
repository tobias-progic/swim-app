const Excel = require('exceljs')
const fs = require('fs')

const renderExcelFile = (results, filename) => {

    return new Promise((resolve, reject) => {

        var workbook = new Excel.Workbook();
        workbook.creator = 'Progic.se';
        workbook.lastModifiedBy = 'Progic.se';
        workbook.created = new Date();
        workbook.modified = new Date();

        var worksheet = workbook.addWorksheet('Resultat');
        worksheet.columns = [
            { header: 'startnummer', key: 'start_nbr', width: 12 },
            { header: 'Förnamn', key: 'firstname', width: 20 },
            { header: 'Efternamn', key: 'lastname', width: 30 },
            { header: 'sluttid', key: 'endTime', width: 12 },
            { header: 'netto', key: 'netTime', width: 12 },
            { header: 'kön', key: 'gender', width: 8 }
        ];

        if (results.length != 0) {

            if (results.male) {
                results.male.forEach((p) => {
                    worksheet.addRow({start_nbr: p.startNbr, firstname: p.firstname, lastname: p.lastname, endTime: p.endTime, netTime: p.netTime, gender: p.gender});
                })
            }

            if (results.female) {
                results.female.forEach((p) => {
                    worksheet.addRow({start_nbr: p.startNbr, firstname: p.firstname, lastname: p.lastname, endTime: p.endTime, netTime: p.netTime, gender: p.gender});
                })
            }

        }



        workbook.xlsx.writeFile(filename)
        .then(function() {
            console.log('done')

            resolve(fs.createReadStream(filename))

        })
    })


}

module.exports = {
    renderExcelFile: renderExcelFile
}
