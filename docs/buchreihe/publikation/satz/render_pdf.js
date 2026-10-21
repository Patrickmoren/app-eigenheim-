// Rendert buchblock.html mit Chromium (Playwright) zu band-1_buchblock.pdf.
// Aufruf: NODE_PATH=$(npm root -g) node render_pdf.js
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.join(__dirname, 'buchblock.html'), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: path.join(__dirname, 'band-1_buchblock.pdf'),
    preferCSSPageSize: true,
    printBackground: false,
    displayHeaderFooter: false,
    tagged: true,
  });
  await browser.close();
  console.log('band-1_buchblock.pdf geschrieben');
})();
