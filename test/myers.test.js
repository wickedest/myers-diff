const fs = require('fs');
const { expect } = require('chai');
const { diff, formats, changed } = require('../src/');

describe('#diff', function() {
	it('should throw illegal argument "lhs"', function() {
		expect(diff).to.throw(Error, /illegal argument 'lhs'/);
	});

	it('should throw illegal argument "rhs"', function() {
		expect(diff.bind(diff, 'lhs')).to.throw(Error, /illegal argument 'rhs'/);
	});

	it('should compare one line, no changes', function() {
		const changes = diff(
			'the quick red fox jumped',
			'the quick red fox jumped'
		);
		expect(changes.length).to.equal(0);
	});

	it('should compare two lines, no changes', function() {
		const changes = diff(
			'the quick red fox jumped\nover the lazy dog',
			'the quick red fox jumped\nover the lazy dog'
		);
		expect(changes.length).to.equal(0);
	});

	it('should compare one line changed', function() {
		const changes = diff(
			'the quick red fox jumped', 
			'the quick brown fox jumped'
		);

		expect(changes).to.have.length(1);
		const [ first ] = changes;
		expect(changed(first.lhs)).to.be.true;
		expect(first.lhs).to.deep.include({
			at: 0, // part
			del: 1, // parts deleted
			pos: 0, // index
			text: 'the quick red fox jumped',
			length: 24 // chars
		});
		expect(changed(first.rhs)).to.be.true;
		expect(first.rhs).to.deep.include({
			at: 0, // part
			add: 1, // parts added
			pos: 0, // index
			text: 'the quick brown fox jumped',
			length: 26 // chars
		});
		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'1c1',
				'< the quick red fox jumped',
				'---',
				'> the quick brown fox jumped'
			].join('\n')
		);
	});

	it('should compare one line added', function() {
		const changes = diff(
			'the quick red fox jumped', 
			'the quick red fox jumped\nover the lazy dog'
		);

		expect(changes).to.have.length(1);
		const [ first ] = changes;
		expect(changed(first.lhs)).to.be.false;
		expect(first.lhs).to.deep.include({
			at: 0, // part
			del: 0, // parts deleted
			pos: 0, // index
			text: 'the quick red fox jumped',
			length: 0 // chars
		});
		expect(changed(first.rhs)).to.be.true;
		expect(first.rhs).to.deep.include({
			at: 1, // part
			add: 1, // parts added
			pos: 25, // index
			text: 'over the lazy dog',
			length: 17 // chars
		});
		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'1a2',
				'> over the lazy dog'
			].join('\n')
		);
	});

	it('should compare one line removed', function() {
		const changes = diff(
			'the quick red fox jumped\nover the hairy dog',
			'the quick red fox jumped'
		);

		expect(changes).to.have.length(1);
		const [ first ] = changes;
		expect(changed(first.lhs)).to.be.true;
		expect(first.lhs).to.deep.include({
			at: 1, // part
			del: 1, // parts deleted
			pos: 25, // index
			text: 'over the hairy dog',
			length: 18 // chars
		});
		expect(changed(first.rhs)).to.be.false;
		expect(first.rhs).to.deep.include({
			at: 0, // part
			add: 0, // parts added
			pos: 0, // index
			text: 'the quick red fox jumped',
			length: 0 // chars
		});

		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'2d1',
				'< over the hairy dog'
			].join('\n')
		);
	});

	it('should compare over multiple lines', function() {
		const changes = diff(
			'the quick\n\nbrown fox\n\n\nover the hairy\n\ndog',
			'the quick\n\nred fox\n\njumped\n\nover the lazy dog\n\n'
		);

		expect(changes.length).to.equal(4);
		const [ first, second, third, fourth ] = changes;

		expect(changed(first.lhs)).to.be.true;
		expect(first.lhs).to.deep.include({
			at: 2, // part
			del: 1, // parts deleted
			pos: 11, // index
			text: 'brown fox',
			length: 9 // chars
		});
		expect(changed(first.rhs)).to.be.true;
		expect(first.rhs).to.deep.include({
			at: 2, // part
			add: 1, // parts added
			pos: 11, // index
			text: 'red fox',
			length: 7 // chars
		});

		expect(changed(second.lhs)).to.be.false;
		expect(second.lhs).to.deep.include({
			at: 4, // part
			del: 0, // parts deleted
			pos: 22, // index
			text: '',
			length: 0 // chars
		});
		expect(changed(second.rhs)).to.be.true;
		expect(second.rhs).to.deep.include({
			at: 4, // part
			add: 1, // parts added
			pos: 20, // index
			text: 'jumped',
			length: 6 // chars
		});

		expect(changed(third.lhs)).to.be.true;
		expect(third.lhs).to.deep.include({
			at: 5, // part
			del: 1, // parts deleted
			pos: 23, // index
			text: 'over the hairy',
			length: 14 // chars
		});
		expect(changed(third.rhs)).to.be.true;
		expect(third.rhs).to.deep.include({
			at: 6, // part
			add: 2, // parts added
			pos: 28, // index
			text: 'over the lazy dog',
			length: 18 // chars
		});

		expect(changed(fourth.lhs)).to.be.true;
		expect(fourth.lhs).to.deep.include({
			at: 7, // part
			del: 1, // parts deleted
			pos: 39, // index
			text: 'dog',
			length: 3 // chars
		});
		expect(changed(fourth.rhs)).to.be.false;
		expect(fourth.rhs).to.deep.include({
			at: 8, // part
			add: 0, // parts added
			pos: 47, // index
			text: '',
			length: 0 // chars
		});

		// this is actually different from GNU diff and I think the
		// reason is shift_boundaries.
		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'3c3',
				'< brown fox',
				'---',
				'> red fox',
				'5a5',
				'> jumped',
				'6c7,8',
				'< over the hairy',
				'---',
				'> over the lazy dog',
				'> ',
				'8d9',
				'< dog'
			].join('\n')
		);
	});

	it('should compare both lines with only changes', function() {
		const changes = diff(
			'the quick red fox jumped\nover the hairy dog', 
			'the quick brown fox jumped\nover the lazy dog'
		);

		expect(changes).to.have.length(1);
		const [ first ] = changes;
		expect(changed(first.lhs)).to.be.true;
		expect(first.lhs).to.deep.include({
			at: 0, // part
			del: 2, // parts deleted
			pos: 0, // index
			text: 'the quick red fox jumped',
			length: 43 // chars
		});
		expect(changed(first.rhs)).to.be.true;
		expect(first.rhs).to.deep.include({
			at: 0, // part
			add: 2, // parts added
			pos: 0, // index
			text: 'the quick brown fox jumped',
			length: 44 // chars
		});
	});

	it('should compare an added line', function() {
		const changes = diff(
			'',
			'the\nquick\nred\nfox\njumped\nover\nthe\nlazy\ndog'
		);

		expect(changes).to.have.length(1);
		const [ first ] = changes;
		expect(changed(first.lhs)).to.be.false;
		expect(first.lhs).to.deep.include({
			at: 0, // part
			del: 0, // parts deleted
			pos: null, // index
			text: null,
			length: 0 // chars
		});
		expect(changed(first.rhs)).to.be.true;
		expect(first.rhs).to.deep.include({
			at: 0, // part
			add: 9, // parts added
			pos: 0, // index
			text: 'the',
			length: 42 // chars
		});
	});

	it('should compare many lines that repeat', function() {
		const changes = diff(
			fs.readFileSync('./test/resources/moons_lhs.txt', 'utf-8'),
			fs.readFileSync('./test/resources/moons_rhs.txt', 'utf-8')
		);
		expect(formats.GnuNormalFormat(changes)).to.equal(
			fs.readFileSync('./test/resources/moons.diff', 'utf-8')
		);
	});

	it('should show a blank line on rhs as being deleted', function() {
		const changes = diff(
			'next',
			''
		);
		expect(formats.GnuNormalFormat(changes)).to.equal('1d1\n< next');
	});

	it('should show a blank line on lhs as being added', function() {
		const changes = diff(
			'',
			'next'
		);
		expect(formats.GnuNormalFormat(changes)).to.equal('1a1\n> next');
	});

	it('should show lhs and rhs blank lines as the same', function() {
		const changes = diff(
			'',
			''
		);
		expect(changes).to.have.length(0);
	});
});
