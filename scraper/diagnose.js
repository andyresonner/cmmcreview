const { chromium } = require('playwright');
const fs = require('fs');

const CATALOG_URL =
  'https://cyberab.org/Catalog#!/c/s/Results/Format/list/Page/1/Size/9/Sort/NameAscending';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    viewport: { width: 1440, height: 900 },
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
  });

  const allRequests = [];
  const allResponses = [];
  const jsonResponses = [];

  const page = await context.newPage();

  page.on('request', req => {
    allRequests.push({ url: req.url(), method: req.method(), type: req.resourceType() });
  });

  page.on('response', async resp => {
    const url = resp.url();
    const ct = resp.headers()['content-type'] || '';
    const status = resp.status();
    allResponses.push({ url, status, ct: ct.slice(0, 60) });
    if (ct.includes('json')) {
      try {
        const body = await resp.json();
        jsonResponses.push({ url, body });
        console.log(`  [JSON] ${url} → ${JSON.stringify(body).slice(0, 200)}`);
      } catch (_) {}
    }
  });

  console.log('Navigating…');
  try {
    await page.goto(CATALOG_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch (e) {
    console.log('goto error:', e.message);
  }

  console.log('Waiting 8s for JS to settle…');
  await new Promise(r => setTimeout(r, 8000));

  // Also wait for networkidle
  try { await page.waitForLoadState('networkidle', { timeout: 10000 }); } catch (_) {}

  // Dump page title and URL
  console.log('\nPage title:', await page.title());
  console.log('Page URL:', page.url());

  // Dump first 3000 chars of body text
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 3000));
  console.log('\n── Body text (3000 chars) ──');
  console.log(bodyText);

  // Dump HTML structure - look for specific elements
  const structure = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div[class]')).slice(0, 40);
    return divs.map(d => d.className + ' | children: ' + d.children.length);
  });
  console.log('\n── div classes (first 40) ──');
  structure.forEach(s => console.log(' ', s));

  // Check for any data-ng-* attributes (AngularJS)
  const ngElems = await page.evaluate(() => {
    const all = document.querySelectorAll('[ng-repeat],[ng-controller],[ng-app]');
    return Array.from(all).slice(0, 20).map(el => ({
      tag: el.tagName,
      ngRepeat: el.getAttribute('ng-repeat'),
      ngCtrl: el.getAttribute('ng-controller'),
      class: el.className.slice(0, 80),
    }));
  });
  console.log('\n── AngularJS elements ──');
  ngElems.forEach(e => console.log(' ', JSON.stringify(e)));

  // Log all XHR/fetch requests
  const apiReqs = allRequests.filter(r => ['xhr','fetch'].includes(r.type));
  console.log(`\n── XHR/Fetch requests (${apiReqs.length}) ──`);
  apiReqs.forEach(r => console.log(`  [${r.method}] ${r.url}`));

  // Log all JSON responses
  console.log(`\n── JSON responses (${jsonResponses.length}) ──`);
  jsonResponses.forEach(r => {
    const preview = JSON.stringify(r.body).slice(0, 300);
    console.log(`  ${r.url}`);
    console.log(`    ${preview}`);
  });

  // Save full HTML
  const html = await page.content();
  fs.writeFileSync('/Users/andymini/Downloads/cmmcreview/scraper/page_dump.html', html);
  console.log('\nFull HTML saved to page_dump.html');

  // Save all requests to a file
  fs.writeFileSync(
    '/Users/andymini/Downloads/cmmcreview/scraper/network_log.json',
    JSON.stringify({ requests: allRequests, jsonResponses }, null, 2)
  );
  console.log('Network log saved to network_log.json');

  await browser.close();
}

main().catch(console.error);
