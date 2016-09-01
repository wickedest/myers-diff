'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _myers = require('./myers');

var _myers2 = _interopRequireDefault(_myers);

var _formats = require('./formats');

var _formats2 = _interopRequireDefault(_formats);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    diff: _myers2.default.diff,
    formats: _formats2.default
};