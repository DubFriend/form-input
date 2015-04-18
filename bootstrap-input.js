// bootstrap-input version 0.0.0
// https://github.com/DubFriend/bootstrap-input
// (MIT) 18-04-2015
// Brian Detering
(function () {
'use strict'
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

var inverse = function (object) {
    var inverted = {};
    foreach(object, function (val, key) {
        inverted[val] = key;
    });
    return inverted;
};

var toInt = function (value) {
    return parseInt(value, 10);
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

var isEmpty = function (object) {
    for(var i in object) {
        if(object.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
};

var isNumeric = function (candidate) {
    return !isNaN(candidate);
};

var isInteger = function (candidate) {
    return isNumeric(candidate) && Number(candidate) % 1 === 0;
};

var indexOf = function (array, value) {
    return array.indexOf(value);
};

var inArray = function (array, value) {
    return indexOf(array, value) !== -1;
};

//deep copy of json objects
var copy = function (object) {
    return $.extend(true, {}, object);
};

var shallowCopy = function (objects) {
    return map(objects, identity);
};

var foreach = function (collection, callback) {
    for(var i in collection) {
        if(collection.hasOwnProperty(i)) {
            callback(collection[i], i, collection);
        }
    }
};

var range = function (a, b) {
    var i, start, end, array = [];
    if(b === undefined) {
        start = 0;
        end = a - 1;
    }
    else {
        start = a;
        end = b;
    }
    for(i = start; i <= end; i += 1) {
        array.push(i);
    }
    return array;
};

var reverse = function (array) {
    var reversed = [], i;
    for(i = array.length - 1; i >= 0; i -= 1) {
        reversed.push(array[i]);
    }
    return reversed;
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

var appendKey = function (appendingString, collection) {
    return map(collection, identity, function (key) {
        return appendingString + key;
    });
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

var call = function (collection, functionName, args) {
    return map(collection, function (object, name) {
        return object[functionName].apply(object, args || []);
    });
};

var keys = function (collection) {
    return mapToArray(collection, function (val, key) {
        return key;
    });
};

var values = function (collection) {
    return mapToArray(collection, function (val) {
        return val;
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

var filterFalsey = function (collection) {
    return filter(collection, function (val) {
        return val;
    });
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

var subSet = function (object, subsetKeys) {
    return filter(object, function (value, key) {
        return indexOf(subsetKeys, key) !== -1;
    });
};

var doesContainKeys = function (object, keyNames) {
    return keys(subSet(object, keyNames)).length === keyNames.length;
};

var excludedSet = function (object, excludedKeys) {
    return filter(object, function (value, key) {
        return indexOf(excludedKeys, key) === -1;
    });
};

var remove = function (collection, item) {
    return filter(collection, function (element) {
        return element !== item;
    });
};

var generateUniqueID = (function () {
    var count = 0;
    return function () {
        return count += 1;
    };
}());

var mixinPubSub = function (object) {
    object = object || {};
    var topics = {};

    object.publish = function (topic, data) {
        foreach(topics[topic], function (callback) {
            callback(data);
        });
    };

    object.subscribe = function (topic, callback) {
        topics[topic] = topics[topic] || [];
        topics[topic].push(callback);
    };

    object.unsubscribe = function (callback) {
        foreach(topics, function (subscribers) {
            var index = indexOf(subscribers, callback);
            if(index !== -1) {
                subscribers.splice(index, 1);
            }
        });
    };

    return object;
};

var self = {
	input: function (fig) {
		var attr = fig.attr;
		return '<input ' + filterUndefined(mapToArray(attr, function (val, key) {
			if(key === 'value' && isObject(val)) {
				if(
					attr['name'] !== undefined &&
					val[attr['name']] !== undefined
				) {
					return key + '="' + val[attr['name']] + '"';
				}
			}
			else {
				return val === undefined ? key : key + '="' + val +'"';
			}
		})).join(' ') + '/>';
	}
};

if(typeof exports !== 'undefined') {
	if(typeof module !== 'undefined' && module.exports) {
		exports = module.exports = self;
	}
	exports.bootstrapInput = self;
} 
else {
	root.bootstrapInput = self;
}
}).call(this);