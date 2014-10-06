var assert = require('assert')
,   morph = require('../').morph
;

/* set up known state */
process.env.IS_SET = 'foo';
process.env.ALSO_SET = 'bar';
delete process.env.NOTSET;

/* test known state against above */
function checkUnmodifiedEnv() {
  it('should have expected values', function () {
    assert.equal('foo', process.env.IS_SET);
    assert.equal('bar', process.env.ALSO_SET);
  });
  it('should not have certain vars', function () {
    assert.strictEqual(false, process.env.hasOwnProperty('NOTSET'));
    assert.strictEqual(true, process.env.hasOwnProperty('ALSO_SET'));
  });
}

describe('mockEnv', function () {
  describe('unmodified environment', checkUnmodifiedEnv);
  describe('with changes', function () {
    var res;

    before(function () {
      res = morph(function () {
        return {
          this_is_the_result: true,
          IS_SET: process.env.IS_SET,
          NOTSET: process.env.NOTSET,
          ALSO_SET_exists: process.env.hasOwnProperty('ALSO_SET')
        };
      }, {
        IS_SET: 'bada',
        NOTSET: 'bing'
      }, ['ALSO_SET']);
    });

    it('should return the value from the callback', function () {
      assert.equal('object', typeof res);
      assert.strictEqual(true, res.hasOwnProperty('this_is_the_result'));
    });

    it('should have different values than before', function () {
      assert.equal('bada', res.IS_SET);
      assert.equal('bing', res.NOTSET);
      assert.strictEqual(false, res.ALSO_SET_exists);
    });
  });

  describe('restored environment', checkUnmodifiedEnv);
});
