var bootstrapInput = function (fig) {
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
        var labelText = fig.label ? wrap.labelOpen + fig.label + wrap.labelClose : '';

        var controlFig = fig.input || fig.select || fig.textarea;
        controlFig = fig.name ? union({ name: fig.name }, controlFig) : controlFig;

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
        exports = module.exports = bootstrapInput;
    }
    exports.bootstrapInput = bootstrapInput;
}
else {
    root.bootstrapInput = bootstrapInput;
}