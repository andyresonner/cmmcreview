/**
 * Cyber AB CMMC Marketplace — Final Scraper
 *
 * API (Clarity Ecommerce / DotNetNuke):
 *   Search:  GET /API-Storefront/Providers/Searching/Stores/Query?Page=N&PageSize=100&Sort=NameAscending
 *            → Returns { Total, TotalPages, ResultIDs: [id, id, ...] }
 *
 *   Detail:  GET /API-Storefront/Stores/Store/ID/{ID}
 *            → Returns full org record
 *
 * Total: 6,838 orgs  |  Est runtime: ~15 min with concurrency=10
 */

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const API_BASE    = 'https://cyberab.org/DesktopModules/ClarityEcommerce/API-Storefront';
const CATALOG_URL = 'https://cyberab.org/Catalog#!/c/s/Results/Format/list/Page/1/Size/9/Sort/NameAscending';
const USER_AGENT  = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

const OUT_JSON = path.join(__dirname, 'cyberab_listings.json');
const OUT_CSV  = path.join(__dirname, 'cyberab_listings.csv');

const SEARCH_PAGE_SIZE = 100;
const CONCURRENCY      = 10;
const SEARCH_DELAY_MS  = 1200;
const DETAIL_DELAY_MS  = 600;

// ── Helpers ────────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));
const jitter = (base, spread = 400) => sleep(base + Math.floor(Math.random() * spread));

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<')
             .replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
}

function parseJsonAttr(val) {
  if (!val || val === '{}' || val === '[]') return [];
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
    // Object with boolean flags → return keys that are true
    return Object.entries(parsed).filter(([,v]) => v === true || v === 'true').map(([k]) => k);
  } catch (_) { return []; }
}

function escapeCsv(v) {
  if (v == null) return '';
  const s = Array.isArray(v) ? v.join('; ') : String(v);
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(records) {
  const cols = ['name','type','website','city','state','country','phone','email',
                 'description','cmmcServices','certifications','logo',
                 'profileUrl','storeId','hasTier3','yearFounded','ownership',
                 'naicsCode','usStatesSupported','remoteGlobally','source'];
  return [cols.join(','),
    ...records.map(r => cols.map(c => escapeCsv(r[c])).join(','))
  ].join('\n');
}

// ── Map store detail response → our schema ────────────────────────────────────
function mapDetail(d) {
  const contact = d.Contact || {};
  const addr    = contact.Address || {};
  const attrs   = d.SerializableAttributes || {};

  // Services: parse CapServices JSON boolean map
  const capRaw   = attrs.CapServices?.Value || '';
  const services = parseJsonAttr(capRaw);

  // Certifications
  const certs = [];
  if (d.HasTier3) certs.push('Tier 3 Eligible');
  const certRaw = attrs.Certifications?.Value || '';
  parseJsonAttr(certRaw).forEach(c => certs.push(c));
  if (attrs.Memberships?.Value) parseJsonAttr(attrs.Memberships.Value).forEach(c => certs.push(c));

  // Logo: construct from stored filename if available
  const logoFile = attrs.RPOProfileImage?.Value || attrs.C3PAOProfileImage?.Value ||
                   attrs.RPAProfileImage?.Value  || attrs.ProfileImage?.Value || '';
  // Can't reliably get CDN URL without extra requests; store filename as indicator
  const logo = logoFile ? `[${logoFile}]` : '';

  // Profile URL: SeoUrl is like "RPO-61432-Gavii-Cybersecurity"
  const profileUrl = d.SeoUrl
    ? `https://cyberab.org/Catalog#!/c/m/${d.SeoUrl}`
    : '';

  return {
    storeId:          d.ID || d.CustomKey || null,
    name:             d.Name || '',
    type:             d.TypeKey || '',
    website:          contact.Website1 || '',
    city:             addr.City || '',
    state:            addr.RegionCode || addr.RegionName || '',
    country:          addr.CountryCode || addr.CountryName || '',
    phone:            contact.Phone1 || '',
    email:            contact.Email1 || '',
    description:      stripHtml(d.Description || ''),
    cmmcServices:     services,
    certifications:   certs,
    logo,
    profileUrl,
    hasTier3:         d.HasTier3 || false,
    yearFounded:      attrs.YearFounded?.Value || '',
    ownership:        attrs.Ownership?.Value || '',
    naicsCode:        attrs.NAICSCode?.Value || '',
    usStatesSupported:attrs.USStatesSupported?.Value || '',
    remoteGlobally:   attrs.RemoteServicesGlobally?.Value || '',
    source:           'cyberab',
  };
}

// ── API fetch via browser context (inherits cookies/session) ──────────────────
async function apiGet(page, url) {
  return page.evaluate(async (u) => {
    const r = await fetch(u, {
      credentials: 'include',
      headers: { Accept: 'application/json, text/plain, */*' },
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }, url);
}

// ── Step 1: collect all store IDs via paginated search ────────────────────────
async function collectAllIds(page) {
  const allIds = [];
  let pageNum = 1;
  let totalPages = null;

  console.log(`[Search] Paginating search (${SEARCH_PAGE_SIZE}/page)…`);

  while (true) {
    const url = `${API_BASE}/Providers/Searching/Stores/Query?Page=${pageNum}&PageFormat=list&PageSetSize=5&PageSize=${SEARCH_PAGE_SIZE}&Sort=NameAscending`;

    let data;
    try {
      data = await apiGet(page, url);
    } catch (e) {
      console.log(`  [Search] Page ${pageNum} error: ${e.message} — retrying in 3s`);
      await sleep(3000);
      try { data = await apiGet(page, url); } catch (_) {
        console.log(`  [Search] Page ${pageNum} failed again, skipping`);
        pageNum++;
        if (totalPages && pageNum > totalPages) break;
        continue;
      }
    }

    if (!totalPages) {
      totalPages = data.TotalPages ?? Math.ceil((data.Total || 0) / SEARCH_PAGE_SIZE);
      console.log(`[Search] Total orgs: ${data.Total} | Pages: ${totalPages}`);
    }

    const ids = data.ResultIDs || [];
    ids.forEach(id => allIds.push(id));

    process.stdout.write(`\r  Collected ${allIds.length} IDs (page ${pageNum}/${totalPages})   `);

    if (pageNum >= totalPages || ids.length === 0) break;
    pageNum++;
    await jitter(SEARCH_DELAY_MS, 500);
  }

  console.log(`\n[Search] Done — ${allIds.length} unique IDs collected.`);
  return [...new Set(allIds)]; // deduplicate
}

// ── Step 2: fetch all store details with concurrency ─────────────────────────
async function fetchAllDetails(page, ids) {
  console.log(`\n[Detail] Fetching ${ids.length} store details (concurrency=${CONCURRENCY})…`);
  const records = [];
  let done = 0;
  let errors = 0;

  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    const chunk = ids.slice(i, i + CONCURRENCY);

    const results = await Promise.allSettled(
      chunk.map(id => apiGet(page, `${API_BASE}/Stores/Store/ID/${id}`))
    );

    results.forEach((res, idx) => {
      if (res.status === 'fulfilled' && res.value) {
        records.push(mapDetail(res.value));
      } else {
        errors++;
      }
    });

    done += chunk.length;
    const pct = ((done / ids.length) * 100).toFixed(1);
    process.stdout.write(`\r  [Detail] ${done}/${ids.length} (${pct}%)  ${errors} errors   `);

    // Progress checkpoint every 500 records
    if (done % 500 === 0) {
      const byType = {};
      records.forEach(r => { byType[r.type] = (byType[r.type]||0)+1; });
      console.log(`\n  Checkpoint: ${records.length} records | ${JSON.stringify(byType)}`);
    }

    await jitter(DETAIL_DELAY_MS, 300);
  }

  console.log(`\n[Detail] Done. ${records.length} records, ${errors} errors.`);
  return records;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('='.repeat(62));
  console.log(' Cyber AB CMMC Marketplace Scraper');
  console.log(' Strategy: ResultIDs from search → Store/ID/{id} detail');
  console.log('='.repeat(62));
  const t0 = Date.now();

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent: USER_AGENT,
    viewport: { width: 1440, height: 900 },
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
  });
  const page = await ctx.newPage();

  console.log('\n[Init] Warming up browser session…');
  await page.goto(CATALOG_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await sleep(2000);
  console.log('[Init] Session ready.');

  // Step 1: get all IDs
  const ids = await collectAllIds(page);

  // Step 2: fetch details
  let records = await fetchAllDetails(page, ids);

  await browser.close();

  // Deduplicate by storeId
  const seen = new Set();
  records = records.filter(r => {
    const key = String(r.storeId || r.name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // ── Save ──
  const elapsed = ((Date.now() - t0) / 1000).toFixed(0);
  console.log('\n' + '='.repeat(62));
  console.log(` Saving ${records.length} records  (${elapsed}s elapsed)`);
  console.log('='.repeat(62));

  fs.writeFileSync(OUT_JSON, JSON.stringify(records, null, 2));
  console.log(`JSON → ${OUT_JSON}`);
  fs.writeFileSync(OUT_CSV, toCsv(records));
  console.log(`CSV  → ${OUT_CSV}`);

  // ── Type breakdown ──
  const byType = {};
  records.forEach(r => { const t = r.type || 'Unknown'; byType[t] = (byType[t]||0)+1; });
  console.log('\n── Breakdown by type ──');
  Object.entries(byType).sort((a,b)=>b[1]-a[1]).forEach(([t,n]) =>
    console.log(`  ${t.padEnd(30)} ${n}`)
  );
  console.log(`\n  TOTAL: ${records.length} organizations\n`);

  // ── Sample 5 ──
  console.log('── Sample (first 5 records) ──');
  records.slice(0, 5).forEach((r, i) => {
    console.log(`\n[${i+1}] ${r.name}  (ID: ${r.storeId})`);
    console.log(`    Type:      ${r.type}  |  Tier3: ${r.hasTier3}`);
    console.log(`    Location:  ${r.city}, ${r.state} | ${r.country}`);
    console.log(`    Website:   ${r.website}`);
    console.log(`    Phone:     ${r.phone}`);
    console.log(`    Email:     ${r.email}`);
    console.log(`    Founded:   ${r.yearFounded}  Ownership: ${r.ownership}`);
    console.log(`    Services:  ${(r.cmmcServices||[]).slice(0,4).join(' | ')}`);
    console.log(`    Certs:     ${(r.certifications||[]).join(', ')}`);
    console.log(`    Desc:      ${(r.description||'').slice(0,150)}…`);
    console.log(`    Profile:   ${r.profileUrl}`);
  });

  console.log(`\nCompleted in ${elapsed}s`);
}

main().catch(e => { console.error('\nFatal:', e); process.exit(1); });
