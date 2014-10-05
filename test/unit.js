var assert = require('assert')
,   mockEnv = require('../')
;

describe('mockEnv', function() {
    describe('without changes', function() {
        it('should have the same values as before', function() {
            assert.equal(1,1);
        })
    })
})


