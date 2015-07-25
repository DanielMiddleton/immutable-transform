import tape from 'tape';
import Immutable from 'immutable';

import transform from '../index';

import { dateKeyMatcher,
        currencyMatcher,
        integerMatcher,
        booleanMatcher } from './matchers';

import { dateTransformer,
        currencyTransformer,
        integerTransformer,
        booleanTransformer } from './transformers';

tape.test('Nested Map', t => {
    const input = Immutable.fromJS({
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

    t.true(Immutable.is(
        transform(input, dateKeyMatcher, dateTransformer),
        input.set('applicant', input.get('applicant').set('birthdate', new Date('12-25-1960').toISOString()))
        ),
        'Should transform applicant\'s birthdate'
    );

    t.true(Immutable.is(
        transform(input, currencyMatcher, currencyTransformer),
        input.set('applicant', input.get('applicant').set('balance', '3340.00'))
        ),
        'Should transform applicant\'s balance'
    );

    t.true(Immutable.is(
        transform(input, integerMatcher, integerTransformer),
        input.set('available', 1).set('monthsOnMarket', 8)
            .set('applicant', input.get('applicant').set('yearsAtEmployer', 17))
        ),
        'Should transform all integer fields'
    );

    t.true(Immutable.is(
        transform(input, booleanMatcher, booleanTransformer),
        input.set('available', true)
            .set('applicant', input.get('applicant').set('isEmployed', true))
        ),
        'Should transform available and applicant\'s isEmployed'
    );

    t.end();
});

tape.test('Nested List', t => {
    const input = Immutable.fromJS(['true', true, '0', '7-25-1990', ['0', '1', '$34'], '$34,234,343,500.99']);

    t.true(Immutable.is(
        transform(input, currencyMatcher, currencyTransformer),
        input.set(5, '34234343500.99')
            .set(4, input.get(4).set(2, '34'))
        ),
        'Should transform currency values'
    );

    t.true(Immutable.is(
        transform(input, integerMatcher, integerTransformer),
        input.set(2, 0)
            .set(4, input.get(4).set(0, 0).set(1, 1))
        ),
        'Should transform integer values'
    );

    t.true(Immutable.is(
        transform(input, booleanMatcher, booleanTransformer),
        input.set(0, true).set(2, false)
            .set(4, input.get(4).set(0, false).set(1, true))
        ),
        'Should transform boolean values'
    );

    t.end();
});

tape.test('Mixed', t => {
    const input = Immutable.fromJS({
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

    t.true(Immutable.is(
        transform(input, dateKeyMatcher, dateTransformer),
        input.set('applicants', input.get('applicants')
            .set(0, input.get('applicants').get(0)
                .set('birthdate', new Date('12-25-1960').toISOString())
            ).set(1, input.get('applicants').get(1)
                .set('birthdate', new Date('03-25-1970').toISOString())
            ).set(2, input.get('applicants').get(2)
                .set('birthdate', new Date('5-1-1945').toISOString())
            ))
        ),
        'Should transform applicants\' birthdate'
    );

    t.true(Immutable.is(
        transform(input, currencyMatcher, currencyTransformer),
        input.set('applicants', input.get('applicants')
            .set(0, input.get('applicants').get(0)
                .set('balance', '3340.00')
            ).set(1, input.get('applicants').get(1)
                .set('balance', '34940.34')
            ).set(2, input.get('applicants').get(2)
                .set('balance', '900.01')
            ))
        ),
        'Should transform applicants\' balance'
    );

    t.true(Immutable.is(
        transform(input, integerMatcher, integerTransformer),
        input.set('available', 1).set('monthsOnMarket', 8)
            .set('applicants', input.get('applicants')
                .set(0, input.get('applicants').get(0)
                    .set('yearsAtEmployer', 17)
                )
            )
        ),
        'Should transform all integer fields'
    );

    t.true(Immutable.is(
        transform(input, booleanMatcher, booleanTransformer),
        input.set('available', true)
            .set('applicants', input.get('applicants')
                .set(0, input.get('applicants').get(0)
                    .set('isEmployed', true)
                ).set(1, input.get('applicants').get(1)
                    .set('isEmployed', false)
                ).set(2, input.get('applicants').get(2)
                    .set('isEmployed', false)
                )
            )
        ),
        'Should transform available and applicants\' isEmployed'
    );

    t.end();
});
