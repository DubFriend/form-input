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