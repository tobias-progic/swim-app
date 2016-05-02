/*
    File: resultcontroller.spec.js
    Descr: Test cases for the API
*/

'use strict';

const assert = require('assert')

const _ = require('lodash')
const expect = require('chai').expect
let should = require('chai').should()


describe('GET - participants', (done) => {

    let app = require('../../app.js')

    let request = require('supertest').agent(app.listen())

    after((done) => {
        app = null;
        request = null;
        done()
    })

    it('should return a number of participants', (done) => {
        request
        .get('/api/1/participants')
        .expect(200)
        .end(function(err,res) {
            if(!!err) {
                done(err)
            }
            res.should.have.property('body')
            res.body[0].should.have.property('startNbr', 1)
            done()
        })
    })

})

describe('PUT - participants', () => {

    let app = require('../../app.js')

    let request = require('supertest').agent(app.listen())

    let participant1;

    before((done) => {
        console.log('running before hook...')
        request
        .get('/api/1/participants')
        .expect(200)
        .end((err,res) => {
            if(!!err) {
                done(err)
            }
            res.body[0].should.have.property('startNbr', 1)
            participant1 = res.body[0]
            done()
        })
    })

    after((done) => {
        app = null;
        request = null;
        done()
    })

    it('should update a participants heatNbr', (done) => {

        participant1.heatNbr = 42;

        request
        .put('/api/1/participants/1')
        .send(participant1)
        .expect(200)
        .end((err,res) => {
            if(!!err) {
                done(err)
            }
            res.should.have.property('body')
            res.body[0].should.have.property('heatNbr', 42)
            done()
        })
    })

    it('should update a participants tagNbr', (done) => {

        participant1.tagNbr = 89;

        request
        .put('/api/1/participants/1')
        .send(participant1)
        .expect(200)
        .end((err,res) => {
            if(!!err) {
                done(err)
            }
            res.should.have.property('body')
            res.body[0].should.have.property('tagNbr', '89')
            done()
        })
    })

    it('should update a participants tagNbr', (done) => {

        participant1.tagNbr = 89;

        request
        .put('/api/1/participants/1')
        .send({"tagNbr": "89"})
        .expect(200)
        .end((err,res) => {
            if(!!err) {
                done(err)
            }
            res.should.have.property('body')
            res.body[0].should.have.property('tagNbr', '89')
            done()
        })
    })

})



