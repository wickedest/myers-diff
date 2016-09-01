import myers from '../dist';

var lhs = 'the quick red fox jumped\nover the hairy dog',
    rhs = 'the quick brown fox jumped\nover the lazy dog',
    _diff;

_diff = myers.diff(lhs, rhs, {});

console.log(myers.formats.GnuNormalFormat(_diff));

console.log(_diff);
