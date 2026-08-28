/* eslint-disable @typescript-eslint/no-require-imports */
const https = require('https');

const HOST = 'novatool.in';
const KEY = 'a52a86efe6f041bd931a36f0e2bdadd8';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;

function fetchSitemapUrls() {
  return new Promise((resolve, reject) => {
    https.get(SITEMAP_URL, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(/<loc>(.*?)<\/loc>/g) || [];
        const urls = matches.map(m => m.replace(/<\/?loc>/g, '').trim());
        resolve(urls);
      });
    }).on('error', reject);
  });
}

function submitToIndexNow(endpoint, payload) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(payload);
    const url = new URL(endpoint);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'NovaTools-IndexNow-Script/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          endpoint,
          status: res.statusCode,
          statusMessage: res.statusMessage,
          body
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        endpoint,
        status: 500,
        statusMessage: err.message,
        body: ''
      });
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('=== NOVATOOLS INDEXNOW SUBMISSION ===\n');
  console.log(`Host: ${HOST}`);
  console.log(`Key: ${KEY}`);
  console.log(`Key Location: ${KEY_LOCATION}`);

  console.log('\nFetching live indexable public URLs from sitemap.xml...');
  const urls = await fetchSitemapUrls();
  console.log(`Discovered ${urls.length} public URLs in sitemap.`);

  // Filter out any accidental private routes
  const cleanUrls = urls.filter(u => {
    const isPrivate = ['/admin', '/api', '/auth', '/favorites', '/profile', '/reset-password'].some(p => u.includes(p));
    return !isPrivate && u.startsWith(`https://${HOST}`);
  });

  console.log(`Verified ${cleanUrls.length} strictly public URLs ready for IndexNow submission.\n`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: cleanUrls
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow'
  ];

  for (const ep of endpoints) {
    console.log(`Submitting ${cleanUrls.length} URLs to ${ep}...`);
    const res = await submitToIndexNow(ep, payload);
    const success = res.status === 200 || res.status === 202;
    console.log(`[${success ? 'SUCCESS' : 'FAILED'}] Status: ${res.status} ${res.statusMessage}`);
    if (res.body) {
      console.log(`  Response: ${res.body}`);
    }
  }

  console.log('\n=== INDEXNOW SUBMISSION COMPLETED ===');
}

main().catch(console.error);
