const fs = require('fs');
const { expect } = require('chai');
const { diff, formats } = require('../src/');

describe('#diff', function() {
	it('illegal argument "lhs"', function() {
		expect(diff).to.throw(Error, /illegal argument 'lhs'/);
	});

	it('illegal argument "rhs"', function() {
		expect(diff.bind(diff, 'lhs')).to.throw(Error, /illegal argument 'rhs'/);
	});

	it('one line, no changes', function() {
		const { changes } = diff(
			'the quick red fox jumped',
			'the quick red fox jumped'
		);
		expect(changes.length).to.equal(0);
	});

	it('two lines, no changes', function() {
		const { changes } = diff(
			'the quick red fox jumped\nover the lazy dog',
			'the quick red fox jumped\nover the lazy dog'
		);
		expect(changes.length).to.equal(0);
	});

	it('one line changed', function() {
		const { changes } = diff(
			'the quick red fox jumped', 
			'the quick brown fox jumped'
		);

		expect(changes).to.have.length(1);
		const change = changes[0];

		// lhs changed at index 0, del 1 line, to index 0
		expect(change.lhs.at).to.equal(0);
		expect(change.lhs.del).to.be.equal(1);
		expect(change.lhs.ctx.getPart(change.lhs.at).text)
			.to.equal('the quick red fox jumped');

		// rhs changed at index 0, add 1 line, to index 0
		expect(change.rhs.at).to.equal(0);
		expect(change.rhs.add).to.be.equal(1);
		expect(change.rhs.ctx.getPart(change.rhs.at).text)
			.to.equal('the quick brown fox jumped');

		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'1c1',
				'< the quick red fox jumped',
				'---',
				'> the quick brown fox jumped',
				''
			].join('\n')
		);
	});

	it('one line added', function() {
		const { changes } = diff(
			'the quick red fox jumped', 
			'the quick red fox jumped\nover the lazy dog'
		);

		expect(changes).to.have.length(1);
		const change = changes[0];

		// lhs did not change
		expect(change.lhs.at).to.equal(0);
		expect(change.lhs.del).to.be.equal(0);

		// rhs changed at index 0, add 1 line, to index 0
		expect(change.rhs.at).to.equal(1);
		expect(change.rhs.add).to.be.equal(1);

		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'1a2',
				'> over the lazy dog',
				''
			].join('\n')
		);
	});

	it('one line removed', function() {
		const { changes } = diff(
			'the quick red fox jumped\nover the hairy dog',
			'the quick red fox jumped'
		);

		expect(changes).to.have.length(1);
		const change = changes[0];

		// lhs changed at at index 1, del 1 line, to index 1
		expect(change.lhs.at).to.equal(1);
		expect(change.lhs.del).to.be.equal(1);

		// rhs did not change
		expect(change.rhs.at).to.equal(0);
		expect(change.rhs.add).to.be.equal(0);

		expect(formats.GnuNormalFormat(changes)).to.equal(
			[
				'2d1',
				'< over the hairy dog',
				''
			].join('\n')
		);
	});

	it('multi lines', function() {
		const { changes } = diff(
			'the quick\n\nbrown fox\n\n\nover the hairy\n\ndog',
			'the quick\n\nred fox\n\njumped\n\nover the lazy dog\n\n'
		);
		let change;

		expect(changes.length).to.equal(4);

		change = changes[0];

		// lhs changed at at index 2, del 1 line, to index 2
		expect(change.lhs.at).to.equal(2);
		expect(change.lhs.del).to.be.equal(1);

		// rhs changed at at index 2, add 1 line, to index 2
		expect(change.rhs.at).to.equal(2);
		expect(change.rhs.add).to.be.equal(1);

		change = changes[1];

		// lhs did not change
		expect(change.lhs.at).to.equal(4);
		expect(change.lhs.del).to.be.equal(0);

		// rhs changed at at index 4, add 1 line, to index 4
		expect(change.rhs.at).to.equal(4);
		expect(change.rhs.add).to.be.equal(1);

		change = changes[2];

		// lhs changed at at index 5, del 1 line, to index 5
		expect(change.lhs.at).to.equal(5);
		expect(change.lhs.del).to.be.equal(1);

		// rhs changed at at index 6, add 2 lines, to index 7
		expect(change.rhs.at).to.equal(6);
		expect(change.rhs.add).to.be.equal(2);

		change = changes[3];

		// lhs changed at at index 7, del 1 line, to index 5
		expect(change.lhs.at).to.equal(7);
		expect(change.lhs.del).to.be.equal(1);

		// rhs did not change
		expect(change.rhs.at).to.equal(8);
		expect(change.rhs.add).to.be.equal(0);

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
				'< dog',
				''
			].join('\n')
		);
	});

	it('all lines have only changes', function() {
		const { changes } = diff(
			'the quick red fox jumped\nover the hairy dog', 
			'the quick brown fox jumped\nover the lazy dog'
		);
		let change;

		expect(changes).to.have.length(1);

		change = changes[0];

		// lhs changed at at index 0, del 2 line, to index 1
		expect(change.lhs.at).to.equal(0);
		expect(change.lhs.del).to.be.equal(2);
		//expect(change.lhs.to).to.equal(1);

		// 2 line added at line 6
		expect(change.rhs.at).to.equal(0);
		expect(change.rhs.add).to.be.equal(2);
	});

	it('all added to rhs', function() {
		const { changes } = diff(
			'',
			'the\nquick\nred\nfox\njumped\nover\nthe\nlazy\ndog'
		);

		expect(changes).to.have.length(1);

		let change = changes[0];

		// lhs changed at at index 0, del 1 line, to index 1
		expect(change.lhs.at).to.equal(0);
		expect(change.lhs.del).to.be.equal(0);

		// 2 line added at line 6
		expect(change.rhs.at).to.equal(0);
		expect(change.rhs.add).to.be.equal(9);
	});

	it('many lines repeat', function() {
		const { changes } = diff(
			fs.readFileSync('./test/resources/moons_lhs.txt', 'utf-8'),
			fs.readFileSync('./test/resources/moons_rhs.txt', 'utf-8')
		);
		expect(formats.GnuNormalFormat(changes)).to.equal(
			fs.readFileSync('./test/resources/moons.diff', 'utf-8')
		);
	});

	it('should show a blank line on rhs as being deleted', function() {
		const { changes } = diff(
			'next',
			''
		);
		expect(formats.GnuNormalFormat(changes)).to.equal('1d1\n< next\n');
	});

	it('should show a blank line on lhs as being added', function() {
		const { changes } = diff(
			'',
			'next'
		);
		expect(formats.GnuNormalFormat(changes)).to.equal('1a1\n> next\n');
	});

	it('should show lhs and rhs blank lines as the same', function() {
		const { changes } = diff(
			'',
			''
		);
		expect(changes).to.have.length(0);
	});
});
