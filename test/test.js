var formInputGenerator = require('../form-input');
exports.input = {
	setUp: function (done) {
		this.formInput = formInputGenerator();
		done();
	},

	inputBasic: function (test) {
		test.strictEqual(
			this.formInput.input({ a: 'b' }),
			'<input a="b"/>'
	    );
		test.done();
	},

	inputAttributeWithUndefinedValueDoesNotRenderValue: function (test) {
		test.strictEqual(
			this.formInput.input({ b: undefined }),
			'<input b/>'
	    );
		test.done();
	},

	inputPlucksValueAttributeFromName: function (test) {
		test.strictEqual(
			this.formInput.input({
				name: 'foo',
				value: { a: 'a', foo: 'bar' }
			}),
			'<input name="foo" value="bar"/>'
		);
		test.done();
	},

	inputOmitsValueAttributeIfObjectAndCannotPluckFromName: function (test) {
		test.strictEqual(
			this.formInput.input({
				name: 'foo',
				value: { a: 'a', b: 'bar' }
			}),
			'<input name="foo"/>'
		);
		test.done();
	},

	selectBasic: function (test) {
		test.strictEqual(
			this.formInput.select({
				a: 'b',
				options: [{ label: 'foo', value: 'a' }]
			}),
			'<select a="b">' +
				'<option value="a">foo</option>' +
			'</select>'
		);
		test.done();
	},

	selectWithValue: function (test) {
		test.strictEqual(
			this.formInput.select({
				options: [
					{ label: 'bar', value: 'b' },
					{ label: 'foo', value: 'a' }
				],
				value: 'a'
			}),
			'<select >' +
				'<option value="b">bar</option>' +
				'<option value="a" selected>foo</option>' +
			'</select>'
		);
		test.done();
	},

	selectWithPluckedValue: function (test) {
		test.strictEqual(
			this.formInput.select({
				name: 'foo',
				options: [
					{ label: 'bar', value: 'b' },
					{ label: 'foo', value: 'a' }
				],
				value: { foo: 'a' }
			}),
			'<select name="foo">' +
				'<option value="b">bar</option>' +
				'<option value="a" selected>foo</option>' +
			'</select>'
		);
		test.done();
	},

	textAreaWithValue: function (test) {
		test.strictEqual(
			this.formInput.textarea({
				name: 'foo',
				value: { foo: 'bar' }
			}),
			'<textarea name="foo">bar</textarea>'
		);
		test.done();
	},

	inputWithArrayOfValuesAndChecked: function (test) {
		test.strictEqual(
			this.formInput.input({
				value: ['a', 'b'],
				checked: 'b'
			}),
			'<input value="a"/>' +
			'<input value="b" checked/>'
		);
		test.done();
	},

	inputWithArrayOfValuesAndArrayOfChecked: function (test) {
		test.strictEqual(
			this.formInput.input({
				value: ['a', 'b', 'c'],
				checked: ['a', 'c']
			}),
			'<input value="a" checked/>' +
			'<input value="b"/>' +
			'<input value="c" checked/>'
		);
		test.done();
	},

	inputsWithArrayOfLabeledValues: function (test) {
		test.strictEqual(
			this.formInput.input({
				type: 'baz',
				value: [
					{ label: 'foo', value: 'a' },
					{ label: 'bar', value: 'b' }
				]
			}),
			'<label class="baz-inline">' +
				'foo' +
				'<input type="baz" value="a"/>' +
			'</label>' +
			'<label class="baz-inline">' +
				'bar' +
				'<input type="baz" value="b"/>' +
			'</label>'
		);
		test.done();
	},

	feedbackPassedString: function (test) {
		test.strictEqual(
			this.formInput.feedback('foo'),
			'<span>foo</span>'
		);
		test.done();
	},

	feedbackPassedArrayOfStrings: function (test) {
		test.strictEqual(
			this.formInput.feedback(['foo', 'bar']),
			'<span><ul><li>foo</li><li>bar</li></ul></span>'
		);
		test.done();
	},

	feedbackPassedObjectWithNameKeyNotFound: function (test) {
		test.strictEqual(
			this.formInput.feedback({ bar: 'baz' }, 'foo'),
			''
		);
		test.done();
	},

	feedbackPassedObjectWithNameKeyFoundString: function (test) {
		test.strictEqual(
			this.formInput.feedback({ foo: 'baz' }, 'foo'),
			'<span>baz</span>'
		);
		test.done();
	},

	feedbackPassedObjectWithNameKeyFoundArray: function (test) {
		test.strictEqual(
			this.formInput.feedback({ foo: ['a', 'b'] }, 'foo'),
			'<span><ul><li>a</li><li>b</li></ul></span>'
		);
		test.done();
	},

	feedbackCustomWrapperString: function (test) {
		var formInput = formInputGenerator({
			feedbackOpen: '{',
			feedbackClose: '}'
		});

		test.strictEqual(
			formInput.feedback('foo'),
			'{foo}'
		);
		test.done();
	},

	feedbackCustomWrapperArray: function (test) {
		var formInput = formInputGenerator({
			feedbackOpen: '{',
			feedbackClose: '}'
		});

		test.strictEqual(
			formInput.feedback(['a', 'b']),
			'{<ul><li>a</li><li>b</li></ul>}'
		);
		test.done();
	},

	feedbackPassedCustomWrapper: function (test) {
		test.strictEqual(
			this.formInput.feedback('foo', undefined, {
				feedbackOpen: '<feedback>',
				feedbackClose: '</feedback>'
			}),
			'<feedback>foo</feedback>'
		);
		test.done();
	},

	inputGroupWithNameAndFeedback: function (test) {
		test.strictEqual(
			this.formInput.group({
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
	},

	selectGroupWithName: function (test) {
		test.strictEqual(
			this.formInput.group({
				label: 'bar',
				name: 'foo',
				select: {
					options: [
						{ label: 'bar', value: 'b' },
						{ label: 'foo', value: 'a' }
					],
					value: 'a'
				}
			}),
			'<div>' +
				'<label>bar</label>' +
				'<div>' +
					'<select name="foo">' +
						'<option value="b">bar</option>' +
						'<option value="a" selected>foo</option>' +
					'</select>' +
				'</div>' +
			'</div>'
		);
		test.done();
	},

	textareaGroupWithName: function (test) {
		test.strictEqual(
			this.formInput.group({
				label: 'bar',
				name: 'foo',
				textarea: { value: 'a' }
			}),
			'<div>' +
				'<label>bar</label>' +
				'<div>' +
					'<textarea name="foo">a</textarea>' +
				'</div>' +
			'</div>'
		);
		test.done();
	},

	groupWithCustomOpenAndClose: function (test) {
		test.strictEqual(
			this.formInput.group({
				label: 'foo',
				input: { a: 'b' },
				feedback: 'bar',
				feedbackOpen: '<feedback>',
				feedbackClose: '</feedback>',
				labelOpen: '<foo-label>',
				labelClose: '</foo-label>',
				groupOpen: '<group>',
				groupClose: '</group>',
				groupControlOpen: '<group-control>',
				groupControlClose: '</group-control>'
			}),
			'<group>' +
				'<foo-label>foo</foo-label>' +
				'<group-control>' +
					'<input a="b"/>' +
					'<feedback>bar</feedback>' +
				'</group-control>' +
			'</group>'
		);
		test.done();
	}
};