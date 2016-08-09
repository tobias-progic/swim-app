/*
    File: excelFileParser.js
    Desc: parse and categorize excel file and return an object like
    {
        kids: [...],
        ladies: [...],
        gentlemen: [...]
    }
*/

'use strict'
const Excel = require('exceljs')
const fs = require('fs')

const parseXlsxFile = function*(filename) {

    let workbook = new Excel.Workbook()
    return new Promise(function(resolve, reject) {
        workbook.xlsx.readFile(filename)
            .then(function() {
                console.log(workbook.creator)
                let worksheet = workbook.getWorksheet(1)

                let rows = []

                worksheet.eachRow((row, rowNumber) => {
                    rows.push(row)
                })

                resolve(categorize(rows))

            })
            .catch((err) => {
                console.error('parseXlsxFile:: parse error', err)
                reject(err)
            })
    })

}



const categorize = (rows) => {

    let categories = rows.reduce((result, current) => {

        result = result || []

        // if (current.values[1] === 'Sprint Dam') {
        //     result.kids = result.cur
        //     result.cur = []
        // } else if (current.values[1] === 'Sprint Herr') {
        //     result.ladies = result.cur
        //     result.cur = []
        // } else if (current.values[1] !== 'Barn') {
        //     result.cur.push(current.values)
        // }

        switch (current.values[1]) {
            case 'Sprint Dam':
            case 'Sprint Herr':
            case 'Barn':
                break
            default:
                result.push(current.values)
                break
        }

        return result

    }, [])

    // categories.gentlemen = categories.cur
    // delete categories.cur

    return categories
}

module.exports = {
    parse: parseXlsxFile
}
