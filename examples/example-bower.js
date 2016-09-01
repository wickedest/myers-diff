const myers = require('../dist').default;

const lhs = 'the quick red fox jumped\nover the hairy dog',
    rhs = 'the quick brown fox jumped\nover the lazy dog';

let diff = myers.diff(lhs, rhs, {});

console.log(myers.formats.GnuNormalFormat(diff));

console.log(diff);
