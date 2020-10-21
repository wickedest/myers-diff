const { expect } = require('chai');
const { diff, formats } = require('../src/');

describe('compare words', function() {
	it('should compare words at start of string', function() {
		const { changes } = diff(
			'the quick red fox jumped',
			'The quick red fox jumped',
			{compare: 'words'}
		);
		let change;

		expect(changes.length).to.equal(1);

		change = changes[0];

		// 1 word deleted at pos 0
		expect(change.lhs.at).to.equal(0);
		expect(change.lhs.del).to.be.equal(1);
		// 1 word added at pos 0
		expect(change.rhs.at).to.equal(0);
		expect(change.rhs.add).to.be.equal(1);
	});

	it('should compare words in mid string', function() {
		const { changes } = diff(
			'the quick red fox jumped',
			'the quick brown fox jumped',
			{compare: 'words'}
		);
		let change;

		expect(changes.length).to.equal(1);

		change = changes[0];

		// 1 word deleted at pos 2
		expect(change.lhs.at).to.equal(2);
		expect(change.lhs.del).to.be.equal(1);
		// 1 word added at pos 2
		expect(change.rhs.at).to.equal(2);
		expect(change.rhs.add).to.be.equal(1);

	});

	it('should compare words at end of string', function() {
		const d = diff(
			'the quick red fox jumped',
			'the quick red fox swam',
			{compare: 'words'}
		);
		const { changes } = d;
		let change;

		expect(changes.length).to.equal(1);

		change = changes[0];

		// 1 word deleted at pos 4
		expect(change.lhs.at).to.equal(4);
		expect(change.lhs.del).to.be.equal(1);
		// 1 word added at pos 4
		expect(change.rhs.at).to.equal(4);
		expect(change.rhs.add).to.be.equal(1);

		expect(change.lhs.ctx.getPart(change.lhs.at).text)
			.to.equal('jumped');
		expect(change.rhs.ctx.getPart(change.rhs.at).text)
			.to.equal('swam');

		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'5c5',
				'< jumped',
				'---',
				'> swam',
				''
			].join('\n')
		);
	});
});
