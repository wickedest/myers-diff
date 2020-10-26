const { expect } = require('chai');
const { diff, changed } = require('../src/');

describe('compare chars', function() {
	it('should compare chars at end of string', function() {
		const changes = diff(
			'the quick red fox jumped',
			'the quick red fox swam',
			{ compare: 'chars' }
		);

		expect(changes.length).to.equal(2);
		const [ first, second ] = changes;

		// delete: 'ju'
		expect(changed(first.lhs)).to.be.true;
		expect(first.lhs).to.deep.include({
			at: 18, // part
			del: 2, // parts deleted
			pos: 18, // index
			text: 'j',
			length: 2 // chars
		});
		expect(first.lhs.getPart(first.lhs.at))
			.to.deep.equal({ text: 'j', pos: 18 });

		// add: 'swa'
		expect(changed(first.rhs)).to.be.true;
		expect(first.rhs).to.deep.include({
			at: 18, // part
			add: 3, // parts added
			pos: 18, // index
			text: 's',
			length: 3 // chars
		});
		expect(first.rhs.getPart(first.rhs.at))
			.to.deep.equal({ text: 's', pos: 18 });

		// delete: 'ped'
		expect(changed(second.lhs)).to.be.true;
		expect(second.lhs).to.deep.include({
			at: 21, // part
			del: 3, // parts deleted
			pos: 21, // index
			text: 'p',
			length: 3 // chars
		});
		expect(second.lhs.getPart(second.lhs.at))
			.to.deep.equal({ text: 'p', pos: 21 });

		// no change to rhs
		expect(changed(second.rhs)).to.be.false;
	});

	it('should compare chars at start of string', function() {
		const changes = diff(
			'the quick red fox jumped',
			'The quick red fox jumped',
			{compare: 'chars'}
		);

		expect(changes.length).to.equal(1);
		const change = changes[0];
		expect(changed(change.lhs)).to.be.true;
		expect(change.lhs).to.deep.include({
			at: 0, // part
			del: 1, // parts deleted
			pos: 0, // index
			text: 't',
			length: 1 // chars
		});
		expect(changed(change.rhs)).to.be.true;
		expect(change.rhs).to.deep.include({
			at: 0, // part
			add: 1, // parts added
			pos: 0, // index
			text: 'T',
			length: 1 // chars
		});
	});

	it('should compare change chars at end of string', function() {
		const changes = diff(
			'the quick red fox jumped',
			'the quick red fox Jumped',
			{compare: 'chars'}
		);
		expect(changes.length).to.equal(1);
		const change = changes[0];
		expect(changed(change.lhs)).to.be.true;
		expect(change.lhs).to.deep.include({
			at: 18, // part
			del: 1, // parts deleted
			pos: 18, // index
			text: 'j',
			length: 1 // chars
		});
		expect(changed(change.rhs)).to.be.true;
		expect(change.rhs).to.deep.include({
			at: 18, // part
			add: 1, // parts added
			pos: 18, // index
			text: 'J',
			length: 1 // chars
		});
	});

	it('should compare change chars in mid string', function() {
		const changes = diff(
			'the quick red fox jumped',
			'the quick RED fox jumped',
			{compare: 'chars'}
		);

		expect(changes.length).to.equal(1);
		const change = changes[0];
		expect(changed(change.lhs)).to.be.true;
		expect(change.lhs).to.deep.include({
			at: 10, // part
			del: 3, // parts deleted
			pos: 10, // index
			text: 'r',
			length: 3 // chars
		});
		expect(changed(change.rhs)).to.be.true;
		expect(change.rhs).to.deep.include({
			at: 10, // part
			add: 3, // parts added
			pos: 10, // index
			text: 'R',
			length: 3 // chars
		});
	});

	it('should compare add chars at start of string', function() {
		const changes = diff(
			'the quick red fox jumped',
			'*the quick red fox jumped',
			{compare: 'chars'}
		);

		expect(changes.length).to.equal(1);
		const change = changes[0];
		expect(changed(change.lhs)).to.be.false;
		expect(change.lhs).to.deep.include({
			at: 0, // part
			del: 0, // parts deleted
			pos: 0, // index
			text: 't',
			length: 0 // chars
		});
		expect(changed(change.rhs)).to.be.true;
		expect(change.rhs).to.deep.include({
			at: 0, // part
			add: 1, // parts added
			pos: 0, // index
			text: '*',
			length: 1 // chars
		});
	});

	it('should compare add chars at end of string', function() {
		const changes = diff(
			'the quick red fox jumped',
			'the quick red fox jumped*',
			{compare: 'chars'}
		);

		expect(changes.length).to.equal(1);
		const change = changes[0];
		expect(changed(change.lhs)).to.be.false;
		expect(change.lhs).to.deep.include({
			at: 23, // part
			del: 0, // parts deleted
			pos: 23, // index
			text: 'd',
			length: 0 // chars
		});
		expect(changed(change.rhs)).to.be.true;
		expect(change.rhs).to.deep.include({
			at: 24, // part
			add: 1, // parts added
			pos: 24, // index
			text: '*',
			length: 1 // chars
		});
	});

	it('should compare del chars at start of string', function() {
		const changes = diff(
			'*the quick red fox jumped',
			'the quick red fox jumped',
			{compare: 'chars'}
		);

		expect(changes.length).to.equal(1);
		const change = changes[0];
		expect(changed(change.lhs)).to.be.true;
		expect(change.lhs).to.deep.include({
			at: 0, // part
			del: 1, // parts deleted
			pos: 0, // index
			text: '*',
			length: 1 // chars
		});
		expect(changed(change.rhs)).to.be.false;
		expect(change.rhs).to.deep.include({
			at: 0, // part
			add: 0, // parts added
			pos: 0, // index
			text: 't',
			length: 0 // chars
		});
	});

	it('should compare del chars at end of string', function() {
		const changes = diff(
			'the quick red fox jumped*',
			'the quick red fox jumped',
			{compare: 'chars'}
		);

		expect(changes.length).to.equal(1);
		const change = changes[0];
		expect(changed(change.lhs)).to.be.true;
		expect(change.lhs).to.deep.include({
			at: 24, // part
			del: 1, // parts deleted
			pos: 24, // index
			text: '*',
			length: 1 // chars
		});
		expect(changed(change.rhs)).to.be.false;
		expect(change.rhs).to.deep.include({
			at: 23, // part
			add: 0, // parts added
			pos: 23, // index
			text: 'd',
			length: 0 // chars
		});
	});

	it('compare chars in middle of sentence', function() {
		const changes = diff(
			'the quick red scared fox jumped',
			'the quick orange fox jumped',
			{compare: 'chars'}
		);

		expect(changes.length).to.equal(4);

		const [ first, second, third, fourth ] = changes;

		// deleted: nothing
		expect(changed(first.lhs)).to.be.false;
		expect(first.lhs).to.deep.include({
			at: 10, // part
			del: 0, // parts deleted
			pos: 10, // index
			text: 'r',
			length: 0 // chars
		});
		// added: 'o'
		expect(changed(first.rhs)).to.be.true;
		expect(first.rhs).to.deep.include({
			at: 10, // part
			add: 1, // parts added
			pos: 10, // index
			text: 'o',
			length: 1 // chars
		});

		// deleted: 'ed sc'
		expect(changed(second.lhs)).to.be.true;
		expect(second.lhs).to.deep.include({
			at: 11, // part
			del: 5, // parts deleted
			pos: 11, // index
			text: 'e',
			length: 5  // chars
		});
		// added: nothing
		expect(changed(second.rhs)).to.be.false;
		expect(second.rhs).to.deep.include({
			at: 12, // part
			add: 0, // parts added
			pos: 12, // index
			text: 'a',
			length: 0 // chars
		});

		// deleted: 'r'
		expect(changed(third.lhs)).to.be.true;
		expect(third.lhs).to.deep.include({
			at: 17, // part
			del: 1, // parts deleted
			pos: 17, // index
			text: 'r',
			length: 1  // chars
		});
		// added: 'ng'
		expect(changed(third.rhs)).to.be.true;
		expect(third.rhs).to.deep.include({
			at: 13, // part
			add: 2, // parts added
			pos: 13, // index
			text: 'n',
			length: 2 // chars
		});

		// deleted: 'r'
		expect(changed(fourth.lhs)).to.be.true;
		expect(fourth.lhs).to.deep.include({
			at: 19, // part
			del: 1, // parts deleted
			pos: 19, // index
			text: 'd',
			length: 1  // chars
		});
		// added: nothing
		expect(changed(fourth.rhs)).to.be.false;
		expect(fourth.rhs).to.deep.include({
			at: 16, // part
			add: 0, // parts added
			pos: 16, // index
			text: ' ',
			length: 0 // chars
		});
	});

	it('should compare an added line', function() {
		const changes = diff(
			'',
			'the quick red fox jumped',
			{compare: 'chars'}
		);

		expect(changes.length).to.equal(1);
		const change = changes[0];
		expect(changed(change.lhs)).to.be.false;
		expect(change.lhs).to.deep.include({
			at: 0, // part
			del: 0, // parts deleted
			pos: null, // index
			text: null,
			length: 0 // chars
		});
		expect(changed(change.rhs)).to.be.true;
		expect(change.rhs).to.deep.include({
			at: 0, // part
			add: 24, // parts added
			pos: 0, // index
			text: 't',
			length: 24 // chars
		});
	});

	it('should compare a deleted line', function() {
		const changes = diff(
			'the quick red fox jumped',
			'',
			{compare: 'chars'}
		);

		expect(changes.length).to.equal(1);
		const change = changes[0];
		expect(changed(change.lhs)).to.be.true;
		expect(change.lhs).to.deep.include({
			at: 0, // part
			del: 24, // parts deleted
			pos: 0, // index
			text: 't',
			length: 24 // chars
		});
		expect(changed(change.rhs)).to.be.false;
		expect(change.rhs).to.deep.include({
			at: 0, // part
			add: 0, // parts added
			pos: null, // index
			text: null,
			length: 0 // chars
		});
	});
});
