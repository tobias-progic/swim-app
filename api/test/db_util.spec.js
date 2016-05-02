'use strict';

const assert = require('assert')

const _ = require('lodash')
const expect = require('chai').expect
const should = require('chai').should
const dbUtil = require('../common/db_util')

describe('db util', () => {

    it('should convert object to sql', () => {
        let o = {
            heatNbr: 42,
            tagNbr: 89
        }

        expect(dbUtil.objectToSql(o)).to.equal("set heat_id = '42', tag_nbr = '89'")

    })

})
