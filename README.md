#Form Input

Renders form inputs and form input groups with feedback.

Can be used in the browser or with npm.

`npm install form-input`

```javascript
var formInput = require('form-input')();
```

```html
<script src="form-input.js"></script>
<script>
	var formInput = window.formInputGenerator();
</script>
```

##Input
Set Attributes, Set Value to undefined for an attribute without a value.
```javascript
formInput.input({ type:'text', name: 'foo', 'data-foo': undefined });
```
```html
<input type="text" name="foo" data-foo/>
```

If given a value and "name" attribute, and the value is an object with a key
of the same value as the "name" attribute, the "name" value will be used.
```javascript
formInput.input({
	type:'text',
	name: 'foo',
	value: { foo: 'a', bar: 'b' }
});
```
```html
<input type="text" name="foo" value="a"/>
```

If passed a value attribute with an array of values, the input will be repeated
for each value.
```javascript
formInput.input({
	type:'checkbox',
	name: 'foo[]',
	value: ['a', 'b']
});
```
```html
<input type="checkbox" name="foo[]" value="a"/>
<input type="checkbox" name="foo[]" value="b"/>
```

If passed a array value attribute and a checked attribute, the matching checked
values will be given a "checked" attribute.
```javascript
formInput.input({
	type: 'radio',
	value: ['a', 'b'],
	checked: 'b'
});
```
```html
<input type="radio" value="a"/>
<input type="radio" value="b" checked/>
```

If passed a array value attribute and an array checked attribute, the matching checked
values will be given a "checked" attribute.
```javascript
formInput.input({
	type: 'checkbox',
	value: ['a', 'b', 'c'],
	checked: ['a', 'b']
});
```
```html
<input type="checkbox" value="a" checked/>
<input type="checkbox" value="b" checked/>
<input type="checkbox" value="c"/>
```

If passed a value attribute that is an array of objects, the input will be wrapped
in a label attribute which is given a class name of "[type]-inline".
```javascript
formInput.input({
	type:'checkbox',
	name: 'foo[]',
	value: ['a', 'b']
});
```
```html
<label class="checkbox-inline">
	foo
	<input type="checkbox" name="foo[]" value="a"/>
</label>
<label class="checkbox-inline">
	bar
	<input type="checkbox" name="foo[]" value="b"/>
</label>
```



##Select
`select` follows simmilar logic to `input` regarding the interaction of name and
value attributes.
```javascript
formInput.select({
	name: 'foo',
	options: [
		{ label: 'bar', value: 'b' },
		{ label: 'foo', value: 'a' }
	],
	value: { foo: 'a' }
})
```
```html
<select name="foo">
	<option value="b">bar</option>
	<option value="a" selected>foo</option>
</select>
```



##Textarea
`textarea` follows simmilar logic to `input` regarding the interaction of name
and value attributes.
```javascript
formInput.textarea({
	name: 'foo',
	value: { foo: 'bar' }
})
```
```html
<textarea name="foo">bar</textarea>
```



##Feedback
`feedback` may be used to render error or success messages next to form inputs.
```javascript
formInput.feedback('foo')
```
```html
<span>foo</span>
```

Feedback may be passed an array of strings that will be rendered with an unordered
list.
```javascript
formInput.feedback(['foo', 'bar'])
```
```html
<span>
	<ul>
		<li>foo</li>
		<li>bar</li>
	</ul>
</span>
```

If Feedback is passed an object and name parameter it will pluck the appropriate
name from the value object.
```javascript
formInput.feedback({ foo: 'baz' }, 'foo')
```
```html
<span>baz</span>
```

If the object does contain the named value, feedback will return an empty string.
```javascript
//returns empty string
formInput.feedback({ foo: 'baz' }, 'bar')
```


##Group
Groups labels, inputs and feedback in an html structure.

Group can take `input`, `select`, `textarea`, and `feedback` properties which will
behave the same as their counterpart methods documented above.

The name attribute can be pulled to the top level of the configuration, and will
be used by input and feedback as shown below.
```javascript
formInput.group({
	label: 'bar',
	name: 'foo',
	input: {
		value: { foo: 'b' }
	},
	feedback: { foo: 'c' }
})
```
```html
<div>
	<label>bar</label>
	<div>
		<input name="foo" value="b"/>
		<span>c</span>
	</div>
</div>
```

An example using a `select` input
```javascript
formInput.group({
	label: 'bar',
	name: 'foo',
	select: {
		options: [
			{ value: 'a', label: 'A' },
			{ value: 'b', label: 'B' }
		]
		value: { foo: 'a' }
	}
})
```
```html
<div>
	<label>bar</label>
	<div>
		<select name="foo">
			<option value="a" selected>A</option>
			<option value="b">B</option>
		</select>
	</div>
</div>
```

If the label is recognized as an html type label tag, and the input is given an
id attribute, then the label will be given a matching "for" attribute
```javascript
formInput.group({
	label: 'bar',
	input: { id: 'foo' }
})
```
```html
<div>
	<label for="foo">bar</label>
	<div>
		<input id="foo"/>
	</div>
</div>
```


##Custom open and close tags
Most of the closing an opening tags can be overriden
either globally
```javascript
var formInput = require('form-input')({
	groupOpen: '<group>',
	groupClose: '</group>'
});
```
Or when calling the feedback or group methods
```javascript
formInput.feedback('foo', undefined, {
	feedbackOpen: '<feedback>',
	feedbackClose: '</feedback>'
});
```

Here is an example that overrides all available open and close tags.
```javascript
formInput.group({
	feedback: 'bar',
	feedbackOpen: '<feedback>',
	feedbackClose: '</feedback>',
	labelOpen: '<foo-label>',
	labelClose: '</foo-label>',
	groupOpen: '<group>',
	groupClose: '</group>',
	groupControlOpen: '<group-control>',
	groupControlClose: '</group-control>',

	label: 'foo',
	input: { a: 'b' }
});
```
```xml
<group>
	<foo-label>foo</foo-label>
	<group-control>
		<input a="b"/>
		<feedback>bar</feedback>
	</group-control>
</group>
```