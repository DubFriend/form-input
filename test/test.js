var bootstrapInput = require('../bootstrap-input');
exports.input = {
	setUp: function (done) {
		done();
	},

	inputBasic: function (test) {
		test.strictEqual(
			bootstrapInput.input({ attr: { a: 'b' }}),
			'<input a="b"/>'
	    );
		test.done();
	},

	inputAttributeWithUndefinedValueDoesNotRenderValue: function (test) {
		test.strictEqual(
			bootstrapInput.input({ attr: { b: undefined } }),
			'<input b/>'
	    );
		test.done();
	},

	inputPlucksValueAttributeFromName: function (test) {
		test.strictEqual(
			bootstrapInput.input({ attr: { 
				name: 'foo', 
				value: { a: 'a', foo: 'bar' }
			}}),
			'<input name="foo" value="bar"/>'
		);
		test.done();
	},

	inputOmitsValueAttributeIfObjectAndCannotPluckFromName: function (test) {
		test.strictEqual(
			bootstrapInput.input({ attr: { 
				name: 'foo', 
				value: { a: 'a', b: 'bar' }
			}}),
			'<input name="foo"/>'
		);
		test.done();
	}
};