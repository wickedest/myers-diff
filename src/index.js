/* @module Myers */
/**
 * @file Myers
 * @author jamie.peabody@gmail.com
 */

const { diff } = require('./myers');
const formats = require('./formats');
const changecmp = require('./changecmp');

module.exports = {
	/**
	 * A left-hand change part
	 * @typedef {object} LeftPart
	 * @property {integer} at - The part item identifier.  When comparing
	 * lines, it is the _n-th_ line; when comparing words, it is the _n-th_
	 * word; when comparing chars, it is the _n-th_ char.
	 * @property {integer} del - The number of parts deleted from the left.
	 * When comparing lines, it is the number of lines deleted; when comparing
	 * words, it is the number of words deleted; when comparing chars, it is
	 * the number of chars deleted.
	 * @property {integer} pos - The zero-based character position of the
	 * part from the original text.
	 */

	/**
	 * A right-hand change part
	 * @typedef {object} RightPart
	 * @property {integer} at - The part item identifier.  When comparing
	 * lines, it is the _n-th_ line; when comparing words, it is the _n-th_
	 * word; when comparing chars, it is the _n-th_ char.
	 * @property {integer} add - The number of parts added from the right.
	 * When comparing lines, it is the number of lines added; when comparing
	 * words, it is the number of words added; when comparing chars, it is
	 * the number of chars added.
	 * @property {integer} pos - The zero-based character position of the
	 * part from the original text.
	 */

	/**
	 * A change pair
	 * @typedef {object} ChangePair
	 * @property {LeftPart} lhs - The left-hand document that was compared.
	 * @property {RightPart} rhs - The right-hand document that was compared.
	 */

	/**
	 * @callback
	 * @name getPart
	 * @description
	 * Gets a change part.
	 *
	 * @param {integer} n - The index of the part to get.
	 * @return {Part} The part or `undefined` if `n` is out of bounds.
	 */

	/**
	 * Encoder context
	 * @typedef {object} EncoderContext
	 * @property {function} getPart - Gets a part.
	 */

	/**
	 * Main module exports.
	 * @typedef {object} myers
	 *
	 * @property {diff} diff
	 * @property {formats} formats
	 */

	/**
	 * @callback
	 * @name diff
	 * @description
	 * Compare `lhs` to `rhs`.  Changes are compared from left
	 * to right such that items are deleted from left, or added to right,
	 * or just otherwise changed between them.
	 * 
	 * @param {string} lhs - The left-hand source text.
	 * @param {string} rhs - The right-hand source text.
	 * @param {object} [options={}] - Optional settings.
	 * @param {boolean} [options.ignoreWhitespace=false] - Ignores whitespace.
	 * @param {boolean} [options.ignoreCase=false] - Ignores case.
	 * @param {boolean} [options.ignore=false] - Ignores accents.
	 * @param {string} [options.compare=lines] - The type of comparison; one of:
	 * 'chars', 'words', or 'lines' (default).
	 * @return {Change[]} An array of change objects
	 * @example
	 * const myers = require('myers-diff');
	 * const changes = myers.diff(lhs, rhs);
	 */
	diff,

	/**
	 * @callback
	 * @name GnuNormalFormat
	 * @description
	 * Formats a diff in GNU normal format.
	 * 
	 * @param   {Change[]} changes - The array of changes to format.
	 * @return {string} A diff in GNU normal format.
	 * @example
	 * const myers = require('myers-diff');
	 * console.log(myers.formats.GnuNormalFormat(changes));
	 */
	/**
	 * @typedef {object} formats
	 * @property {GnuNormalFormat} GnuNormalFormat
	 */
	formats,
	changecmp
};
