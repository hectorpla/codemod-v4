jest.mock('../v3-FormItemFieldDecorator-to-ItemComponent', () => {
  return Object.assign(
    require.requireActual('../v3-FormItemFieldDecorator-to-ItemComponent'),
    {
      parser: 'babylon',
    },
  );
});

const tests = ['simple', 'completeForm'];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const testUnit = 'v3-FormItemFieldDecorator-to-ItemComponent';

describe(testUnit, () => {
  tests.forEach(test =>
    defineTest(__dirname, testUnit, undefined, `${testUnit}/${test}`),
  );
});
