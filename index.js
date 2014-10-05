
function modifyEnv(oldEnv, newEnv, remove) {
    var key;
    for(key in newEnv) {
        if (newEnv.hasOwnProperty(key)) {
            oldEnv[key] = [!!process.env.hasOwnProperty(key), process.env[key]];
            if (remove) {
                delete process.env[key];
            }
            else {
                process.env[key] = newEnv[key];
            }
        }
    }
    return;
}

function restoreEnv(oldEnv) {
    var key;
    for(key in oldEnv) {
        if (oldEnv[key][0]) {
            process.env[key] = oldEnv[key][1];
        }
        else {
            delete process.env[key];
        }
    }
    return;
}

function callInModifiedEnv(callback, addToEnv, removeFromEnv) {
    var addToEnv = addToEnv || {};
    var removeFromEnv = removeFromEnv || {};
    var oldEnv = {};
    var result;

    modifyEnv(oldEnv, addToEnv);
    modifyEnv(oldEnv, removeFromEnv, true);

    result = callback();

    restoreEnv(oldEnv);

    return result;
}

module.exports = callInModifiedEnv;
