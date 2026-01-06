const http = require('http');

const postData = JSON.stringify({});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/',
  method: 'GET',
  timeout: 5000
};

console.log('Testing connectivity to 127.0.0.1:3000...');

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', () => {}); // Consume
  res.on('end', () => {
    console.log('Connectivity check passed.');
    
    // Now try to hit the auth endpoint
    // We can't easily simulate the full NextAuth CSRF flow + Callback with raw HTTP, 
    // but we can check if the server logs at least SHOW the request coming in.
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
