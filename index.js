/**
 * add or modify items in env based on key/value pairs in setVars and
 * save state information for later
 * @arg {Object} origEnv - place to save state of original env
 * @arg {Object} setVars - modifications to apply to current env
 * @function
 */
function setVars(origEnv, setVars) {
  var key;
  if (typeof setVars !== 'object')
    return;
  if (Array.isArray(setVars))
    return;
  for (key in setVars) {
    if (setVars.hasOwnProperty(key)) {
      origEnv[key] = [
        !!process.env.hasOwnProperty(key),
        process.env[key]
      ];
      process.env[key] = setVars[key];
    }
  }
  return;
}

/**
 * remove vars from env
 * @arg {Object} origEnv - place to save state of original env
 * @arg {Array} deleteVars - names of env vars to remove from env
 * @function
 */
function delVars(origEnv, deleteVars) {
  var i;
  if (!Array.isArray(deleteVars))
    return;
  for (i = 0; i < deleteVars.length; i++) {
    origEnv[deleteVars[i]] = [
      !!process.env.hasOwnProperty(deleteVars[i]),
      process.env[deleteVars[i]]
    ];
    delete process.env[deleteVars[i]];
  }
  return;
}

/**
 * restore environment to original state
 * @arg {Object} origEnv - delta/state of process.env from prior morphing
 * @function
 */
function restoreEnv(origEnv) {
  var key;
  for (key in origEnv) {
    if (origEnv[key][0]) {
      process.env[key] = origEnv[key][1];
    } else {
      delete process.env[key];
    }
  }
  return;
}

/**
 * calls callback within context of modified environment
 * @callback callback - function to be called while environment is modified
 * @arg {Object} setInEnv - vars to set in current env
 * @arg {Array} removeFromEnv - array of variable names to remove from env
 * @function
 */
function callbackInModifiedEnv(callback, setInEnv, removeFromEnv) {
  var origEnv = {};
  var result;
  setVars(origEnv, setInEnv);
  delVars(origEnv, removeFromEnv);
  result = callback();
  restoreEnv(origEnv);
  return result;
}

module.exports = { morph: callbackInModifiedEnv };
