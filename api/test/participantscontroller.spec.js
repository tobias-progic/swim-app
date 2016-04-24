/*
    File: resultcontroller.spec.js
    Descr: Test cases for the API
*/

//NOTE: Work in progress! Can't figure out how to get supertest to play nice with my koa app

'use strict';

const assert = require('assert')

const _ = require('lodash')
const expect = require('chai').expect
const should = require('chai').should

const app = require('../../app.js')

// console.log(app);

const request = require('supertest').agent(app.listen())

describe('GET - results', () => {

    it('should return a number of participants', () => {
        request
        .get('/api/1/paricipants')
        .expect(200)
        .end()
        // .end((err,res) => {
        //     if (err) {
        //         done(err)
        //     } else {
        //         // body[0].should.have.property('startNbr', 1)
        //         console.log(res.body)
        //         done()
        //     }

        // });
    })

})



