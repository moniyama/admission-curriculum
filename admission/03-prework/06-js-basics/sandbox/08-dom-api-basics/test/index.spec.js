const fs = require('fs');
const esprima = require('esprima');
const { esprima: utils } = require('@laboratoria/prework-test-utils');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(__dirname + '/../src/index.html', 'utf-8');
const page = new JSDOM(html);
const { window } = page;
const { document } = window;

const script = fs.readFileSync(__dirname + '/../src/index.js', 'utf-8');
const astLocs = esprima.parseScript(script, { loc: true });
const ast = esprima.parseScript(script);

const functionExpressions = utils.getAll(ast.body, 'VariableDeclaration');

describe('JS Basics: DOM', () => {
  it('Al menos un elemento con id', () => {
    expect(document.body.querySelector('[id]')).not.toBe(null);
  });
  it('Al menos un elemento con class', () => {
    expect(document.body.querySelector('[class]')).not.toBe(null);
  });
  it('Al menos un elemento sin id ni class y con la misma etiqueta q el class de arriba', () => {
    const tag = document.body.querySelector('[class]').localName
    expect(document.body.querySelector(`${tag}:not([id]):not([class])`)).not.toBe(null);
  });
  // it('Un getElementById con un id q exista', () => {
  // });
  // it('Un querySelector con un selector que exista', () => {
  // });
  // it('Una definición de una function', () => {
  // });
  // it('Un addEventListener sobre un elemento existente, un evento valido y un callback existente', () => {
  // });
});
