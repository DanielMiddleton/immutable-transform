'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var dateKeyMatcher = function dateKeyMatcher(value, key) {
  return typeof key === 'string' && key.indexOf('date') != -1;
};

exports.dateKeyMatcher = dateKeyMatcher;
var integerMatcher = function integerMatcher(value, key) {
  return !isNaN(+value) && parseInt(value) === parseFloat(value) && key !== 'zip';
};

exports.integerMatcher = integerMatcher;
var currencyMatcher = function currencyMatcher(value) {
  return /^\$(\d{1,3},?)+(\.\d{2})?$/.test(value);
};

exports.currencyMatcher = currencyMatcher;
var booleanMatcher = function booleanMatcher(value) {
  return typeof value === 'boolean' || ['y', 'n', '1', '0', 1, 0, 'true', 'false', 'yes', 'no'].indexOf(value) !== -1;
};

exports.booleanMatcher = booleanMatcher;
var oddsMatcher = function oddsMatcher(value, key) {
  return integerMatcher(value, key) && +value % 2 === 1;
};

exports.oddsMatcher = oddsMatcher;
var oddIndexMatcher = function oddIndexMatcher(value, key) {
  return oddsMatcher(key, key);
};
exports.oddIndexMatcher = oddIndexMatcher;
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _matchers = require('./matchers');

var _transformers = require('./transformers');

_tape2['default'].test('Nested Map', function (t) {
    var input = _immutable2['default'].fromJS({
        property: 'Sunbeam Homes',
        address: '324 Sunshine Court',
        monthsOnMarket: '8',
        available: '1',
        applicant: {
            name: 'Henry',
            birthdate: '12-25-1960',
            address: '267 Woodington Lane',
            balance: '$3,340.00',
            isEmployed: 'y',
            yearsAtEmployer: '17'
        }
    });

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.dateKeyMatcher, _transformers.dateTransformer), input.set('applicant', input.get('applicant').set('birthdate', new Date('12-25-1960').toISOString()))), 'Should transform applicant\'s birthdate');

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.currencyMatcher, _transformers.currencyTransformer), input.set('applicant', input.get('applicant').set('balance', '3340.00'))), 'Should transform applicant\'s balance');

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.integerMatcher, _transformers.integerTransformer), input.set('available', 1).set('monthsOnMarket', 8).set('applicant', input.get('applicant').set('yearsAtEmployer', 17))), 'Should transform all integer fields');

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.booleanMatcher, _transformers.booleanTransformer), input.set('available', true).set('applicant', input.get('applicant').set('isEmployed', true))), 'Should transform available and applicant\'s isEmployed');

    t.end();
});

_tape2['default'].test('Nested List', function (t) {
    var input = _immutable2['default'].fromJS(['true', true, '0', '7-25-1990', ['0', '1', '$34'], '$34,234,343,500.99']);

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.currencyMatcher, _transformers.currencyTransformer), input.set(5, '34234343500.99').set(4, input.get(4).set(2, '34'))), 'Should transform currency values');

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.integerMatcher, _transformers.integerTransformer), input.set(2, 0).set(4, input.get(4).set(0, 0).set(1, 1))), 'Should transform integer values');

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.booleanMatcher, _transformers.booleanTransformer), input.set(0, true).set(2, false).set(4, input.get(4).set(0, false).set(1, true))), 'Should transform boolean values');

    t.end();
});

_tape2['default'].test('Mixed', function (t) {
    var input = _immutable2['default'].fromJS({
        property: 'Sunbeam Homes',
        address: '324 Sunshine Court',
        monthsOnMarket: '8',
        available: '1',
        applicants: [{
            name: 'Henry',
            birthdate: '12-25-1960',
            address: '267 Woodington Lane',
            balance: '$3,340.00',
            isEmployed: 'y',
            yearsAtEmployer: '17'
        }, {
            name: 'Burgundy',
            birthdate: '03-25-1970',
            address: '3422 Hollowshire Dr',
            balance: '$34,940.34',
            isEmployed: 'n'
        }, {
            name: 'Charlize',
            birthdate: '5-1-1945',
            address: '983 Cove Circuit',
            balance: '$900.01',
            isEmployed: 'n'
        }]
    });

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.dateKeyMatcher, _transformers.dateTransformer), input.set('applicants', input.get('applicants').set(0, input.get('applicants').get(0).set('birthdate', new Date('12-25-1960').toISOString())).set(1, input.get('applicants').get(1).set('birthdate', new Date('03-25-1970').toISOString())).set(2, input.get('applicants').get(2).set('birthdate', new Date('5-1-1945').toISOString())))), 'Should transform applicants\' birthdate');

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.currencyMatcher, _transformers.currencyTransformer), input.set('applicants', input.get('applicants').set(0, input.get('applicants').get(0).set('balance', '3340.00')).set(1, input.get('applicants').get(1).set('balance', '34940.34')).set(2, input.get('applicants').get(2).set('balance', '900.01')))), 'Should transform applicants\' balance');

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.integerMatcher, _transformers.integerTransformer), input.set('available', 1).set('monthsOnMarket', 8).set('applicants', input.get('applicants').set(0, input.get('applicants').get(0).set('yearsAtEmployer', 17)))), 'Should transform all integer fields');

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.booleanMatcher, _transformers.booleanTransformer), input.set('available', true).set('applicants', input.get('applicants').set(0, input.get('applicants').get(0).set('isEmployed', true)).set(1, input.get('applicants').get(1).set('isEmployed', false)).set(2, input.get('applicants').get(2).set('isEmployed', false)))), 'Should transform available and applicants\' isEmployed');

    t.end();
});
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _matchers = require('./matchers');

var _transformers = require('./transformers');

_tape2['default'].test('Map', function (t) {
    var input = _immutable2['default'].Map({
        name: 'Henry',
        birthdate: '12-25-1960',
        address: '267 Woodington Lane',
        zip: '77396',
        balance: '$3,340.00',
        isEmployed: 'y',
        yearsAtEmployer: '17'
    });

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.dateKeyMatcher, _transformers.dateTransformer), input.set('birthdate', new Date('12-25-1960').toISOString())), 'Should transform birthdate');

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.currencyMatcher, _transformers.currencyTransformer), input.set('balance', '3340.00')), 'Should transform currency');

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.integerMatcher, _transformers.integerTransformer), input.set('yearsAtEmployer', 17)), 'Should transform yearsAtEmployer');

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.booleanMatcher, _transformers.booleanTransformer), input.set('isEmployed', true)), 'Should transform isEmployed');

    t.end();
});

_tape2['default'].test('List', function (t) {
    var input = _immutable2['default'].List(['true', true, '0', '7-25-1990', '$34,234,343,500.99']);

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.currencyMatcher, _transformers.currencyTransformer), input.set(4, '34234343500.99')), 'Should transform currency value');

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.integerMatcher, _transformers.integerTransformer), input.set(2, 0)), 'Should transform integer value');

    t['true'](_immutable2['default'].is((0, _index2['default'])(input, _matchers.booleanMatcher, _transformers.booleanTransformer), input.set(0, true).set(2, false)), 'Should transform boolean value');

    t.end();
});

_tape2['default'].test('Range by Value', function (t) {
    var input = _immutable2['default'].Range(10, 100);
    var transformed = (0, _index2['default'])(input, _matchers.oddsMatcher, _transformers.square);

    t.equals(transformed.get(0), 10, 'Should not modify even numbers');
    t.equals(transformed.get(1), 121, 'Should modify odd numbers');
    t.equals(transformed.get(2), 12, 'Should not modify even numbers');
    t.equals(transformed.get(3), 169, 'Should modify odd numbers');
    t.equals(transformed.get(89), 99 * 99, 'Should modify odd numbers');
    t.equals(transformed.last(), transformed.get(89), 'Value should be same regardless of method of access');

    t.end();
});

_tape2['default'].test('Range by Index', function (t) {
    var input = _immutable2['default'].Range(1, 101, 3);
    var transformed = (0, _index2['default'])(input, _matchers.oddIndexMatcher, _transformers.square);

    t.equals(transformed.get(0), 1);
    t.equals(transformed.get(1), 16);
    t.equals(transformed.get(2), 7);
    t.equals(transformed.get(3), 100);
    t.equals(transformed.get(33), input.last() * input.last());
    // t.equals(transformed.last(), transformed.get(33), 'Value should be same regardless of method of access');
    t.end();
});

_tape2['default'].test('Infinite Range', function (t) {
    var input = _immutable2['default'].Range();
    var transformed = (0, _index2['default'])(input, _matchers.oddsMatcher, _transformers.square);

    t.equals(transformed.get(0), 0);
    t.equals(transformed.get(1), 1);
    t.equals(transformed.get(2), 2);
    t.equals(transformed.get(3), 9);
    t.equals(transformed.get(5), 25);
    t.equals(transformed.get(100), 100);
    t.equals(transformed.get(101), 10201);
    t.end();
});
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var dateTransformer = function dateTransformer(value) {
  return new Date(value).toISOString();
};

exports.dateTransformer = dateTransformer;
var integerTransformer = function integerTransformer(value) {
  return +value;
};

exports.integerTransformer = integerTransformer;
var currencyTransformer = function currencyTransformer(value) {
  return value.replace(/[$,]/g, '');
};

exports.currencyTransformer = currencyTransformer;
var booleanTransformer = function booleanTransformer(value) {
  return [true, 'true', 'y', '1', 'yes'].indexOf(value) !== -1;
};

exports.booleanTransformer = booleanTransformer;
var square = function square(value) {
  return value * value;
};
exports.square = square;
