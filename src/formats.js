// NormalFormat
// http://www.gnu.org/software/diffutils/manual/html_node/Example-Normal.html#Example-Normal
function GnuNormalFormat(item) {
	const nf = [];
	const str = [];

	// del add description
	// 0   >0  added count to rhs
	// >0  0   deleted count from lhs
	// >0  >0  changed count lines
	let op;
	if (item.lhs.del === 0 && item.rhs.add > 0) {
		op = 'a';
	}
	else if (item.lhs.del > 0 && item.rhs.add === 0) {
		op = 'd';
	}
	else {
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
	for (let i = item.lhs.at; i < item.lhs.at + item.lhs.del; ++i) {
		nf.push('< ' + item.lhs.ctx.getPart(i).text);
	}
	if (item.rhs.add && item.lhs.del) {
		nf.push('---');
	}
	for (let i = item.rhs.at; i < item.rhs.at + item.rhs.add; ++i) {
		nf.push('> ' + item.rhs.ctx.getPart(i).text);
	}
	return nf.join('\n');
}

var formats = {
	GnuNormalFormat: function (items) {
		var i, out = [];
		for (i = 0; i < items.length; ++i) {
			out.push(GnuNormalFormat(items[i]));
		}
		return out.join('\n') + '\n';
	}
}

module.exports = formats;
