var bootstrapInputGenerator = require('../bootstrap-input');
exports.input = {
	setUp: function (done) {
		this.bootstrapInput = bootstrapInputGenerator();
		done();
	},

	inputBasic: function (test) {
		test.strictEqual(
			this.bootstrapInput.input({ a: 'b' }),
			'<input a="b"/>'
	    );
		test.done();
	},

	inputAttributeWithUndefinedValueDoesNotRenderValue: function (test) {
		test.strictEqual(
			this.bootstrapInput.input({ b: undefined }),
			'<input b/>'
	    );
		test.done();
	},

	inputPlucksValueAttributeFromName: function (test) {
		test.strictEqual(
			this.bootstrapInput.input({ 
				name: 'foo', 
				value: { a: 'a', foo: 'bar' }
			}),
			'<input name="foo" value="bar"/>'
		);
		test.done();
	},

	inputOmitsValueAttributeIfObjectAndCannotPluckFromName: function (test) {
		test.strictEqual(
			this.bootstrapInput.input({ 
				name: 'foo', 
				value: { a: 'a', b: 'bar' }
			}),
			'<input name="foo"/>'
		);
		test.done();
	},

	feedbackPassedString: function (test) {
		test.strictEqual(
			this.bootstrapInput.feedback('foo'),
			'<span>foo</span>'
		);
		test.done();
	},

	feedbackPassedArrayOfStrings: function (test) {
		test.strictEqual(
			this.bootstrapInput.feedback(['foo', 'bar']),
			'<span><ul><li>foo</li><li>bar</li></ul></span>'
		);
		test.done();
	},

	feedbackPassedObjectWithNameKeyNotFound: function (test) {
		test.strictEqual(
			this.bootstrapInput.feedback({ bar: 'baz' }, 'foo'),
			''
		);
		test.done();
	},

	feedbackPassedObjectWithNameKeyFoundString: function (test) {
		test.strictEqual(
			this.bootstrapInput.feedback({ foo: 'baz' }, 'foo'),
			'<span>baz</span>'
		);
		test.done();
	},

	feedbackPassedObjectWithNameKeyFoundArray: function (test) {
		test.strictEqual(
			this.bootstrapInput.feedback({ foo: ['a', 'b'] }, 'foo'),
			'<span><ul><li>a</li><li>b</li></ul></span>'
		);
		test.done();
	},

	feedbackCustomWrapperString: function (test) {
		var bootstrapInput = bootstrapInputGenerator({
			feedbackOpen: '{',
			feedbackClose: '}'
		});

		test.strictEqual(
			bootstrapInput.feedback('foo'),
			'{foo}'
		);
		test.done();
	},

	feedbackCustomWrapperArray: function (test) {
		var bootstrapInput = bootstrapInputGenerator({
			feedbackOpen: '{',
			feedbackClose: '}'
		});

		test.strictEqual(
			bootstrapInput.feedback(['a', 'b']),
			'{<ul><li>a</li><li>b</li></ul>}'
		);
		test.done();
	},

	inputGroupWithAName: function (test) {
		test.strictEqual(
			this.bootstrapInput.group({
				label: 'bar',
				name: 'foo',
				input: {
					value: { foo: 'b' }
				},
				feedback: { foo: 'c' }
			}),
			'<div>' +
				'<label>bar</label>' +
				'<div>' +
					'<input name="foo" value="b"/>' +
					'<span>c</span>' +
				'</div>' +
			'</div>'
		);
		test.done();
	}
};