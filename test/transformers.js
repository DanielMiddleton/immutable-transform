export const dateTransformer = value => new Date(value).toISOString();

export const integerTransformer = value => +value;

export const currencyTransformer = value => value.replace(/[$,]/g, '');

export const booleanTransformer = value => [true, 'true', 'y', '1', 'yes'].indexOf(value) !== -1;

export const square = value => value * value;
