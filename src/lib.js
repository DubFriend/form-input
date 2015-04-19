var identity = function (x) {
    return x;
};

var isArray = function (value) {
    return Object.prototype.toString.call(value) === '[object Array]';
};

var isObject = function (value) {
    return !isArray(value) && (value instanceof Object);
};

var isFunction = function (value) {
    return value instanceof Function;
};

var bind = function (f, object) {
    return function () {
        return f.apply(object, arguments);
    };
};

var partial = function (f) {
    var args = Array.prototype.slice.call(arguments, 1);
    if(isFunction(f)) {
        return function () {
            var remainingArgs = Array.prototype.slice.call(arguments);
            return f.apply(null, args.concat(remainingArgs));
        };
    }
};

var argumentsToArray = function (args) {
    var array = [], i;
    for(i = 0; i < args.length; i += 1) {
        array.push(args[i]);
    }
    return array;
};

var indexOf = function (array, value) {
    return array.indexOf(value);
};

var inArray = function (array, value) {
    return indexOf(array, value) !== -1;
};

var foreach = function (collection, callback) {
    for(var i in collection) {
        if(collection.hasOwnProperty(i)) {
            callback(collection[i], i, collection);
        }
    }
};

var last = function (array) {
    return array[array.length - 1];
};

var mapToArray = function (collection, callback) {
    var mapped = [];
    foreach(collection, function (value, key, coll) {
        mapped.push(callback(value, key, coll));
    });
    return mapped;
};

var mapToObject = function (collection, callback, keyCallback) {
    var mapped = {};
    foreach(collection, function (value, key, coll) {
        key = keyCallback ? keyCallback(key, value) : key;
        mapped[key] = callback(value, key, coll);
    });
    return mapped;
};

var map = function (collection, callback, keyCallback) {
    return isArray(collection) ?
        mapToArray(collection, callback) :
        mapToObject(collection, callback, keyCallback);
};

var pluck = function(collection, key) {
    return map(collection, function (value) {
        return value[key];
    });
};

var reduce = function (collection, callback, initialAccumulation) {
    var accumulation = initialAccumulation;
    foreach(collection, function (val, key) {
        accumulation = callback(accumulation, val, key, collection);
    });
    return accumulation;
};

var filter = function (collection, callback) {
    var filtered;

    if(isArray(collection)) {
        filtered = [];
        foreach(collection, function (val, key, coll) {
            if(callback(val, key, coll)) {
                filtered.push(val);
            }
        });
    }
    else {
        filtered = {};
        foreach(collection, function (val, key, coll) {
            if(callback(val, key, coll)) {
                filtered[key] = val;
            }
        });
    }

    return filtered;
};

var filterUndefined = function (collection) {
    return filter(collection, function (val) {
        return val !== undefined;
    });
};

var union = function () {
    var united = {}, i;
    for(i = 0; i < arguments.length; i += 1) {
        foreach(arguments[i], function (value, key) {
            united[key] = value;
        });
    }
    return united;
};

var excludedSet = function (object, excludedKeys) {
    return filter(object, function (value, key) {
        return indexOf(excludedKeys, key) === -1;
    });
};

var generateUniqueID = (function () {
    var count = 0;
    return function () {
        return count += 1;
    };
}());