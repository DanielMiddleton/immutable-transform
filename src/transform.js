import Immutable, { Iterable } from 'immutable';

const deepTransform = (iterable, matcher, transformer) => {
    return iterable.map((value, key, iterable) => {
        if (matcher(value, key, iterable)) {
            return transformer(value, key, iterable);
        } 

        if (Iterable.isIterable(value)) {
            return deepTransform(value, matcher, transformer);
        }

        return value;
    });
}

export default deepTransform;
