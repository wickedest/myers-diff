const Myers = require('./myers');
const formats = require('./formats');

module.exports = {
	diff: Myers.diff,
	diff2: Myers.diff2,
	formats: formats
	/*,
	compare: (change) => {
		if (!change.del && change.add) {
			return 1;
		}
		if (change.del && !change.add) {
			return -1;
		}
		return 0;
	}*/
};
