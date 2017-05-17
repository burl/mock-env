[![Build Status](https://travis-ci.org/burl/mock-env.svg?branch=master)](https://travis-ci.org/burl/mock-env)

# mock-env

morph process.env by adding/chaning/removing env vars for the lifetime of a callback.

This is intended for use in unit tests.  It modifies process.env per passed arguments, calls a designated callback, then restores process.env to its original value.


## Install

```shell
npm install mock-env
```

## Usage Example

```javascript
var morph = require('mock-env').morph;

var result = morph(function() {
        return process.env['LOGNAME'];
    }, {
        LOGNAME: 'someone-else';
    });

// result will be 'someone-else', not your LOGNAME
```

## Function

### var result = morph(callback [,setVars={} [,removeVars=[]]])

Returns whatever callback() returns.

Call back 'callback' after morphing process.env by setting (adding or modifying) properties per the setVars object and un setting (deleting)
any properties named in the removeVars list.

options:

* `callback` - (required) the callback to invoke in the morphed environment
* `setVars` - object with zero or more key-value pairs to set in process.env
* `removeVars` - array of names that should be removed from process.env

# license

MIT


