const { expect } = require('chai');
const { diff, formats } = require('../src/');

describe('compare chars', function() {
	it('should compare chars at end of string', function() {
		const d = diff(
			'the quick red fox jumped',
			'the quick red fox swam',
			{ compare: 'chars' }
		);
		const { changes } = d;
		let change;

		expect(changes.length).to.equal(2);

		change = changes[0];

		// 2 char deleted at pos 18
		expect(change.lhs.at).to.equal(18);
		expect(change.lhs.del).to.be.equal(2);
		// 3 char added at pos 18
		expect(change.rhs.at).to.equal(18);
		expect(change.rhs.add).to.be.equal(3);

		change = changes[1];

		// 3 char deleted at pos 21
		expect(change.lhs.at).to.equal(21);
		expect(change.lhs.del).to.be.equal(3);
		// 0 char added at pos 21
		expect(change.rhs.at).to.equal(21);
		expect(change.rhs.add).to.be.equal(0);

		// this is actually different from GNU diff and I think the
		// reason is shift_boundaries.
		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'19,20c19,21',
				'< j',
				'< u',
				'---',
				'> s',
				'> w',
				'> a',
				'22,24d22',
				'< p',
				'< e',
				'< d',
				''
			].join('\n')
		);

		expect(changes[0].lhs.ctx.getPart(changes[0].lhs.at))
			.to.deep.equal({ text: 'j', pos: 18 });
	});

	it('should compare chars at start of string', function() {
		const { changes } = diff(
			'the quick red fox jumped',
			'The quick red fox jumped',
			{compare: 'chars'}
		);
		let change;

		expect(changes.length).to.equal(1);

		change = changes[0];

		expect(change.lhs.at).to.equal(0);
		expect(change.lhs.del).to.be.equal(1);

		expect(change.rhs.at).to.equal(0);
		expect(change.rhs.add).to.be.equal(1);
	});

	it('should compare change chars at end of string', function() {
		const { changes } = diff(
			'the quick red fox jumped',
			'the quick red fox Jumped',
			{compare: 'chars'}
		);
		let change;

		expect(changes.length).to.equal(1);

		change = changes[0];

		expect(change.lhs.at).to.equal(18);
		expect(change.lhs.del).to.be.equal(1);

		expect(change.rhs.at).to.equal(18);
		expect(change.rhs.add).to.be.equal(1);
	});

	it('should compare change chars in mid string', function() {
		const { changes } = diff(
			'the quick red fox jumped',
			'the quick RED fox jumped',
			{compare: 'chars'}
		);
		let change;

		expect(changes.length).to.equal(1);

		change = changes[0];

		expect(change.lhs.at).to.equal(10);
		expect(change.lhs.del).to.be.equal(3);

		expect(change.rhs.at).to.equal(10);
		expect(change.rhs.add).to.be.equal(3);
	});

	it('should compare add chars at start of string', function() {
		const { changes } = diff(
			'the quick red fox jumped',
			'*the quick red fox jumped',
			{compare: 'chars'}
		);
		let change;

		expect(changes.length).to.equal(1);

		change = changes[0];

		expect(change.lhs.at).to.equal(0);
		expect(change.lhs.del).to.be.equal(0);

		expect(change.rhs.at).to.equal(0);
		expect(change.rhs.add).to.be.equal(1);
	});

	it('should compare add chars at end of string', function() {
		const { changes } = diff(
			'the quick red fox jumped',
			'the quick red fox jumped*',
			{compare: 'chars'}
		);
		let change;

		expect(changes.length).to.equal(1);

		change = changes[0];

		expect(change.lhs.at).to.equal(23);
		expect(change.lhs.del).to.be.equal(0);

		expect(change.rhs.at).to.equal(24);
		expect(change.rhs.add).to.be.equal(1);
	});

	it('should compare del chars at start of string', function() {
		const { changes } = diff(
			'*the quick red fox jumped',
			'the quick red fox jumped',
			{compare: 'chars'}
		);
		let change;

		expect(changes.length).to.equal(1);

		change = changes[0];

		expect(change.lhs.at).to.equal(0);
		expect(change.lhs.del).to.be.equal(1);

		expect(change.rhs.at).to.equal(0);
		expect(change.rhs.add).to.be.equal(0);
	});

	it('should compare del chars at end of string', function() {
		const { changes } = diff(
			'the quick red fox jumped*',
			'the quick red fox jumped',
			{compare: 'chars'}
		);
		let change;

		expect(changes.length).to.equal(1);

		change = changes[0];

		expect(change.lhs.at).to.equal(24);
		expect(change.lhs.del).to.be.equal(1);

		expect(change.rhs.at).to.equal(23);
		expect(change.rhs.add).to.be.equal(0);
	});

	it('compare chars', function() {
		const { changes } = diff(
			'the quick red fox jumped',
			'the quick orange fox jumped',
			{compare: 'chars'}
		);

		expect(changes.length).to.equal(3);

		// adds an 'o' to the rhs
		expect(changes[0].lhs.at).to.equal(10);
		expect(changes[0].lhs.del).to.be.equal(0);
		expect(changes[0].rhs.at).to.equal(10);
		expect(changes[0].rhs.add).to.be.equal(1);

		// adds an 'ang' to the rhs
		expect(changes[1].lhs.at).to.equal(11);
		expect(changes[1].lhs.del).to.be.equal(0);
		expect(changes[1].rhs.at).to.equal(12);
		expect(changes[1].rhs.add).to.be.equal(3);

		// deletes a 'd' from the lhs
		expect(changes[2].lhs.at).to.equal(12);
		expect(changes[2].lhs.del).to.be.equal(1);
		expect(changes[2].rhs.at).to.equal(16);
		expect(changes[2].rhs.add).to.be.equal(0);
	});
});
