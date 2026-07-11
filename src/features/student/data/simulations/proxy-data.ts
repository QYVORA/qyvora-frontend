export interface ProxyResponse {
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
}

export interface ProxyRequest {
  id: string;
  method: string;
  url: string;
  path: string;
  headers: Record<string, string>;
  body?: string;
  response: ProxyResponse;
  isInteresting: boolean;
  vulnerability?: string;
}

export interface ProxyTask {
  description: string;
  hint: string;
  flag: string;
}

export interface ProxyScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requests: ProxyRequest[];
  tasks: ProxyTask[];
  flag: string;
  cpReward: number;
}

export const PROXY_SCENARIOS: ProxyScenario[] = [
  {
    id: 'proxy-intercept-1',
    title: 'Login Interception',
    description: 'Intercept HTTP requests to find cleartext credentials being transmitted.',
    difficulty: 'beginner',
    requests: [
      {
        id: 'req-001',
        method: 'GET',
        url: 'http://10.0.0.50/login',
        path: '/login',
        headers: {
          'Host': '10.0.0.50',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
          'Connection': 'keep-alive',
        },
        response: {
          statusCode: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'text/html', 'Server': 'nginx/1.24.0' },
          body: '<!DOCTYPE html><html><head><title>NovaCorp Login</title></head><body><form method="POST"><input name="username" placeholder="Username"><input name="password" type="password" placeholder="Password"><button type="submit">Login</button></form></body></html>',
        },
        isInteresting: false,
      },
      {
        id: 'req-002',
        method: 'GET',
        url: 'http://10.0.0.50/css/style.css',
        path: '/css/style.css',
        headers: { 'Host': '10.0.0.50', 'Accept': 'text/css' },
        response: { statusCode: 200, statusText: 'OK', headers: { 'Content-Type': 'text/css' }, body: 'body { font-family: Arial; background: #1a1a2e; }' },
        isInteresting: false,
      },
      {
        id: 'req-003',
        method: 'GET',
        url: 'http://10.0.0.50/js/app.js',
        path: '/js/app.js',
        headers: { 'Host': '10.0.0.50', 'Accept': '*/*' },
        response: { statusCode: 200, statusText: 'OK', headers: { 'Content-Type': 'application/javascript' }, body: 'document.querySelector("form").addEventListener("submit", function(e) { console.log("Form submitted"); });' },
        isInteresting: false,
      },
      {
        id: 'req-004',
        method: 'POST',
        url: 'http://10.0.0.50/api/login',
        path: '/api/login',
        headers: {
          'Host': '10.0.0.50',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': '45',
          'Origin': 'http://10.0.0.50',
          'Referer': 'http://10.0.0.50/login',
        },
        body: 'username=admin&password=Sup3rS3cret!2024',
        response: {
          statusCode: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json', 'Set-Cookie': 'session=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRtaW4ifQ.abc123; Path=/' },
          body: '{"success":true,"user":{"id":1,"role":"administrator","token":"eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRtaW4ifQ.abc123"}}',
        },
        isInteresting: true,
        vulnerability: 'Cleartext credentials in POST body',
      },
      {
        id: 'req-005',
        method: 'GET',
        url: 'http://10.0.0.50/api/user/1',
        path: '/api/user/1',
        headers: {
          'Host': '10.0.0.50',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRtaW4ifQ.abc123',
          'Accept': 'application/json',
        },
        response: { statusCode: 200, statusText: 'OK', headers: { 'Content-Type': 'application/json' }, body: '{"id":1,"username":"admin","email":"admin@novacorp.io","role":"administrator"}' },
        isInteresting: false,
      },
    ],
    tasks: [
      { description: 'Find the request containing cleartext credentials', hint: 'Look at the POST request body', flag: 'FLAG{proxy_cleartext_creds_found}' },
      { description: 'What password was transmitted?', hint: 'Check the login POST body', flag: 'FLAG{proxy_password_extracted}' },
    ],
    flag: 'FLAG{proxy_intercept_credentials}',
    cpReward: 150,
  },
  {
    id: 'proxy-tamper-1',
    title: 'Parameter Tampering',
    description: 'Modify hidden parameters in HTTP requests to manipulate business logic.',
    difficulty: 'intermediate',
    requests: [
      {
        id: 'req-001',
        method: 'GET',
        url: 'http://10.0.0.50/products',
        path: '/products',
        headers: { 'Host': '10.0.0.50', 'Accept': 'text/html' },
        response: { statusCode: 200, statusText: 'OK', headers: { 'Content-Type': 'text/html' }, body: '<div class="product"><h3>Security Camera</h3><span class="price">$299.99</span><form action="/api/order" method="POST"><input type="hidden" name="product_id" value="1"><input type="hidden" name="price" value="29999"><button>Buy Now</button></form></div>' },
        isInteresting: true,
        vulnerability: 'Client-side price parameter can be modified',
      },
      {
        id: 'req-002',
        method: 'POST',
        url: 'http://10.0.0.50/api/order',
        path: '/api/order',
        headers: { 'Host': '10.0.0.50', 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': 'session=abc123' },
        body: 'product_id=1&price=29999',
        response: { statusCode: 200, statusText: 'OK', headers: { 'Content-Type': 'application/json' }, body: '{"success":true,"order":{"id":1001,"total":299.99,"status":"confirmed"}}' },
        isInteresting: false,
      },
      {
        id: 'req-003',
        method: 'POST',
        url: 'http://10.0.0.50/api/order',
        path: '/api/order',
        headers: { 'Host': '10.0.0.50', 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': 'session=abc123' },
        body: 'product_id=1&price=0',
        response: { statusCode: 200, statusText: 'OK', headers: { 'Content-Type': 'application/json' }, body: '{"success":true,"order":{"id":1002,"total":0.00,"status":"confirmed"}}' },
        isInteresting: true,
        vulnerability: 'Price tampering - price=0 accepted',
      },
      {
        id: 'req-004',
        method: 'GET',
        url: 'http://10.0.0.50/api/user/1',
        path: '/api/user/1',
        headers: { 'Host': '10.0.0.50', 'Authorization': 'Bearer token123' },
        response: { statusCode: 200, statusText: 'OK', headers: { 'Content-Type': 'application/json' }, body: '{"id":1,"username":"admin","role":"admin","balance":50000}' },
        isInteresting: false,
      },
      {
        id: 'req-005',
        method: 'GET',
        url: 'http://10.0.0.50/api/user/2',
        path: '/api/user/2',
        headers: { 'Host': '10.0.0.50', 'Authorization': 'Bearer token123' },
        response: { statusCode: 200, statusText: 'OK', headers: { 'Content-Type': 'application/json' }, body: '{"id":2,"username":"customer","role":"user","balance":1500}' },
        isInteresting: true,
        vulnerability: 'IDOR - can access other users by changing ID',
      },
      {
        id: 'req-006',
        method: 'POST',
        url: 'http://10.0.0.50/api/transfer',
        path: '/api/transfer',
        headers: { 'Host': '10.0.0.50', 'Content-Type': 'application/json', 'Cookie': 'session=abc123' },
        body: '{"from":"1","to":"2","amount":100}',
        response: { statusCode: 200, statusText: 'OK', headers: { 'Content-Type': 'application/json' }, body: '{"success":true,"message":"Transfer complete"}' },
        isInteresting: false,
      },
      {
        id: 'req-007',
        method: 'POST',
        url: 'http://10.0.0.50/api/transfer',
        path: '/api/transfer',
        headers: { 'Host': '10.0.0.50', 'Content-Type': 'application/json', 'Cookie': 'session=abc123' },
        body: '{"from":"1","to":"2","amount":100,"admin_override":true}',
        response: { statusCode: 200, statusText: 'OK', headers: { 'Content-Type': 'application/json' }, body: '{"success":true,"message":"Admin override transfer complete","new_balance":49900}' },
        isInteresting: true,
        vulnerability: 'Hidden admin_override parameter accepted',
      },
      {
        id: 'req-008',
        method: 'GET',
        url: 'http://10.0.0.50/dashboard',
        path: '/dashboard',
        headers: { 'Host': '10.0.0.50', 'Cookie': 'session=abc123' },
        response: { statusCode: 200, statusText: 'OK', headers: { 'Content-Type': 'text/html' }, body: '<h1>Dashboard</h1><p>Welcome, admin</p>' },
        isInteresting: false,
      },
    ],
    tasks: [
      { description: 'Find the hidden price parameter that can be tampered with', hint: 'Look at the hidden form fields in the product page', flag: 'FLAG{proxy_price_tampered}' },
      { description: 'Find the hidden admin parameter in the transfer request', hint: 'Compare the two transfer requests', flag: 'FLAG{proxy_admin_override_found}' },
      { description: 'Identify the IDOR vulnerability', hint: 'Check the user API endpoints with different IDs', flag: 'FLAG{proxy_idor_user_access}' },
    ],
    flag: 'FLAG{proxy_tamper_complete}',
    cpReward: 300,
  },
  {
    id: 'proxy-session-1',
    title: 'Session Hijacking',
    description: 'Analyze session tokens and identify session hijacking vectors.',
    difficulty: 'advanced',
    requests: [
      {
        id: 'req-001',
        method: 'POST',
        url: 'https://10.0.0.50/api/login',
        path: '/api/login',
        headers: { 'Host': '10.0.0.50', 'Content-Type': 'application/json' },
        body: '{"username":"user1","password":"pass123"}',
        response: {
          statusCode: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': 'session=eyJ1c2VyIjoidXNlciJ9; Path=/; HttpOnly',
            'X-Session-Token': 'eyJ1c2VyIjoidXNlciJ9',
          },
          body: '{"success":true,"token":"eyJ1c2VyIjoidXNlciJ9"}',
        },
        isInteresting: true,
        vulnerability: 'Session token in both Cookie and response body',
      },
      {
        id: 'req-002',
        method: 'GET',
        url: 'https://10.0.0.50/api/profile',
        path: '/api/profile',
        headers: {
          'Host': '10.0.0.50',
          'Cookie': 'session=eyJ1c2VyIjoidXNlciJ9',
          'Authorization': 'Bearer eyJ1c2VyIjoidXNlciJ9',
        },
        response: { statusCode: 200, statusText: 'OK', headers: { 'Content-Type': 'application/json' }, body: '{"id":1,"username":"user1","email":"user1@novacorp.io","balance":5000}' },
        isInteresting: false,
      },
      {
        id: 'req-003',
        method: 'GET',
        url: 'https://10.0.0.50/api/profile',
        path: '/api/profile',
        headers: {
          'Host': '10.0.0.50',
          'Cookie': 'session=eyJ1c2VyIjoiYWRtaW4ifQ',
          'Authorization': 'Bearer eyJ1c2VyIjoiYWRtaW4ifQ',
        },
        response: { statusCode: 200, statusText: 'OK', headers: { 'Content-Type': 'application/json' }, body: '{"id":1,"username":"admin","email":"admin@novacorp.io","role":"administrator","balance":999999}' },
        isInteresting: true,
        vulnerability: 'JWT token manipulation - changed user to admin',
      },
      {
        id: 'req-004',
        method: 'GET',
        url: 'https://10.0.0.50/csrf-test.html',
        path: '/csrf-test.html',
        headers: { 'Host': '10.0.0.50' },
        response: {
          statusCode: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'text/html' },
          body: '<html><body><h1>Click here for prize</h1><form action="https://10.0.0.50/api/transfer" method="POST"><input type="hidden" name="to" value="attacker"><input type="hidden" name="amount" value="5000"><input type="submit" value="Claim Prize"></form></body></html>',
        },
        isInteresting: true,
        vulnerability: 'CSRF attack vector - no anti-CSRF token',
      },
      {
        id: 'req-005',
        method: 'POST',
        url: 'https://10.0.0.50/api/transfer',
        path: '/api/transfer',
        headers: { 'Host': '10.0.0.50', 'Content-Type': 'application/json', 'Cookie': 'session=eyJ1c2VyIjoidXNlciJ9' },
        body: '{"to":"attacker","amount":5000}',
        response: { statusCode: 403, statusText: 'Forbidden', headers: { 'Content-Type': 'application/json' }, body: '{"error":"Insufficient balance"}' },
        isInteresting: false,
      },
    ],
    tasks: [
      { description: 'Decode the JWT token and understand its structure', hint: 'Base64 decode the payload section', flag: 'FLAG{proxy_jwt_decoded}' },
      { description: 'Identify the session hijacking vector', hint: 'Look at where the session token appears', flag: 'FLAG{proxy_session_hijack_vector}' },
      { description: 'Find the CSRF vulnerability', hint: 'Check the HTML page with a hidden form', flag: 'FLAG{proxy_csrf_found}' },
    ],
    flag: 'FLAG{proxy_session_hijacked}',
    cpReward: 400,
  },
];
