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
	 * A change.
	 * @typedef {object} Change
	 * @property {number} at - The index where the change occurs.
	 * @property {number} del - The number of parts changed.
	 * @property {EncoderContext} ctx - The encoder context.
	 */
	/**
	 * A change pair
	 * @typedef {object} ChangePair
	 * @property {Change} lhs - The left-hand document that was compared.
	 * @property {Change} rhs - The right-hand document that was compared.
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
	 * @param {string} [options.compare='lines'] - The type of comparison; one of:
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
