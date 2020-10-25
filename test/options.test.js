const { expect } = require('chai');
const { diff } = require('../src/');

describe('options', function() {
	it('should ignore whitespace', function() {
		const changes = diff(
			'the quick red fox jumped',
			'the quick red fox  jumped',
			{
				ignoreWhitespace: true
			}
		);
		expect(changes.length).to.equal(0);
	});

	it('should ignore case', function() {
		const changes = diff(
			'the quick red fox jumped',
			'the quick red FOX jumped',
			{
				ignoreCase: true
			}
		);
		expect(changes.length).to.equal(0);
	});

	it('should ignore accents', function() {
		const changes = diff(
			'the quick red fox jumped',
			'the quick réd fóx jumped',
			{
				ignoreAccents: true
			}
		);
		expect(changes.length).to.equal(0);
	});

	it('should ignore whitespace, case, and accents', function() {
		const changes = diff(
			'the quick red fox jumped',
			'the quick réd fóx  JUMPED',
			{
				ignoreWhitespace: true,
				ignoreCase: true,
				ignoreAccents: true
			}
		);
		expect(changes.length).to.equal(0);
	});
});
