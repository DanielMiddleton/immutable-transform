'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var deepTransform = function deepTransform(iterable, matcher, transformer) {
    return iterable.map(function (value, key, iterable) {
        if (matcher(value, key, iterable)) {
            return transformer(value, key, iterable);
        }

        if (_immutable.Iterable.isIterable(value)) {
            return deepTransform(value, matcher, transformer);
        }

        return value;
    });
};

exports['default'] = deepTransform;
module.exports = exports['default'];
