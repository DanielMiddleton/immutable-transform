export const dateKeyMatcher = (value, key) => typeof key === 'string' && key.indexOf('date') != -1;

export const integerMatcher = (value, key) => !isNaN(+value) && parseInt(value) === parseFloat(value) && key !== 'zip';

export const currencyMatcher = value => /^\$(\d{1,3},?)+(\.\d{2})?$/.test(value);

export const booleanMatcher = value => typeof value === 'boolean' || ['y','n','1','0',1,0,'true','false','yes','no'].indexOf(value) !== -1;

export const oddsMatcher = (value, key) => integerMatcher(value, key) && +value % 2 === 1;

export const oddIndexMatcher = (value, key) => oddsMatcher(key, key);
