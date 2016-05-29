var myers = require('../'),
    formats = require('../src/formats');

var lhs = 'the quick red fox jumped\nover the hairy dog',
    rhs = 'the quick brown fox jumped\nover the lazy dog',
    diff;

diff = myers.diff(lhs, rhs, {});

console.log(formats.GnuNormalFormat(diff));

console.log(diff);