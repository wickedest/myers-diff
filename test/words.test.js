const { expect } = require('chai');
const { diff, formats, changed } = require('../src/');

describe('compare words', function() {
	it('should compare words at start of string', function() {
		const changes = diff(
			'the quick red fox jumped',
			'The quick red fox jumped',
			{compare: 'words'}
		);

		expect(changes.length).to.equal(1);
		const [ first ] = changes;
		// delete: 'the'
		expect(changed(first.lhs)).to.be.true;
		expect(first.lhs).to.deep.include({
			at: 0, // part
			del: 1, // parts deleted
			pos: 0, // index
			text: 'the',
			length: 3 // chars
		});
		// add: 'The'
		expect(changed(first.rhs)).to.be.true;
		expect(first.rhs).to.deep.include({
			at: 0, // part
			add: 1, // parts added
			pos: 0, // index
			text: 'The',
			length: 3 // chars
		});

		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'1c1',
				'< the',
				'---',
				'> The'
			].join('\n')
		);
	});

	it('should compare words in mid string', function() {
		const changes = diff(
			'the quick red fox jumped',
			'the quick brown fox jumped',
			{compare: 'words'}
		);

		expect(changes.length).to.equal(1);
		const [ first ] = changes;
		// delete: 'red'
		expect(changed(first.lhs)).to.be.true;
		expect(first.lhs).to.deep.include({
			at: 2, // part
			del: 1, // parts deleted
			pos: 10, // index
			text: 'red',
			length: 3 // chars
		});
		// add: 'brown'
		expect(changed(first.rhs)).to.be.true;
		expect(first.rhs).to.deep.include({
			at: 2, // part
			add: 1, // parts added
			pos: 10, // index
			text: 'brown',
			length: 5 // chars
		});

		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'3c3',
				'< red',
				'---',
				'> brown'
			].join('\n')
		);
	});

	it('should compare words at end of string', function() {
		const changes = diff(
			'the quick red fox jumped',
			'the quick red fox swam',
			{compare: 'words'}
		);

		expect(changes.length).to.equal(1);
		const [ first ] = changes;
		// delete: 'red'
		expect(changed(first.lhs)).to.be.true;
		expect(first.lhs).to.deep.include({
			at: 4, // part
			del: 1, // parts deleted
			pos: 18, // index
			text: 'jumped',
			length: 6 // chars
		});
		// add: 'brown'
		expect(changed(first.rhs)).to.be.true;
		expect(first.rhs).to.deep.include({
			at: 4, // part
			add: 1, // parts added
			pos: 18, // index
			text: 'swam',
			length: 4 // chars
		});

		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'5c5',
				'< jumped',
				'---',
				'> swam'
			].join('\n')
		);
	});

	it('should compare multiple words added at start of string', function() {
		const changes = diff(
			'the quick red fox jumped',
			'The scared quick red fox jumped',
			{compare: 'words'}
		);

		expect(changes.length).to.equal(1);
		const [ first ] = changes;
		// delete: 'the'
		expect(changed(first.lhs)).to.be.true;
		expect(first.lhs).to.deep.include({
			at: 0, // part
			del: 1, // parts deleted
			pos: 0, // index
			text: 'the',
			length: 3 // chars
		});
		// add: 'The scared'
		expect(changed(first.rhs)).to.be.true;
		expect(first.rhs).to.deep.include({
			at: 0, // part
			add: 2, // parts added
			pos: 0, // index
			text: 'The',
			length: 10 // chars
		});

		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'1c1,2',
				'< the',
				'---',
				'> The',
				'> scared'
			].join('\n')
		);
	});

	it('should compare multiple words deleted at start of string', function() {
		const changes = diff(
			'The scared quick red fox jumped',
			'the quick red fox jumped',
			{compare: 'words'}
		);

		expect(changes.length).to.equal(1);
		const [ first ] = changes;
		// delete: 'The scared'
		expect(changed(first.lhs)).to.be.true;
		expect(first.lhs).to.deep.include({
			at: 0, // part
			del: 2, // parts deleted
			pos: 0, // index
			text: 'The',
			length: 10 // chars
		});
		// add: 'the'
		expect(changed(first.rhs)).to.be.true;
		expect(first.rhs).to.deep.include({
			at: 0, // part
			add: 1, // parts added
			pos: 0, // index
			text: 'the',
			length: 3 // chars
		});

		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'1,2c1',
				'< The',
				'< scared',
				'---',
				'> the'
			].join('\n')
		);
	});

	it('should compare an added line', function() {
		const changes = diff(
			'',
			'The quick red fox jumped',
			{compare: 'words'}
		);

		expect(changes.length).to.equal(1);
		const [ first ] = changes;
		// delete: nothing
		expect(changed(first.lhs)).to.be.false;
		expect(first.lhs).to.deep.include({
			at: 0, // part
			del: 0, // parts deleted
			pos: null, // index
			text: null,
			length: 0 // chars
		});
		// add: 'The scared'
		expect(changed(first.rhs)).to.be.true;
		expect(first.rhs).to.deep.include({
			at: 0, // part
			add: 5, // parts added
			pos: 0, // index
			text: 'The',
			length: 24 // chars
		});

		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'1a1,5',
				'> The',
				'> quick',
				'> red',
				'> fox',
				'> jumped'
			].join('\n')
		);
	});

	it('should compare a deleted line', function() {
		const changes = diff(
			'The quick red fox jumped',
			'',
			{compare: 'words'}
		);

		expect(changes.length).to.equal(1);
		const [ first ] = changes;
		// delete: nothing
		expect(changed(first.lhs)).to.be.true;
		expect(first.lhs).to.deep.include({
			at: 0, // part
			del: 5, // parts deleted
			pos: 0, // index
			text: 'The',
			length: 24 // chars
		});
		// add: 'The scared'
		expect(changed(first.rhs)).to.be.false;
		expect(first.rhs).to.deep.include({
			at: 0, // part
			add: 0, // parts added
			pos: null, // index
			text: null,
			length: 0 // chars
		});

		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'1,5d1',
				'< The',
				'< quick',
				'< red',
				'< fox',
				'< jumped'
			].join('\n')
		);
	});
});
