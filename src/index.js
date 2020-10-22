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
	 * @function
	 * @name diff
	 * @description
	 * Compare {@code lhs} to {@code rhs}.  Changes are compared from left
	 * to right such that items are deleted from left, or added to right,
	 * or just otherwise changed between them.
	 * 
	 * @param   {string} lhs - The left-hand source text.
	 * @param   {string} rhs - The right-hand source text.
	 * @param   {object} [options={}] - Optional settings.
	 * @return {Change[]} An array of change objects
	 */
	diff,

	/**
	 * @function
	 * @name GnuNormalFormat
	 * @description
	 * Formats a diff in GNU normal format.
	 * 
	 * @param   {Change[]} changes - The array of changes to format.
	 * @return {string} A diff in GNU normal format.
	 */
	/**
	 * @typedef {object} formats
	 * @property {GnuNormalFormat} GnuNormalFormat
	 */
	formats,
	changecmp
};
