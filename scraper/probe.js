const { chromium } = require('playwright');
const fs = require('fs');

const CATALOG_URL = 'https://cyberab.org/Catalog#!/c/s/Results/Format/list/Page/1/Size/9/Sort/NameAscending';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
const API_BASE = 'https://cyberab.org/DesktopModules/ClarityEcommerce/API-Storefront';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ userAgent: USER_AGENT, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Also capture the real search response as it flies by
  let capturedSearchBody = null;
  page.on('response', async resp => {
    if (resp.url().includes('Searching/Stores/Query')) {
      try {
        capturedSearchBody = await resp.json();
        console.log('  Captured live search response!');
      } catch(_) {}
    }
  });

  await page.goto(CATALOG_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  // 1. Probe the search response captured live
  if (capturedSearchBody) {
    console.log('\n── Live search response (top-level keys) ──');
    for (const [k, v] of Object.entries(capturedSearchBody)) {
      const preview = JSON.stringify(v).slice(0, 150);
      console.log(`  ${k.padEnd(25)} → ${preview}`);
    }
    fs.writeFileSync('/Users/andymini/Downloads/cmmcreview/scraper/search_response.json',
      JSON.stringify(capturedSearchBody, null, 2));
    console.log('\nFull search response saved to search_response.json');
  }

  // 2. Also probe by calling the search API fresh and dump full JSON
  const searchData = await page.evaluate(async (base) => {
    const r = await fetch(`${base}/Providers/Searching/Stores/Query?Page=1&PageFormat=list&PageSetSize=5&PageSize=9&Sort=NameAscending`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    const json = await r.json();
    return json;
  }, API_BASE);

  console.log('\n── Fresh search API (top-level keys + array lengths) ──');
  for (const [k, v] of Object.entries(searchData)) {
    let info = typeof v;
    if (Array.isArray(v)) info = `Array[${v.length}]`;
    else if (v && typeof v === 'object') info = `Object{${Object.keys(v).join(',').slice(0,60)}}`;
    else info = JSON.stringify(v).slice(0, 80);
    console.log(`  ${k.padEnd(25)} → ${info}`);
  }

  // Dump ALL keys recursively at depth 1
  console.log('\n── First result item (if any) ──');
  const possibleArrayKeys = Object.keys(searchData).filter(k => Array.isArray(searchData[k]) && searchData[k].length > 0);
  for (const k of possibleArrayKeys) {
    console.log(`  searchData.${k}[0] =`, JSON.stringify(searchData[k][0]).slice(0, 400));
  }

  fs.writeFileSync('/Users/andymini/Downloads/cmmcreview/scraper/search_fresh.json',
    JSON.stringify(searchData, null, 2));
  console.log('\nFull fresh search response saved to search_fresh.json');

  // 3. Probe one store detail (ID from the live intercepted requests)
  const storeDetail = await page.evaluate(async (base) => {
    const r = await fetch(`${base}/Stores/Store/ID/54485`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    return r.json();
  }, API_BASE);

  console.log('\n── Store Detail /Stores/Store/ID/54485 (top-level keys) ──');
  for (const [k, v] of Object.entries(storeDetail)) {
    let info;
    if (Array.isArray(v)) info = `Array[${v.length}] ${JSON.stringify(v).slice(0,100)}`;
    else if (v && typeof v === 'object') info = `Object{${Object.keys(v).slice(0,8).join(',')}}`;
    else info = JSON.stringify(v);
    console.log(`  ${k.padEnd(30)} → ${info.slice(0,120)}`);
  }

  fs.writeFileSync('/Users/andymini/Downloads/cmmcreview/scraper/store_detail.json',
    JSON.stringify(storeDetail, null, 2));
  console.log('\nFull store detail saved to store_detail.json');

  await browser.close();
}

main().catch(console.error);
