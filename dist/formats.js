'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// NormalFormat
// http://www.gnu.org/software/diffutils/manual/html_node/Example-Normal.html#Example-Normal
function _GnuNormalFormat(item) {
    var i,
        nf = [],
        op,
        str = [];

    // del add description
    // 0   >0  added count to rhs
    // >0  0   deleted count from lhs
    // >0  >0  changed count lines
    if (item.lhs.del === 0 && item.rhs.add > 0) {
        op = 'a';
    } else if (item.lhs.del > 0 && item.rhs.add === 0) {
        op = 'd';
    } else {
        op = 'c';
    }

    function encodeSide(side, key) {
        // encode side as a start,stop if a range
        str.push(side.at + 1);
        if (side[key] > 1) {
            str.push(',');
            str.push(side[key] + side.at);
        }
    }
    encodeSide(item.lhs, 'del');
    str.push(op);
    encodeSide(item.rhs, 'add');

    nf.push(str.join(''));
    for (i = item.lhs.at; i < item.lhs.at + item.lhs.del; ++i) {
        nf.push('< ' + item.lhs.ctx.getLine(i));
    }
    if (item.rhs.add && item.lhs.del) {
        nf.push('---');
    }
    for (i = item.rhs.at; i < item.rhs.at + item.rhs.add; ++i) {
        nf.push('> ' + item.rhs.ctx.getLine(i));
    }
    return nf.join('\n');
}

var formats = {
    GnuNormalFormat: function GnuNormalFormat(items) {
        var i,
            out = [];
        for (i = 0; i < items.length; ++i) {
            out.push(_GnuNormalFormat(items[i]));
        }
        return out.join('\n') + '\n';
    }
};

exports.default = formats;