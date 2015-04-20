// form-input version 0.1.1
// https://github.com/DubFriend/form-input
// (MIT) 19-04-2015
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
var formInputGenerator = function (fig) {
    'use strict';

    fig = fig || {};

    var self = {};

    var feedbackOpen = fig.feedbackOpen  || '<span>';
    var feedbackClose = fig.feedbackClose  || '</span>';

    var labelOpen = fig.labelOpen  || '<label>';
    var labelClose = fig.labelClose  || '</label>';

    var groupOpen = fig.groupOpen  || '<div>';
    var groupClose = fig.groupClose  || '</div>';

    var groupControlOpen = fig.groupControlOpen  || '<div>';
    var groupControlClose = fig.groupControlClose  || '</div>';

    var resolveValueFromAttr = function (attr) {
        if(isObject(attr.value)) {
            if(
                attr.name !== undefined &&
                attr.value[attr.name] !== undefined
            ) {
                return attr.value[attr.name];
            }
        }
        else {
            return attr.value;
        }
    };

    var buildAttributes = function (attr) {
        return filterUndefined(mapToArray(attr, function (val, key) {
            var valueAttrValue;
            if(key === 'value') {
                valueAttrValue = resolveValueFromAttr(attr);
                if(valueAttrValue) {
                    return 'value="' + valueAttrValue + '"';
                }
            }
            else {
                return val === undefined ? key : key + '="' + val +'"';
            }
        })).join(' ');
    };

    self.feedback = function (fig, name, wrap) {
        wrap = wrap || {};
        wrap.feedbackOpen = wrap.feedbackOpen || feedbackOpen;
        wrap.feedbackClose = wrap.feedbackClose || feedbackClose;

        if(isObject(fig)) {
            if(fig[name]) {
                return self.feedback(fig[name]);
            }
            else {
                return '';
            }
        }
        else if(isArray(fig)) {
            return self.feedback('<ul>' + reduce(fig, function (carry, item) {
                return carry + '<li>' + item + '</li>';
            }, '') + '</ul>');
        }
        else {
            return wrap.feedbackOpen + fig + wrap.feedbackClose;
        }
    };

    self.input = function (attr) {
        if(isArray(attr.value)) {
            return reduce(attr.value, function (carry, value) {
                if(isObject(value)) {
                    return carry + '<label class="' + attr.type + '-inline">' +
                        value.label +
                        self.input(union(attr, { value: value.value })) +
                    '</label>';
                }
                else {
                    return carry + self.input(union(attr, { value: value }));
                }
            }, '');
        }
        else if(isArray(attr.checked) && inArray(attr.checked, attr.value)) {
            return self.input(union(attr, { checked: undefined }));
        }
        else if(attr.value !== undefined && attr.value === attr.checked) {
            return self.input(union(attr, { checked: undefined }));
        }
        else if(attr.checked !== undefined) {
            return self.input(excludedSet(attr, ['checked']));
        }
        else {
            return '<input ' + buildAttributes(attr) + '/>';
        }
    };

    self.select = function (attr) {
        var selected = resolveValueFromAttr(attr);
        var isOptionSelected = function (option) {
            return selected === option.value;
        };

        return '<select ' + buildAttributes(excludedSet(attr, ['options', 'value'])) + '>' +
            reduce(attr.options, function (carry, option) {
                return carry + '<option value="' + option.value + '"' +
                    (isOptionSelected(option) ? ' selected' : '') + '>' +
                    option.label +
                '</option>';
            }, '') +
        '</select>';
    };

    self.textarea = function (attr) {
        var value = resolveValueFromAttr(attr);
        return '<textarea ' + buildAttributes(excludedSet(attr, ['value'])) + '>' +
            (value ? value : '') +
        '</textarea>';
    };

    var isHTMLLabel = function (labelOpen) {
        return /^<label/i.test(labelOpen);
    };

    var addForAttributeToLabelOpen = function (labelOpen, attr) {
        if(isHTMLLabel(labelOpen) && attr.id !== undefined) {
            var pieces = labelOpen.split(/^<label/i);
            pieces.shift();
            pieces.unshift('<label for="' + attr.id + '"');
            return pieces.join('');
        }
        else {
            return labelOpen;
        }
    };

    self.group = function (fig) {
        var wrap = {};
        wrap.feedbackOpen = fig.feedbackOpen || feedbackOpen;
        wrap.feedbackClose = fig.feedbackClose || feedbackClose;
        wrap.labelOpen = fig.labelOpen || labelOpen;
        wrap.labelClose = fig.labelClose || labelClose;
        wrap.groupOpen = fig.groupOpen || groupOpen;
        wrap.groupClose = fig.groupClose || groupClose;
        wrap.groupControlOpen = fig.groupControlOpen || groupControlOpen;
        wrap.groupControlClose = fig.groupControlClose || groupControlClose;

        var feedbackText = fig.feedback ? self.feedback(fig.feedback, fig.name, wrap) : '';

        var controlFig = fig.input || fig.select || fig.textarea;
        controlFig = fig.name ? union({ name: fig.name }, controlFig) : controlFig;

        var labelText = fig.label ? addForAttributeToLabelOpen(wrap.labelOpen, controlFig) + fig.label + wrap.labelClose : '';

        var controlText;
        if(fig.input) {
            controlText = self.input(controlFig);
        }
        else if(fig.select) {
            controlText = self.select(controlFig);
        }
        else if(fig.textarea) {
            controlText = self.textarea(controlFig);
        }

        return wrap.groupOpen +
               labelText  +
               wrap.groupControlOpen +
               controlText +
               feedbackText +
               wrap.groupControlClose +
               wrap.groupClose;
    };

    return self;
};


if(typeof exports !== 'undefined') {
    if(typeof module !== 'undefined' && module.exports) {
        exports = module.exports = formInputGenerator;
    }
    exports.formInputGenerator = formInputGenerator;
}
else {
    root.formInputGenerator = formInputGenerator;
}
}).call(this);