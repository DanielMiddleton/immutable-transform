import tape from 'tape';
import Immutable from 'immutable';

import transform from '../index';

import { dateKeyMatcher,
        currencyMatcher,
        integerMatcher,
        booleanMatcher,
        oddsMatcher,
        oddIndexMatcher } from './matchers';

import { dateTransformer,
        currencyTransformer,
        integerTransformer,
        booleanTransformer,
        square } from './transformers';

tape.test('Map', t => {
    const input = Immutable.Map({
        name: 'Henry',
        birthdate: '12-25-1960',
        address: '267 Woodington Lane',
        zip: '77396',
        balance: '$3,340.00',
        isEmployed: 'y',
        yearsAtEmployer: '17'
    });

    t.true(Immutable.is(
        transform(input, dateKeyMatcher, dateTransformer), 
        input.set('birthdate', new Date('12-25-1960').toISOString())
        ),
        'Should transform birthdate'
    );

    t.true(Immutable.is(
        transform(input, currencyMatcher, currencyTransformer), 
        input.set('balance', '3340.00')
        ),
        'Should transform currency'
    );
    
    t.true(Immutable.is(
        transform(input, integerMatcher, integerTransformer),
        input.set('yearsAtEmployer', 17)
        ),
        'Should transform yearsAtEmployer'
    );
    
    t.true(Immutable.is(
        transform(input, booleanMatcher, booleanTransformer), 
        input.set('isEmployed', true)
        ),
        'Should transform isEmployed'
    );
    
    t.end()
});

tape.test('List', t => {
    const input = Immutable.List(['true', true, '0', '7-25-1990', '$34,234,343,500.99']);

    t.true(Immutable.is(
        transform(input, currencyMatcher, currencyTransformer),
        input.set(4, '34234343500.99')
        ),
        'Should transform currency value'
    );

    t.true(Immutable.is(
        transform(input, integerMatcher, integerTransformer),
        input.set(2, 0)
        ),
        'Should transform integer value'
    );

    t.true(Immutable.is(
        transform(input, booleanMatcher, booleanTransformer),
        input.set(0, true).set(2, false)
        ),
        'Should transform boolean value'
    );

    t.end();
});

tape.test('Range by Value', t => {
    const input = Immutable.Range(10,100);
    const transformed = transform(input, oddsMatcher, square);

    t.equals(transformed.get(0), 10, 'Should not modify even numbers');
    t.equals(transformed.get(1), 121, 'Should modify odd numbers');
    t.equals(transformed.get(2), 12, 'Should not modify even numbers');
    t.equals(transformed.get(3), 169, 'Should modify odd numbers');
    t.equals(transformed.get(89), 99 * 99, 'Should modify odd numbers');
    t.equals(transformed.last(), transformed.get(89), 'Value should be same regardless of method of access');

    t.end()
});

tape.test('Range by Index', t => {
    const input = Immutable.Range(1, 101, 3);
    const transformed = transform(input, oddIndexMatcher, square);

    t.equals(transformed.get(0), 1);
    t.equals(transformed.get(1), 16);
    t.equals(transformed.get(2), 7);
    t.equals(transformed.get(3), 100);
    t.equals(transformed.get(33), input.last() * input.last());
    // t.equals(transformed.last(), transformed.get(33), 'Value should be same regardless of method of access');
    t.end();
});

tape.test('Infinite Range', t => {
    const input = Immutable.Range();
    const transformed = transform(input, oddsMatcher, square);

    t.equals(transformed.get(0), 0);
    t.equals(transformed.get(1), 1);
    t.equals(transformed.get(2), 2);
    t.equals(transformed.get(3), 9);
    t.equals(transformed.get(5), 25);
    t.equals(transformed.get(100), 100);
    t.equals(transformed.get(101), 10201);
    t.end();
});
