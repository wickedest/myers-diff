// NormalFormat
// http://www.gnu.org/software/diffutils/manual/html_node/Example-Normal.html#Example-Normal
function GnuNormalFormat (item) {
    var i, nf = [], op = 'c', lhs_str = '', rhs_str = '';

    if (item.lhs.del == 0 && item.rhs.add > 0) {
        op = 'a';
    }
    else if (item.lhs.del > 0 && item.rhs.add == 0) {
        op = 'd';
    }
    else {
        op = 'c';
    }

    if (item.lhs.del == 1) {
        lhs_str = item.lhs.at + 1;
    }
    else if (item.lhs.del == 0) {
        lhs_str = item.lhs.at;
    }
    else {
        lhs_str = (item.lhs.at + 1) + ',' + (item.lhs.at + item.lhs.del);
    }

    if (item.rhs.add == 1) {
        rhs_str = item.lhs.at + 1;
    }
    else if (item.rhs.add == 0) {
        rhs_str = item.lhs.at;
    }
    else {
        rhs_str = (item.lhs.at + 1) + ',' + (item.lhs.at + item.rhs.add);
    }

    nf.push(lhs_str + op + rhs_str);

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

module.exports = {
    GnuNormalFormat: function (items) {
        var i, out = [];
        for (i = 0; i < items.length; ++i) {
            out.push(GnuNormalFormat(items[i]));
        }
        return out.join('\n') + '\n';
    }
}
