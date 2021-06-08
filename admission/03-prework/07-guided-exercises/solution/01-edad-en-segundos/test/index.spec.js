const path = require('path');
const { e2e: { initStaticServer, stopStaticServer, regExpEscape } } = require('@laboratoria/prework-test-utils');
const Browser = require('zombie');

Browser.localhost('localhost', 5000);
const srcPath = path.normalize(__dirname + '/../src');
let server;
const browser = new Browser();

const testConversion = async ({ page, done, anios, segundos }) => {
  page.on('dialog', (dialog) => {
    dialog.accept(`${anios}`);
  });
  await page.goto('http://localhost:5000');

  // Buscamos los nodos q sean texto
  const message = await page.$eval('body', (el) => Array.prototype.filter
    .call(el.childNodes, (child, index) => index === 0 && child.nodeType === Node.TEXT_NODE)
    .map((child) => child.textContent)
  );
  expect(message.length).toBeGreaterThan(0);

  const aniosEscaped = regExpEscape(` ${anios}`);
  const segundosEscaped = regExpEscape(` ${segundos}`);
  const regexp = new RegExp(`${aniosEscaped}.*${segundosEscaped}`, 'g');
  expect(regexp.test(message)).toBe(true);
  done();
}

describe('Guided Exercises: Edad en segundos', () => {
  beforeAll((done) => {
    server = initStaticServer(srcPath, {}, done);
  });

  fit('La página tiene el title correcto', async (done) => {
    // console.log(browser.html('title'))
    browser.visit('/', function() {
      expect(browser.evaluate('document.title')).toBe('Edad en segundos');
      done();
    });
  });

  it('El prompt muestra el mensaje correcto', async (done) => {
    let message;
    page.on('dialog', (dialog) => {
      message = dialog.message();
      dialog.accept('');
    });
    await page.goto('http://localhost:5000');
    expect(message).toBe('¿Cuál es tu edad?');
    done();
  });

  it('20 Años === 630720000 segundos', async (done) => {
    const anios = 20;
    const segundos = 630720000;
    await testConversion({
      page,
      done,
      anios,
      segundos,
    })
  });

  it('0 Años === 0 segundos', async (done) => {
    const anios = 0;
    const segundos = 0;
    await testConversion({
      page,
      done,
      anios,
      segundos,
    })
  });

  it('String vacio es 0', async (done) => {
    const anios = '';
    const segundos = 0;
    await testConversion({
      page,
      done,
      anios,
      segundos,
    })
  });

  it('Algo que no es un número es NaN', async (done) => {
    const anios = 'string';
    const segundos = NaN;
    await testConversion({
      page,
      done,
      anios,
      segundos,
    })
  });

  afterAll((done) => {
    stopStaticServer(server, done);
  });
});
