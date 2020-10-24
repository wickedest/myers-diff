const Splitter = require('./splitter');

function getDefaultSettings() {
	return {
		compare: 'lines', // lines|words|chars
		ignoreWhitespace: false,
		ignoreCase: false,
		ignoreAccents: false
	};
}

/**
 * Encodes text into diff-codes to prepare for Myers diff.
 */
class Encoder {
	constructor() {
		this.code = 0;
		this.diff_codes = {};
	}

	encode(text, settings) {
		return new EncodeContext(this, text, settings);
	}

	getCode(line) {
		return this.diff_codes[line];
	}

	newCode(line) {
		this.code = this.code + 1;
		this.diff_codes[line] = this.code;
		return this.code;
	}
}

/**
 * Encoder context
 */
class EncodeContext {
	constructor(encoder, text, options) {
		let re;
		if (text) {
			if (options.compare === 'chars') {
				// split all chars
				re = '';
			} else if (options.compare === 'words') {
				// split all of the text on spaces
				re = ' ';
			} else { // lines (default)
				re = '\n';
			}
		}

		this.encoder = encoder;
		this._codes = {};
		this._modified = {};
		this._parts = [];

		let count = 0;
		const split = new Splitter(text, re);
		let part;
		while ((part = split.next()) !== null) {
			let line = part.text;
			if (options.ignoreWhitespace) {
				line = line.replace(/\s+/g, '');
			}
			if (options.ignoreCase) {
				line = line.toLowerCase();
			}
			if (options.ignoreAccents) {
				line = line.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			}
			let aCode = encoder.getCode(line);
			if (aCode === undefined) {
				aCode = encoder.newCode(line);
			}
			this._codes[count] = aCode;
			this._parts.push(part);
			count += 1;
		}
	}

	finish() {
		delete this.encoder;
	}

	get codes() {
		return this._codes;
	}

	get length() {
		return Object.keys(this._codes).length;
	}

	get modified() {
		return this._modified;
	}
}

class Myers {
	static compare_lcs(
		lhsCtx, rhsCtx,
		lhs_modified, lhs_codes, lhs_codes_length,
		rhs_modified, rhs_codes, rhs_codes_length,
		callback
	) {
		let lhs_start = 0;
		let rhs_start = 0;
		let lhs_line = 0;
		let rhs_line = 0;

		while (lhs_line < lhs_codes_length || rhs_line < rhs_codes_length) {
			if ((lhs_line < lhs_codes_length) && (!lhs_modified[lhs_line])
				&& (rhs_line < rhs_codes_length) && (!rhs_modified[rhs_line])) {
				// equal lines
				lhs_line++;
				rhs_line++;
			}
			else {
				// maybe deleted and/or inserted lines
				lhs_start = lhs_line;
				rhs_start = rhs_line;
				while (lhs_line < lhs_codes_length && (rhs_line >= rhs_codes_length || lhs_modified[lhs_line])) {
					lhs_line++;
				}
				while (rhs_line < rhs_codes_length && (lhs_line >= lhs_codes_length || rhs_modified[rhs_line])) {
					rhs_line++;
				}
				// istanbul ignore else
				if ((lhs_start < lhs_line) || (rhs_start < rhs_line)) {
					const lat = Math.min(lhs_start, (lhs_codes_length) ? lhs_codes_length - 1 : 0);
					const rat = Math.min(rhs_start, (rhs_codes_length) ? rhs_codes_length - 1 : 0);
					const lpart = lhsCtx._parts[Math.min(lhs_start, lhs_codes_length - 1)];
					const rpart = rhsCtx._parts[Math.min(rhs_start, rhs_codes_length - 1)];

					const item = {
						lhs: {
							at: lat,
							del: lhs_line - lhs_start,
							pos: lpart ? lpart.pos : null,
							text: lpart ? lpart.text : null
						},
						rhs: {
							at: rat,
							add: rhs_line - rhs_start,
							pos: rpart ? rpart.pos : null,
							text: rpart ? rpart.text : null
						}
					};
					callback(item);
				}
			}
		}
	}

	static getShortestMiddleSnake(
		lhs_codes, lhs_codes_length, lhs_lower, lhs_upper,
		rhs_codes, rhs_codes_length, rhs_lower, rhs_upper,
		vector_u, vector_d
	) {
		const max = lhs_codes_length + rhs_codes_length + 1;
		// istanbul ignore next
		if (max === undefined) {
			throw new Error('unexpected state');
		}
		let kdown = lhs_lower - rhs_lower,
			kup = lhs_upper - rhs_upper,
			delta = (lhs_upper - lhs_lower) - (rhs_upper - rhs_lower),
			odd = (delta & 1) != 0,
			offset_down = max - kdown,
			offset_up = max - kup,
			maxd = ((lhs_upper - lhs_lower + rhs_upper - rhs_lower) / 2) + 1,
			ret = {x:0, y:0}, d, k, x, y;

		vector_d[ offset_down + kdown + 1 ] = lhs_lower;
		vector_u[ offset_up + kup - 1 ] = lhs_upper;
		for (d = 0; d <= maxd; ++d) {
			for (k = kdown - d; k <= kdown + d; k += 2) {
				if (k === kdown - d) {
					x = vector_d[ offset_down + k + 1 ];//down
				}
				else {
					x = vector_d[ offset_down + k - 1 ] + 1;//right
					if ((k < (kdown + d)) && (vector_d[ offset_down + k + 1 ] >= x)) {
						x = vector_d[ offset_down + k + 1 ];//down
					}
				}
				y = x - k;
				// find the end of the furthest reaching forward D-path in diagonal k.
				while ((x < lhs_upper) && (y < rhs_upper) && (lhs_codes[x] === rhs_codes[y])) {
					x++; y++;
				}
				vector_d[ offset_down + k ] = x;
				// overlap ?
				if (odd && (kup - d < k) && (k < kup + d)) {
					if (vector_u[offset_up + k] <= vector_d[offset_down + k]) {
						ret.x = vector_d[offset_down + k];
						ret.y = vector_d[offset_down + k] - k;
						return (ret);
					}
				}
			}
			// Extend the reverse path.
			for (k = kup - d; k <= kup + d; k += 2) {
				// find the only or better starting point
				if (k === kup + d) {
					x = vector_u[offset_up + k - 1]; // up
				} else {
					x = vector_u[offset_up + k + 1] - 1; // left
					if ((k > kup - d) && (vector_u[offset_up + k - 1] < x))
						x = vector_u[offset_up + k - 1]; // up
				}
				y = x - k;
				while ((x > lhs_lower) && (y > rhs_lower) && (lhs_codes[x - 1] === rhs_codes[y - 1])) {
					// diagonal
					x--;
					y--;
				}
				vector_u[offset_up + k] = x;
				// overlap ?
				if (!odd && (kdown - d <= k) && (k <= kdown + d)) {
					if (vector_u[offset_up + k] <= vector_d[offset_down + k]) {
						ret.x = vector_d[offset_down + k];
						ret.y = vector_d[offset_down + k] - k;
						return (ret);
					}
				}
			}
		}
		// should never get to this state
		// istanbul ignore next
		throw new Error('unexpected state');
	}

	static getLongestCommonSubsequence(
		lhs_modified, lhs_codes, lhs_codes_length, lhs_lower, lhs_upper,
		rhs_modified, rhs_codes, rhs_codes_length, rhs_lower, rhs_upper,
		vector_u, vector_d
	) {
		// trim off the matching items at the beginning
		while ( (lhs_lower < lhs_upper) && (rhs_lower < rhs_upper) && (lhs_codes[lhs_lower] === rhs_codes[rhs_lower]) ) {
			++lhs_lower;
			++rhs_lower;
		}
		// trim off the matching items at the end
		while ( (lhs_lower < lhs_upper) && (rhs_lower < rhs_upper) && (lhs_codes[lhs_upper - 1] === rhs_codes[rhs_upper - 1]) ) {
			--lhs_upper;
			--rhs_upper;
		}
		if (lhs_lower === lhs_upper) {
			while (rhs_lower < rhs_upper) {
				rhs_modified[rhs_lower++] = true;
			}
		}
		else if (rhs_lower === rhs_upper) {
			while (lhs_lower < lhs_upper) {
				lhs_modified[lhs_lower++] = true;
			}
		}
		else {
			const sms = Myers.getShortestMiddleSnake(
				lhs_codes, lhs_codes_length, lhs_lower, lhs_upper,
				rhs_codes, rhs_codes_length, rhs_lower, rhs_upper, 
				vector_u, vector_d);
			Myers.getLongestCommonSubsequence(
				lhs_modified, lhs_codes, lhs_codes_length, lhs_lower, sms.x, 
				rhs_modified, rhs_codes, rhs_codes_length, rhs_lower, sms.y,
				vector_u, vector_d);
			Myers.getLongestCommonSubsequence(
				lhs_modified, lhs_codes, lhs_codes_length, sms.x, lhs_upper,
				rhs_modified, rhs_codes, rhs_codes_length, sms.y, rhs_upper,
				vector_u, vector_d);
		}
	}

	static LCS(
		lhsModified, lhsCodes, lhsLength,
		rhsModified, rhsCodes, rhsLength
	) {
		let vector_u = [], vector_d = [];
		return Myers.getLongestCommonSubsequence(
			lhsModified, lhsCodes, lhsLength, 0, lhsLength,
			rhsModified, rhsCodes, rhsLength, 0, rhsLength,
			vector_u, vector_d);
	}

	static CompareLCS(
		lhsCtx, rhsCtx,
		lhsModified, lhsCodes, lhsLength,
		rhsModified, rhsCodes, rhsLength,
		callback
	) {
		return Myers.compare_lcs(
			lhsCtx, rhsCtx,
			lhsModified, lhsCodes, lhsLength,
			rhsModified, rhsCodes, rhsLength,
			callback);
	}

	/**
	 * Compare {@code lhs} to {@code rhs}.  Changes are compared from left
	 * to right such that items are deleted from left, or added to right,
	 * or just otherwise changed between them.
	 * 
	 * @param   {string} lhs - The left-hand source text.
	 * @param   {string} rhs - The right-hand source text.
	 * @param   {object} [options={}] - Optional settings.
	 */
	static diff(lhs, rhs, options = {}) {
		const settings = getDefaultSettings();
		const encoder = new Encoder();

		if (lhs === undefined) {
			throw new Error('illegal argument \'lhs\'');
		}
		if (rhs === undefined) {
			throw new Error('illegal argument \'rhs\'');
		}

		Object.assign(settings, options);

		const lhsCtx = encoder.encode(lhs, settings);
		const rhsCtx = encoder.encode(rhs, settings);

		Myers.LCS(
			lhsCtx.modified, lhsCtx.codes, lhsCtx.length,
			rhsCtx.modified, rhsCtx.codes, rhsCtx.length
		);

		// compare lhs/rhs codes and build a list of comparisons
		const changes = [];
		const compare = (options.compare === 'chars') ? 0 : 1;

		Myers.CompareLCS(
			lhsCtx, rhsCtx,
			lhsCtx.modified, lhsCtx.codes, lhsCtx.length,
			rhsCtx.modified, rhsCtx.codes, rhsCtx.length,
			function (item) {
				// add context information
				item.lhs.getPart = (n) => lhsCtx._parts[n];
				item.rhs.getPart = (n) => rhsCtx._parts[n];
				if (compare === 0) {
					item.lhs.length = item.lhs.del;
					item.rhs.length = item.rhs.add;
				} else {
					// words and lines
					item.lhs.length = 0;
					if (item.lhs.del) {
						// get the index of the second-last item being deleted,
						// plus its length, minus the start pos.
						const i = item.lhs.at + item.lhs.del - 1;
						const part = lhsCtx._parts[i];
						item.lhs.length = part.pos + part.text.length
							- lhsCtx._parts[item.lhs.at].pos;
					}

					item.rhs.length = 0;
					if (item.rhs.add) {
						// get the index of the second-last item being added,
						// plus its length, minus the start pos.
						const i = item.rhs.at + item.rhs.add - 1;
						const part = rhsCtx._parts[i];
						item.rhs.length = part.pos + part.text.length
							- rhsCtx._parts[item.rhs.at].pos;
					}
				}
				changes.push(item);
			}
		);

		lhsCtx.finish();
		rhsCtx.finish();

		return {
			changes,
			lhsCtx,
			rhsCtx
		};
	}
}

module.exports = Myers;
