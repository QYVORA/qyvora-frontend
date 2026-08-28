import type { QuizQuestion } from './types';

export interface SqlTable {
  name: string;
  columns: string[];
  rows: Record<string, string>[];
}

export interface SqlInjectionStep {
  command: string;
  output: string;
  explanation: string;
  quiz?: QuizQuestion[];
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
        quiz: [
          {
            id: 'sqli-union-step1-q1',
            question: 'Why establish a baseline request before attempting injection?',
            options: [
              'To warm up the server cache',
              'To learn the normal response so injected failures can be distinguished from legitimate ones',
              'To authenticate with the database',
              'To disable WAF protections',
            ],
            correctIndex: 1,
            explanation: 'The baseline shows the standard "Invalid credentials" response, giving a reference to tell failed injections apart from real login failures.',
          },
          {
            id: 'sqli-union-step1-q2',
            question: 'What does a normal failed-login response provide?',
            options: [
              'The exact SQL query written by the developer',
              'A reference so we can tell an injection that worked from a legitimate auth failure',
              'The database password in plaintext',
              'A list of all table names',
            ],
            correctIndex: 1,
            explanation: 'Knowing the normal failure format lets an attacker recognize when injection succeeds versus when a login genuinely fails.',
          },
        ],
      },
      {
        command: "curl -X POST http://10.0.0.50/login -d \"username=admin' OR '1'='1&password=anything\"",
        output: `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"success":true,"message":"Login successful","user":{"id":1,"role":"administrator"}}`,
        explanation: "This is the breakthrough. The single quote closes the original query's string literal, and OR '1'='1' appends a condition that's always true, so the WHERE clause matches every row instead of just the admin. The application logs us in as the first user in the table, which happens to be the administrator. This confirms the input is being concatenated directly into SQL without sanitization, and the error response we saw earlier was actually a SQL error being caught by the application. We now have proof of concept for SQL injection and can escalate to full data extraction.",
        quiz: [
          {
            id: 'sqli-union-step2-q1',
            question: 'How does the payload username=admin\' OR \'1\'=\'1 bypass authentication?',
            options: [
              'It encrypts the password so the hash always matches',
              'The quote closes the string and OR \'1\'=\'1 adds an always-true condition, matching every row',
              'It disables the login endpoint',
              'It rolls back the database transaction',
            ],
            correctIndex: 1,
            explanation: 'Closing the string literal and appending an always-true OR makes the WHERE clause match every row, logging in as the first user.',
          },
          {
            id: 'sqli-union-step2-q2',
            question: 'What does a successful login OR \'1\'=\'1 confirm?',
            options: [
              'That the database is fully patched',
              'That input is concatenated directly into SQL without sanitization',
              'That the password is encrypted with bcrypt',
              'That the server uses a WAF',
            ],
            correctIndex: 1,
            explanation: 'When the injected condition changes query behavior, it proves the input reaches SQL unsanitized — the proof of concept for injection.',
          },
        ],
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/login' --data='username=admin&password=test' --batch --dbs",
        output: `[*] starting @ ...\n[INFO] testing connection to the target URL\n[INFO] testing 'AND boolean-based blind'\n[INFO] the back-end DBMS is MySQL\n[INFO] fetching database names\navailable databases [3]:\n[*] information_schema\n[*] mysql\n[*] novacorp`,
        explanation: "Now we automate the exploitation. sqlmap confirms the backend is MySQL 8.0.35 and enumerates the available databases. We see 'novacorp', that's the application database we want. The 'information_schema' and 'mysql' databases are internal MySQL metadata, 'information_schema' contains all table/column names across every database, and 'mysql' stores user accounts. Knowing the DBMS type is critical because it determines which injection payloads and extraction techniques will work.",
        quiz: [
          {
            id: 'sqli-union-step3-q1',
            question: 'What does the "--dbs" flag in sqlmap do?',
            options: [
              'It drops the target database',
              'It enumerates the available databases on the backend server',
              'It enables verbose error logging',
              'It disables the WAF',
            ],
            correctIndex: 1,
            explanation: 'The --dbs option lists all databases so the attacker can select the application\'s database to dig into.',
          },
          {
            id: 'sqli-union-step3-q2',
            question: 'Why does knowing the DBMS type (e.g. MySQL) matter?',
            options: [
              'It determines which injection payloads and extraction techniques will work',
              'It reveals the network administrator password',
              'It automatically patches the vulnerability',
              'It disables the database compilers',
            ],
            correctIndex: 0,
            explanation: 'Different database engines support different syntax and functions, so payloads must be tailored to the backend DBMS.',
          },
        ],
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/login' --data='username=admin&password=test' -D novacorp --tables",
        output: `[INFO] fetching tables for database 'novacorp'\nDatabase: novacorp\n[3 tables]\n+----------+\n| users    |\n| products |\n| orders   |\n+----------+`,
        explanation: "We drill into the novacorp database and find three tables. The 'users' table is our primary target, it likely contains credentials. 'products' and 'orders' could contain business-sensitive data like pricing and purchase history. At this stage we're mapping the database structure, just like a real attacker would. We're thinking about which table has the highest value for our objectives. The answer is obvious: users contains the passwords and emails that could be used for lateral movement.",
        quiz: [
          {
            id: 'sqli-union-step4-q1',
            question: 'Within a database, which table is typically the highest-value target?',
            options: [
              'The one with the most rows',
              'The users/accounts table holding credentials and emails',
              'The first table alphabetically',
              'The one containing only metadata',
            ],
            correctIndex: 1,
            explanation: 'Credential-holding tables enable lateral movement, phishing, and privilege escalation, making them the primary prize.',
          },
          {
            id: 'sqli-union-step4-q2',
            question: 'What does enumerating table names achieve during an attack?',
            options: [
              'It maps the database structure to prioritize which tables to extract',
              'It patches all the injection flaws',
              'It resets the database passwords',
              'It disables foreign keys',
            ],
            correctIndex: 0,
            explanation: 'Mapping tables reveals the schema so the attacker can decide which data yields the most value.',
          },
        ],
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/login' --data='username=admin&password=test' -D novacorp -T users --dump",
        output: `[INFO] fetching entries for 'users'\nTable: users (3 entries)\n+----+--------------+--------------------------+---------------------+---------------+\n| id | username     | password                 | email               | role          |\n+----+--------------+--------------------------+---------------------+---------------+\n| 1  | admin        | $2y$10$xVqYLkR5pN3mXz8Q  | admin@novacorp.io   | administrator |\n| 2  | jdoe         | $2y$10$aB3dEfGhIjKlMnOp  | jdoe@novacorp.io    | user          |\n| 3  | backup_admin | $2y$10$pQ9rS8tUvWxYzA1b  | backup@novacorp.io  | admin         |\n+----+--------------+--------------------------+---------------------+---------------+`,
        explanation: "Full extraction. We now have every row from the users table, usernames, bcrypt password hashes, email addresses, and role assignments. Notice there are two admin accounts: 'admin' and 'backup_admin'. The backup_admin is especially interesting because organizations often have weaker security on backup accounts. The bcrypt hashes ($2y$10$) are strong against offline cracking, but we now have emails for phishing, usernames for brute-force attacks, and role info for privilege escalation. This single injection gave us everything we need to compromise the entire system.",
        quiz: [
          {
            id: 'sqli-union-step5-q1',
            question: 'Even though bcrypt hashes resist offline cracking, why is the dump still dangerous?',
            options: [
              'The emails feed phishing, usernames feed brute-force, and roles reveal privilege-escalation paths',
              'bcrypt hashes decrypt instantly',
              'The dump disables two-factor authentication',
              'It exposes TLS private keys',
            ],
            correctIndex: 0,
            explanation: 'Exfiltrated emails, usernames, and role data enable phishing, credential attacks, and privilege escalation even when hashes stay secure.',
          },
          {
            id: 'sqli-union-step5-q2',
            question: 'Why are extra admin/backup accounts like backup_admin worth attention?',
            options: [
              'Organizations often secure backup accounts more weakly than primary ones',
              'They are encrypted with weaker algorithms',
              'They bypass the password check entirely',
              'They always share the web-server credentials',
            ],
            correctIndex: 0,
            explanation: 'Secondary/backup admin accounts frequently receive less hardening, offering a softer privilege-escalation target.',
          },
        ],
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
        quiz: [
          {
            id: 'sqli-blind-step1-q1',
            question: 'In blind injection, what serves as the "oracle"?',
            options: [
              'Any observable difference between a true and a false condition in the response',
              'The database\'s error log',
              'The TLS certificate',
              'The server version banner',
            ],
            correctIndex: 0,
            explanation: 'An oracle is any response difference the attacker can observe to distinguish true from false conditions.',
          },
          {
            id: 'sqli-blind-step1-q2',
            question: 'What response does this search API give for a valid product ID?',
            options: [
              'A stack trace with table names',
              'A boolean indicator like found: true plus the product',
              'The full SQL query',
              'The database password',
            ],
            correctIndex: 1,
            explanation: 'The endpoint returns only found/not-found style output — exactly the minimal binary signal blind injection relies on.',
          },
        ],
      },
      {
        command: "curl 'http://10.0.0.50/api/search?id=1 AND 1=1'",
        output: `{"found":true,"product":"Security Camera"}`,
        explanation: "We inject a condition that's always true: 1=1. The response is identical to the baseline, same product, same 'found: true'. This is expected, and it tells us two things: the injected SQL is being executed (not treated as a literal string), and the true condition produces the same output as a normal query. We now have our 'true' baseline for comparison.",
        quiz: [
          {
            id: 'sqli-blind-step2-q1',
            question: 'What does injecting "AND 1=1" and getting a normal response confirm?',
            options: [
              'That the input is treated as a literal string',
              'That the injected SQL is being executed and true matches the normal output',
              'That the database is down',
              'That the WAF blocked the request',
            ],
            correctIndex: 1,
            explanation: 'A true condition reproducing the baseline response proves the injected SQL runs and defines the "true" output.',
          },
          {
            id: 'sqli-blind-step2-q2',
            question: 'Why establish an "always true" baseline in blind injection?',
            options: [
              'To have a reference for what a true condition should look like',
              'To brute-force the admin password',
              'To disable query caching',
              'To identify the database version',
            ],
            correctIndex: 0,
            explanation: 'The true baseline lets the attacker compare later guesses: matching "true" output means the injected guess is correct.',
          },
        ],
      },
      {
        command: "curl 'http://10.0.0.50/api/search?id=1 AND 1=2'",
        output: `{"found":false}`,
        explanation: "Now we inject a condition that's always false: 1=2. The response changes to 'found: false', no product returned. This is the critical proof. The only difference between this request and the last was the injected condition, and the response changed accordingly. We've confirmed boolean-based blind SQL injection. Any condition we inject can be tested: if the product appears, the condition is true; if not, it's false. This is our oracle for extracting data one bit at a time.",
        quiz: [
          {
            id: 'sqli-blind-step3-q1',
            question: 'Why does "AND 1=2" returning found: false confirm the injection?',
            options: [
              'Because the false condition produces a different response than the true baseline, proving SQL execution',
              'Because it reveals the table schema in the output',
              'Because it triggers a server crash',
              'Because it signs the session cookie',
            ],
            correctIndex: 0,
            explanation: 'The response changed solely due to the injected condition — a functioning boolean oracle proving injection.',
          },
          {
            id: 'sqli-blind-step3-q2',
            question: 'How does an attacker use a boolean oracle to extract data?',
            options: [
              'By testing conditions one at a time to reconstruct data character by character',
              'By dumping the whole table in a single request',
              'By reading the server-side error logs',
              'By disabling the database foreign keys',
            ],
            correctIndex: 0,
            explanation: 'Each true/false guess yields one bit, so data is rebuilt across many requests.',
          },
        ],
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/api/search?id=1' --batch --technique=B --dbs",
        output: `[INFO] testing 'AND boolean-based blind'\n[INFO] the back-end DBMS is MySQL\navailable databases [2]:\n[*] information_schema\n[*] novacorp`,
        explanation: "sqlmap automates the tedious process of asking yes/no questions. Using the boolean-based technique, it systematically extracts database names by testing character values one at a time. We see two databases: 'information_schema' (MySQL's internal metadata) and 'novacorp' (the application database). The accounts table inside novacorp contains user balances, an attacker could use this to identify high-value targets for financial fraud or privilege escalation.",
        quiz: [
          {
            id: 'sqli-blind-step4-q1',
            question: 'What does SQLmap\'s --technique=B automate?',
            options: [
              'Error-based extraction through MySQL warnings',
              'Boolean-based blind extraction by asking true/false questions character by character',
              'Stacked INSERT statements',
              'Timing attacks using SLEEP()',
            ],
            correctIndex: 1,
            explanation: 'Technique B automates boolean blind injection, reconstructing data from yes/no responses.',
          },
          {
            id: 'sqli-blind-step4-q2',
            question: 'Why would an attacker target the accounts table for financial fraud?',
            options: [
              'It contains user balances used to identify high-value targets',
              'It stores the primary TLS keys',
              'It lists the web-server software',
              'It holds the domain registrar data',
            ],
            correctIndex: 0,
            explanation: 'Financial data (balances, account types) reveals high-value accounts and enables fraud and privilege escalation.',
          },
        ],
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
        quiz: [
          {
            id: 'sqli-time-step1-q1',
            question: 'Why measure a baseline response time before time-based injection?',
            options: [
              'To have a reference so injected delays are distinguishable from normal traffic',
              'To fill the API rate limit',
              'To identify the database brand',
              'To flush the connection pool',
            ],
            correctIndex: 0,
            explanation: 'The baseline establishes normal latency so any injected delay clearly indicates our SQL is executing.',
          },
          {
            id: 'sqli-time-step1-q2',
            question: 'What makes time-based blind injection so stealthy?',
            options: [
              'It causes visible errors and log entries',
              'It returns no error and no data change, only a subtle response delay',
              'It triggers the IDS immediately',
              'It reveals table names in the body',
            ],
            correctIndex: 1,
            explanation: 'No errors and no output changes occur — only timing, which automated scanners often overlook.',
          },
        ],
      },
      {
        command: "time curl 'http://10.0.0.50/api/user?user=admin' AND SLEEP(5)--'",
        output: `real\t0m5.041s\nuser\t0m0.012s\nsys\t0m0.008s`,
        explanation: "We inject AND SLEEP(5)-- which tells MySQL to pause for 5 seconds before continuing. The response now takes 5 seconds, a clear, measurable delay that proves the SLEEP function was executed. The trailing '--' comments out the rest of the original query to prevent syntax errors. We've confirmed time-based blind injection. Now we can use conditional logic: 'IF(condition, SLEEP(5), 0)' to make the database delay only when our condition is true. By measuring whether the response is slow or fast, we extract one bit of information per request.",
        quiz: [
          {
            id: 'sqli-time-step2-q1',
            question: 'What does a 5-second delay from "AND SLEEP(5)" prove?',
            options: [
              'That the SLEEP function executed, confirming time-based blind injection',
              'That the server is overloaded with traffic',
              'That the WAF blocked the query',
              'That the connection timed out',
            ],
            correctIndex: 0,
            explanation: 'The measurable delay proves our SQL ran, since SLEEP() pauses execution for the specified time.',
          },
          {
            id: 'sqli-time-step2-q2',
            question: 'How does "IF(condition, SLEEP(5), 0)" let an attacker extract data?',
            options: [
              'A slow response means the condition is true, a fast response means false — one bit per request',
              'It instantly dumps the whole table',
              'It rounds response times to the nearest second',
              'It disables the condition checks',
            ],
            correctIndex: 0,
            explanation: 'Conditional delays turn timing into a boolean oracle: slow=true, fast=false, reconstructing data bit by bit.',
          },
        ],
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/api/user?user=admin' --batch --technique=T --dbs",
        output: `[INFO] testing 'time-based blind'\n[INFO] the back-end DBMS is MySQL\n[INFO] retrieved database names\navailable databases [2]:\n[*] information_schema\n[*] novacorp`,
        explanation: "sqlmap automates the time-based extraction by sending thousands of requests, each measuring whether the response was delayed. It extracts the database name character by character: 'Is the first letter n? Yes. Is the second letter o? Yes. Is the third letter v? Yes...', until it reconstructs 'novacorp'. The credentials table inside contains an API key (sk-nova-xxxxxxxxxxxx) and a service account password hash. In a real attack, this API key could grant access to NovaCorp's internal APIs, bypassing authentication entirely. Time-based injection is slow but silent, the perfect exfiltration method.",
        quiz: [
          {
            id: 'sqli-time-step3-q1',
            question: 'Which sqlmap technique flag automates time-based extraction?',
            options: [
              '--technique=B for boolean-based',
              '--technique=T for time-based',
              '--technique=E for error-based',
              '--technique=U for UNION-based',
            ],
            correctIndex: 1,
            explanation: 'T selects the time-based blind technique, automating the slow character-by-character extraction.',
          },
          {
            id: 'sqli-time-step3-q2',
            question: 'Why is an exfiltrated API key so dangerous?',
            options: [
              'It can grant access to internal APIs, bypassing authentication entirely',
              'It only affects the marketing site',
              'It resets after 24 hours',
              'It is encrypted with the session key',
            ],
            correctIndex: 0,
            explanation: 'A leaked API key authenticates directly to internal services, skipping login and other controls.',
          },
        ],
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
        quiz: [
          {
            id: 'sqli-error-step1-q1',
            question: 'Why capture the normal response before injecting a quote?',
            options: [
              'To detect abnormal output when the injection breaks the query',
              'To warm the query cache',
              'To authenticate database users',
              'To disable error reporting',
            ],
            correctIndex: 0,
            explanation: 'Knowing the normal format lets us recognize when injected input alters the query or surfaces errors.',
          },
          {
            id: 'sqli-error-step1-q2',
            question: 'What is the baseline response format for this catalog endpoint?',
            options: [
              'A JSON array of product objects',
              'A single error stack trace',
              'An XML document',
              'An HTML login form',
            ],
            correctIndex: 0,
            explanation: 'Normal requests return JSON product arrays, the reference against which anomalies are judged.',
          },
        ],
      },
      {
        command: "curl 'http://10.0.0.50/products?category=camera%27'",
        output: `{"error":"You have an error in your SQL syntax near ''cameras'' at line 1"}`,
        explanation: "The single quote breaks the SQL query and the application returns the full MySQL error. This is a critical finding: the error message reveals the exact query structure, showing us how the category parameter is being concatenated into the query. An attacker now knows the table has a 'category' column and can craft precise injection payloads. In production, error messages should be logged server-side and never shown to users, this misconfiguration is a direct vulnerability.",
        quiz: [
          {
            id: 'sqli-error-step2-q1',
            question: 'Why is a verbose SQL error message a serious misconfiguration?',
            options: [
              'It reveals query structure, table names, and columns, eliminating guesswork for the attacker',
              'It slows down the database server',
              'It encrypts all the data',
              'It disables the injection flaw automatically',
            ],
            correctIndex: 0,
            explanation: 'Verbose errors leak the exact SQL, letting attackers craft precise payloads without guessing.',
          },
          {
            id: 'sqli-error-step2-q2',
            question: 'What does the returned error reveal about the query?',
            options: [
              'How the category parameter is concatenated into the SQL and the column names used',
              'The database administrator\'s password',
              'The TLS private key',
              'The server\'s physical location',
            ],
            correctIndex: 0,
            explanation: 'The syntax error text shows exactly where and how the parameter is embedded and names the columns being compared.',
          },
        ],
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/products?category=cameras' --batch --technique=E -D novacorp -T secrets --dump",
        output: `[INFO] testing error-based\n[INFO] the back-end DBMS is MySQL\nTable: secrets (2 entries)\n+----+------------+----------------+\n| id | key_name   | key_value      |\n+----+------------+----------------+\n| 1  | db_password| Sup3rS3cret!   |\n| 2  | api_token  | tok_nv_xxxx    |\n+----+------------+----------------+`,
        explanation: "sqlmap uses error-based extraction to pull the entire secrets table through the error response. We now have two critical pieces of information: a database password ('Sup3rS3cret!') and an API token ('tok_nv_xxxxxxxxxxxx'). The database password could be used to connect directly to the database from anywhere on the network, bypassing the application entirely. The API token could grant access to internal services. This is why error-based injection is so dangerous, it's fast, reliable, and leaves clear evidence of data exfiltration in the error logs.",
        quiz: [
          {
            id: 'sqli-error-step3-q1',
            question: 'How does error-based extraction return data to the attacker?',
            options: [
              'By forcing MySQL to embed extracted data directly into the error message',
              'By sending the data over a separate channel',
              'By writing data to the web server log only',
              'By returning it in the HTTP response headers',
            ],
            correctIndex: 0,
            explanation: 'Functions like UPDATEXML()/EXTRACTVALUE() force MySQL to include the requested data in the error text returned to the client.',
          },
          {
            id: 'sqli-error-step3-q2',
            question: 'Which sqlmap technique extracts data through errors?',
            options: [
              '--technique=E for error-based',
              '--technique=T for time-based',
              '--technique=B for boolean-based',
              '--technique=U for UNION-based',
            ],
            correctIndex: 0,
            explanation: 'Technique E drives MySQL into erroring with the requested data embedded in each message.',
          },
        ],
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
        quiz: [
          {
            id: 'sqli-second-step1-q1',
            question: 'Why register a normal account before the malicious one?',
            options: [
              'To confirm usernames are stored in the database, setting up the later re-use of an injected payload',
              'To earn bonus loyalty points',
              'To disable input validation',
              'To seed the query cache',
            ],
            correctIndex: 0,
            explanation: 'Confirming storage behavior assures the attacker the injected payload will persist and run on a later query.',
          },
          {
            id: 'sqli-second-step1-q2',
            question: 'What is the defining property of a second-order injection?',
            options: [
              'The payload executes immediately in the same query',
              'The payload is stored and executed later in a different query',
              'It only works on NoSQL databases',
              'It requires physical access',
            ],
            correctIndex: 1,
            explanation: 'Second-order injection plants a stored payload that executes when it is later used in a separate query.',
          },
        ],
      },
      {
        command: "curl -X POST http://10.0.0.50/register -d \"username=admin'-- &password=pass123&email=evil@evil.com\"",
        output: `{"success":true,"message":"Registration successful"}`,
        explanation: "The registration succeeds, but the payload is now stored in the database. The username admin'-- contains a SQL injection: the single quote closes the login query's string, and -- comments out the password check. The application doesn't validate or sanitize this input, so it's stored exactly as provided. At this point, nothing seems wrong. The vulnerability is dormant. The real exploitation happens when someone, including the application itself, tries to use this stored username in a login query.",
        quiz: [
          {
            id: 'sqli-second-step2-q1',
            question: 'Why does the malicious registration appear harmless at first?',
            options: [
              'The payload is only stored and does not execute during the registration query',
              'It immediately escalates privileges',
              'It triggers the IDS',
              'It encrypts the stored data',
            ],
            correctIndex: 0,
            explanation: 'Because the payload is only persisted, not evaluated, the registration returns success and looks normal.',
          },
          {
            id: 'sqli-second-step2-q2',
            question: 'Why do automated scanners often miss second-order injection?',
            options: [
              'Because they test each endpoint in isolation and miss the stored payload\'s later use',
              'Because they only check GET requests',
              'Because it cannot be automated at all',
              'Because the payload self-destructs on storage',
            ],
            correctIndex: 0,
            explanation: 'The flaw spans two endpoints — injection at one, execution at another — so isolated endpoint tests miss it.',
          },
        ],
      },
      {
        command: "curl -X POST http://10.0.0.50/login -d \"username=admin'-- &password=anything\"",
        output: `{"success":true,"message":"Login successful","user":{"id":1,"role":"administrator"}}`,
        explanation: "The stored payload executes during login. When the application reads our malicious username from the database and inserts it into the login query, the SQL becomes: WHERE username = 'admin'--' AND password = 'anything'. The '--' comments out everything after it, including the password check. We're now logged in as the administrator with any password. This is second-order injection in action, the vulnerability was stored during registration and triggered during login. The attacker never needs to be online for both steps; the trap is already set.",
        quiz: [
          {
            id: 'sqli-second-step3-q1',
            question: 'How does the stored username admin\'-- bypass the login password check?',
            options: [
              'The -- comments out the rest of the login query, including the password comparison',
              'It encrypts the password to match the hash',
              'It disables the users table',
              'It resets the administrator\'s credentials',
            ],
            correctIndex: 0,
            explanation: 'When interpolated into the login query, the -- comment swallows the password condition, logging in as admin.',
          },
          {
            id: 'sqli-second-step3-q2',
            question: 'Where does the second-order payload actually execute?',
            options: [
              'During the later login query, not the registration query that stored it',
              'Immediately during registration',
              'On the web server at boot',
              'In the TLS handshake',
            ],
            correctIndex: 0,
            explanation: 'The dormant payload detonates when the stored username is reused in the login query.',
          },
        ],
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
        quiz: [
          {
            id: 'sqli-stacked-step1-q1',
            question: 'How do stacked queries differ from UNION-based injection?',
            options: [
              'They execute entirely independent statements (INSERT/UPDATE/DELETE) instead of combining results',
              'They only read a single column',
              'They are limited to HTTP headers',
              'They cannot modify data',
            ],
            correctIndex: 0,
            explanation: 'Stacked queries use a semicolon to run independent statements, enabling writes, not just reads.',
          },
          {
            id: 'sqli-stacked-step1-q2',
            question: 'What can a stacked-query attacker do that a UNION attacker cannot?',
            options: [
              'Modify data via INSERT/UPDATE/DELETE and even DROP TABLE',
              'Only append to SELECT results',
              'Only read the first row',
              'Only enumerate table names',
            ],
            correctIndex: 0,
            explanation: 'Stacked queries grant full write/administrative control over the database, unlike read-only UNION injection.',
          },
        ],
      },
      {
        command: "curl 'http://10.0.0.50/api/order?id=1;INSERT INTO orders(user_id,product,amount,status) VALUES(99,'hacked',0.01,'injected')--'",
        output: `{"success":true}`,
        explanation: "We inject a semicolon to terminate the original query, then append a complete INSERT statement. The semicolon tells MySQL to execute two separate queries: first the original order lookup, then our malicious INSERT. The '--' comments out any trailing syntax from the original query. The INSERT creates a new order record with a user_id of 99 (nonexistent), a product called 'hacked', an amount of $0.01, and status 'injected'. This demonstrates how an attacker could create fraudulent orders, modify pricing, or insert backdoor records, all without triggering errors.",
        quiz: [
          {
            id: 'sqli-stacked-step2-q1',
            question: 'What role does the semicolon play in a stacked-query attack?',
            options: [
              'It terminates the first query so a second, independent statement can run',
              'It cancels the injected statement',
              'It comments out the payload',
              'It concatenates two string literals',
            ],
            correctIndex: 0,
            explanation: 'A semicolon separates the original query from the attacker\'s appended statement, letting both execute.',
          },
          {
            id: 'sqli-stacked-step2-q2',
            question: 'Why does the app appear to work normally while stacked queries run?',
            options: [
              'The app returns only the first query\'s result while the malicious ones run silently',
              'The query triggers a visible error',
              'The app logs the injection to a public page',
              'The injected statement blocks the connection',
            ],
            correctIndex: 0,
            explanation: 'Only the first statement\'s output is returned; the injected operations execute without visible feedback.',
          },
        ],
      },
      {
        command: "curl 'http://10.0.0.50/api/order?id=2'",
        output: `{"id":2,"product":"hacked","amount":0.01,"status":"injected"}`,
        explanation: "We verify the injected record exists by querying for it. The new order is there, our INSERT statement executed successfully. This confirms the application is vulnerable to stacked queries injection. In a real attack scenario, this could be used for: financial fraud (modifying order amounts), data manipulation (changing user roles or balances), privilege escalation (inserting admin accounts), or even data destruction (DROP TABLE). The fact that the application returns success without any errors shows that stacked queries are fully supported by the database driver.",
        quiz: [
          {
            id: 'sqli-stacked-step3-q1',
            question: 'Why is verifying the injected record important?',
            options: [
              'It confirms the appended statement actually executed',
              'It patches the vulnerability',
              'It clears the database audit log',
              'It rotates the database password',
            ],
            correctIndex: 0,
            explanation: 'Reading back the injected row proves the stacked statement ran and the technique is viable.',
          },
          {
            id: 'sqli-stacked-step3-q2',
            question: 'Which of the following is a real-world stacked-query abuse?',
            options: [
              'Privilege escalation by inserting admin accounts',
              'Resetting the TLS certificate',
              'Disabling the IDS alerts',
              'Encrypting the web root',
            ],
            correctIndex: 0,
            explanation: 'Stacked queries can insert admin accounts, change balances, and plant persistent backdoor records.',
          },
        ],
      },
    ],
    cpReward: 300,
  },
];
