/*
    File: resultcontroller.spec.js
    Descr: Test cases for the API
*/

'use strict';

const assert = require('assert')

const _ = require('lodash')
const expect = require('chai').expect
const should = require('chai').should

let app = require('../../app.js')

const request = require('supertest').agent(app.listen())

describe('GET - results', () => {

    before(() => {
        console.log('running before hook...')
    })

    after(() => {
        app = null;
    });

    it('should return a number of participants', () => {
        request
        .get('/api/1/participants')
        .expect(200)
        // .end()
        .end((err,res) => {
            expect(!!err, true);
            expect(!!body[0], true);
            expect(!!body[0].startNbr, 1);
            body[0].should.have.property('startNbr', 1)
            // if (err) {
            //     done(err)
            // } else {
            //     // body[0].should.have.property('startNbr', 1)
            //     console.log(res.body)
            //     done()
            // }

        });
    })

})



