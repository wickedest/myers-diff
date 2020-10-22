function changecmp(change) {
	if (!change.del && change.add) {
		return 1;
	}
	if (change.del && !change.add) {
		return -1;
	}
	return 0;
}

module.exports = changecmp;
