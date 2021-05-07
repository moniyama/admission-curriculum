const fs = require('fs');
const esprima = require('esprima');
const utils = require('../06-variables/utils');

const script = fs.readFileSync(__dirname + '/index.js', 'utf-8');
const ast = esprima.parseScript(script, { comment: true });

const consoleLogsArgs = utils.getAllConsoleLogLastArgs(ast);

const binaryOperatorsUsed = consoleLogsArgs
  .filter((arg) => ['BinaryExpression', 'LogicalExpression'].includes(arg.type))
  .reduce((args, arg) => (
    [...args, ...utils.getAll(arg, 'BinaryExpression')]
  ), [])
  .map((arg) => arg.operator);

describe('HTML Basics: Numbers', () => {
  it('Un console.log de un numero positivo', () => {
    const positiveNumbers = consoleLogsArgs.filter(
      (arg) => typeof arg.value === 'number'
    );
    expect(positiveNumbers.length).toBeGreaterThan(0);
  });
  it('Un console.log de un numero negativo', () => {
    const negativeNumbers = consoleLogsArgs.filter((arg) => (
      arg.type === 'UnaryExpression'
      && arg.operator === '-'
      && typeof arg.argument.value === 'number'
    ));
    expect(negativeNumbers.length).toBeGreaterThan(0);
  });
  it('Un console.log de una operación aritmética `+`', () => {
    expect(binaryOperatorsUsed).toContain('+');
  });
  it('Un console.log de una operación aritmética `-`', () => {
    expect(binaryOperatorsUsed).toContain('-');
  });
  it('Un console.log de una operación aritmética `*`', () => {
    expect(binaryOperatorsUsed).toContain('*');
  });
  it('Un console.log de una operación aritmética `/`', () => {
    expect(binaryOperatorsUsed).toContain('/');
  });
});
