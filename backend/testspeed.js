const http = require('http');

function req(path, token) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const opts = { hostname: 'localhost', port: 5000, path, headers: {} };
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    http.get(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, time: Date.now() - start, body: data.substring(0, 200) }));
    }).on('error', reject);
  });
}

async function main() {
  console.log('1. Testing root...');
  let r = await req('/');
  console.log('   Root:', r.time + 'ms', r.status);

  console.log('2. Testing login...');
  const loginRes = await new Promise((resolve, reject) => {
    const postData = JSON.stringify({email:'sundar.k@eec.srmrmp.edu.in', password:'faculty123'});
    const opts = { hostname:'localhost', port:5000, path:'/api/auth/login', method:'POST', headers:{'Content-Type':'application/json','Content-Length':postData.length} };
    const req2 = http.request(opts, (res) => { let d=''; res.on('data', c=>d+=c); res.on('end', () => resolve({status:res.statusCode, body:d})); });
    req2.on('error', reject);
    req2.write(postData);
    req2.end();
  });
  console.log('   Login:', loginRes.status);
  const token = JSON.parse(loginRes.body).token;

  console.log('3. Testing dashboard (faculty)...');
  r = await req('/api/dashboard/faculty', token);
  console.log('   Dashboard:', r.time + 'ms', r.status, r.body.substring(0, 100));

  console.log('4. Testing pending leaves...');
  r = await req('/api/leaves/pending', token);
  console.log('   Pending:', r.time + 'ms', r.status);

  process.exit();
}

main().catch(e => { console.error(e); process.exit(1); });
