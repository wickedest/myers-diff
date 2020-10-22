# myers-diff

A javascript test differentiation implementation based on [An O(ND) Difference Algorithm and Its Variations (1986)](www.xmailserver.org/diff2.pdf).  It is a lightweight, no-frills implementation.

## Installation
```bash
$ npm install myers-diff
```

## Basic usage

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
{{>main}}
