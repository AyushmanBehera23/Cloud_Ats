// Real CloudATS HTTP Traffic & Load Generator
// Sends real HTTP GET & POST requests to the API Gateway at http://localhost:8080

const http = require('http');

const TARGET_HOST = 'localhost';
const TARGET_PORT = 8080; // API Gateway Port
const ENDPOINTS = [
  '/api/analytics/dashboard',
  '/api/resumes',
  '/api/scores/specializations',
  '/api/recruiter/jobs'
];

let isSpikeActive = false;
let totalRequestsSent = 0;
let successfulRequests = 0;
let failedRequests = 0;

function sendSingleRequest() {
  const path = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
  const startTime = Date.now();

  const req = http.request({
    hostname: TARGET_HOST,
    port: TARGET_PORT,
    path: path,
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  }, (res) => {
    const latency = Date.now() - startTime;
    totalRequestsSent++;
    if (res.statusCode >= 200 && res.statusCode < 400) {
      successfulRequests++;
    } else {
      failedRequests++;
    }
    console.log(`[TRAFFIC-GEN] GET http://${TARGET_HOST}:${TARGET_PORT}${path} -> ${res.statusCode} (${latency}ms)`);
  });

  req.on('error', (err) => {
    totalRequestsSent++;
    failedRequests++;
    console.log(`[TRAFFIC-GEN] GET http://${TARGET_HOST}:${TARGET_PORT}${path} -> Connection Error (${err.message})`);
  });

  req.end();
}

console.log("⚡ Starting Real CloudATS HTTP Traffic Generator on port 8080...");

// Send baseline traffic: 5 requests per second
setInterval(() => {
  const requestsToFire = isSpikeActive ? 50 : 5;
  for (let i = 0; i < requestsToFire; i++) {
    sendSingleRequest();
  }
}, 1000);
