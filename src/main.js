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

    self.feedback = function (fig, name) {
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
            return feedbackOpen + fig + feedbackClose;    
        }
    };
    
    self.input = function (attr) {
        return '<input ' + filterUndefined(mapToArray(attr, function (val, key) {
            if(key === 'value' && isObject(val)) {
                if(
                    attr.name !== undefined &&
                    val[attr.name] !== undefined
                ) {
                    return key + '="' + val[attr['name']] + '"';
                }
            }
            else {
                return val === undefined ? key : key + '="' + val +'"';
            }
        })).join(' ') + '/>';
    };

    self.group = function (fig) {
        var controlFig = fig.name ? union({ name: fig.name }, fig.input) : fig.input;
        var controlText = self.input(controlFig);
        var feedbackText = fig.feedback ? self.feedback(fig.feedback, fig.name) : '';
        var labelText = fig.label ? labelOpen + fig.label + labelClose : '';

        return groupOpen + 
               labelText +
               groupControlOpen +
               controlText +
               feedbackText +
               groupControlClose +
               groupClose;
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