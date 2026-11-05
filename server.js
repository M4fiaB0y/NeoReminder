const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml'
};

// Load University Routine Database
let routinesData = null;
try {
  const { UNIVERSITY_ROUTINES } = require('./js/sample-data.js');
  routinesData = UNIVERSITY_ROUTINES;
} catch (e) {
  console.warn('Could not preload routines in server:', e.message);
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Route: List All Batches
  if (pathname === '/api/batches') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (!routinesData) {
      res.end(JSON.stringify({ error: 'Routines data not loaded' }));
      return;
    }
    const list = Object.values(routinesData).map(b => ({
      key: b.key,
      name: b.name,
      batch: b.batch,
      section: b.section,
      batchNumber: b.batchNumber,
      classCount: (b.classes || []).length
    }));
    res.end(JSON.stringify(list));
    return;
  }

  // API Route: Get Specific Routine
  if (pathname.startsWith('/api/routine')) {
    let key = pathname.replace('/api/routine', '').replace(/^\//, '');
    if (!key) {
      key = parsedUrl.searchParams.get('batch');
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (!routinesData) {
      res.end(JSON.stringify({ error: 'Routines data not loaded' }));
      return;
    }

    if (!key) {
      res.end(JSON.stringify(routinesData));
      return;
    }

    const cleanKey = key.toLowerCase().trim();
    const routine = routinesData[cleanKey] || Object.values(routinesData).find(b =>
      b.key.toLowerCase() === cleanKey ||
      b.name.toLowerCase().replace(/\s+/g, '') === cleanKey.replace(/\s+/g, '')
    );

    if (routine) {
      res.end(JSON.stringify(routine));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Batch routine not found', requested: key }));
    }
    return;
  }

  // Static File Serving
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`API Batches: http://localhost:${PORT}/api/batches`);
});
