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
    assert.equal(process.env.IS_SET, 'foo');
    assert.equal(process.env.ALSO_SET, 'bar');
  });
  it('should not have certain vars', function () {
    assert.strictEqual(process.env.hasOwnProperty('NOTSET'), false);
    assert.strictEqual(process.env.hasOwnProperty('ALSO_SET'), true);
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
      }, [
        'ALSO_SET'
      ]);
    });

    it('should return the value from the callback', function () {
      assert.equal(typeof res, 'object');
      assert.strictEqual(res.hasOwnProperty('this_is_the_result'), true);
    });

    it('should have different values than before', function () {
      assert.equal(res.IS_SET, 'bada');
      assert.equal(res.NOTSET, 'bing');
      assert.strictEqual(res.ALSO_SET_exists, false);
    });
  });

  describe('when arguments conflict', function() {
    before(function () {
      res = morph(function () {
        return {
          IS_SET: process.env.IS_SET,
          NOTSET: process.env.NOTSET,
          ALSO_SET_exists: process.env.hasOwnProperty('ALSO_SET')
        };
      }, {
        IS_SET: 'bada',
        NOTSET: 'bing'
      }, [
        'IS_SET'
      ]);
    });

    describe('should preserve the original value', checkUnmodifiedEnv);
  })

  describe('restored environment', checkUnmodifiedEnv);
});
