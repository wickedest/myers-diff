# myers-diff

A javascript test differentiation implementation based on [An O(ND) Difference Algorithm and Its Variations (1986)](www.xmailserver.org/diff2.pdf).  It is a lightweight, no-frills implementation.

## Installation
	npm install myers-diff
or
	bower install myers-diff

## Example

```js
	const myers = require('myers-diff');

	const lhs = 'the quick red fox jumped\nover the hairy dog';
	const rhs = 'the quick brown fox jumped\nover the lazy dog';

	const diff = myers.diff(lhs, rhs, {});

	console.log(myers.formats.GnuNormalFormat(diff));
	console.log(diff);
	//
	// 1,2c1,2
	// < the quick red fox jumped
	// < over the hairy dog
	// ---
	// > the quick brown fox jumped
	// > over the lazy dog
```

## API

### myers.diff(_lhs_, _rhs_, _options_)

Compare `lhs` text to `rhs` text and returns an array of [`Change`](#change) items.  The `options` argument is defined as follows:

```js
	options: {
		compare: 'lines',			// lines|words|chars
		ignoreWhitespace: false,	// ignores white space
		splitLinesRegex: '\n',		// the regex to use when splitting lines
		splitWordsRegex: '[ ]{1}',	// the regex to use when splitting words
		splitCharsRegex: ''			// the regex to use when splitting chars
	}
```

### Change
```js
	Change: {
		lhs: {
			at: line_number,	// zero-based index
			del: count		  // >= 0,
			ctx: context		// diff Context
		},
		rhs: {
			at: line_number,	// zero-based index
			add: count		  // >= 0,
			ctx: context		// diff Context
		}
	}
```

Interpreting a `Change` item is as follows:

|del|add|description|
|-----|-----|----|
|0|>0|added `count` to rhs|
|>0|0|deleted `count` from lhs|
|>0|>0|changed `count` lines|

### Context



### Context.getLine(_n_)

Gets the value of line at zer-based index `n`.
