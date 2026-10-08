# Certificate System

> **Status:** ✅ RENDERER + PUBLIC VERIFICATION IMPLEMENTED · issuance/gallery PLANNED  
> **Last Updated:** 2026-10-08  
> **Renderer:** `src/shared/components/certificates/CertificateRenderer.tsx`  
> **Admin preview:** `src/features/admin/pages/certificates/TemplatesPage.tsx`  
> **Verification:** `/verify` + `/verify/:credentialId` (`src/features/marketing/pages/public/VerifyPage.tsx`)

## Overview

The QYVORA certificate system provides a template-based certificate generation and management system for recognizing student achievements. Certificates can be issued for bootcamp completion, course completion, lab mastery, and other learning milestones.

Two certificate templates ship with the platform — one for each bootcamp:

| Template | Programme | Default program name | Sample credential ID |
|----------|-----------|----------------------|----------------------|
| QOSE Certificate | `QOSE` | QYVORA Offensive Security Engineer Bootcamp | `550e8400-e29b-41d4-a716-446655440000` |
| HPB Certificate | `HPB` | Hacker Protocol Bootcamp | `b17e50c1-9a3f-4c2e-8d5a-2f4c1a7e9b01` |

The two templates are independent: each keeps its own template name, program name and cohort
settings in the admin preview. Sample IDs come from `DEMO_CREDENTIAL_IDS` in
`src/core/services/credentialVerification.ts` — the same IDs the `/verify` page recognises, so
every previewed certificate is verifiable out of the box.

Spec alignment: the credential model, wording and verification endpoint contract follow
`knowledge/qyvora-docs/09-technical/credential-system/` (see *Related Documentation*).


## Architecture

### Components

**Implemented:**
- `src/shared/components/certificates/CertificateRenderer.tsx` — the certificate itself (data shape + both programme templates). Used by the admin preview and the public `/verify` result.
- `src/features/admin/pages/certificates/TemplatesPage.tsx` — admin dashboard **Certificates** tab (`{ADMIN_PATH}/dashboard?tab=certificates`): template selector (QOSE / HPB), per-template settings, size (orientation) selector, name-length stress test, and live preview (single or both certificates).
- `src/features/marketing/pages/public/VerifyPage.tsx` — public verification page at `/verify` and `/verify/:credentialId`.
- `src/core/services/credentialVerification.ts` — verification logic (normalisation, API call, local fallback registry).

**Planned (documented, not yet built):**
- `CertificatesTab`, `CertificateTemplateEditor`, `CertificatePreview`, `IssueCertificateModal`, `BulkIssueCertificateModal`
- `src/shared/components/certificates/CertificateCard`, `CertificateDownload`, `CertificateDetailModal`

### Data Model

```typescript
interface Certificate {
  id: string;
  userId: string;
  templateId: string;
  issuedDate: Date;
  certificateType: 'bootcamp' | 'course' | 'lab' | 'custom';
  title: string;
  description: string;
  metadata: {
    achievementName: string;
    completionDate: Date;
    issuerName: string;
    credentialId: string;
  };
  verified: boolean;
}

interface CertificateTemplate {
  id: string;
  name: string;
  type: 'bootcamp' | 'course' | 'lab' | 'custom';
  layout: 'portrait' | 'landscape';
  brandingStyle: 'minimal' | 'standard' | 'premium';
  content: {
    title: string;
    subtitle?: string;
    bodyText: string;
    signatureFields: SignatureField[];
  };
  design: {
    backgroundColor: string;
    accentColor: string;
    borderStyle: 'none' | 'simple' | 'decorative';
    logoPosition: 'top-left' | 'top-center' | 'top-right';
  };
}
```

## Features

### Certificate Templates

**Template Types:**
- **Bootcamp Certificates** - Issued on phase or full bootcamp completion
- **Course Certificates** - Awarded for course completion with passing grade
- **Lab Certificates** - Recognition for lab scenario mastery
- **Custom Certificates** - Admin-defined for special achievements

**Template Customization:**
- Layout orientation (portrait/landscape)
- Branding styles (minimal, standard, premium)
- Color schemes (background, accent, borders)
- Logo positioning
- Custom text fields
- Signature fields (up to 3 signatures)

### Certificate Issuance

**Automatic Issuance:**
- Bootcamp phase/full completion
- Course completion with >= 80% score
- Lab scenario completion

**Manual Issuance:**
- Admin can issue certificates via CertificatesTab
- Bulk issuance for cohorts
- Backdated certificates for legacy achievements

### Certificate Verification

**Credential ID System:**
- Unique credential ID per certificate (format: `QYVORA-{TYPE}-{HASH}`)
- Public verification endpoint: `/verify/{credentialId}`
- Blockchain recording for tamper-proof verification (future)

**Verification Fields:**
- Recipient name
- Issue date
- Certificate type and title
- Issuing authority
- Credential ID
- QR code with verification link

### Certificate Display

**Student Dashboard:**
- Certificate gallery showing all earned certificates
- Filter by type (bootcamp, course, lab)
- Sort by issue date
- Preview and download options

**Public Profile:**
- Verified certificates displayed on public profile
- Privacy control (student can hide certificates)
- Share certificate link with verification

## Design System

### Visual Identity

**Colors:**
- Primary: `#06B66F` (QYVORA accent green)
- Background: `#000000` (brand black) or `#FFFFFF` (white for print)
- Text: `#EEF0EE` (light) or `#1A1A1A` (dark for light backgrounds)
- Border: `rgba(6,182,111,0.2)` (subtle accent)

**Typography:**
- Headings: JetBrains Mono (brand font)
- Body: JetBrains Mono or system font stack
- Certificate title: 32-48px, bold, uppercase
- Body text: 16-20px, regular

**Layout (implemented):**
- **Size:** industry-standard US Letter trim as a guaranteed **minimum height** — `11 × 8.5 in` landscape (default, `77.27cqw`) or `8.5 × 11 in` portrait (`129.41cqw`). Content holds the exact ratio at every normal size and the surface can only *grow* if a name runs long on a tiny preview — text is never clipped
- **Fluid sizing:** every font size, padding and frame element uses `max(<floor>px, <n>cqw)` — container-query units resolved against the certificate's own width (`container-type: inline-size` on `#certificate-render`). The box and all text scale from the same unit, so the layout keeps identical proportions in the admin preview, on mobile and in print
- **Recipient name:** sized by length (≤14 / ≤26 / ≤40 / 40+ characters step down through four size steps), `break-words` + `hyphens: auto` + `overflow-wrap: anywhere` — names always fit inside the certificate and never clip out of the container
- **Logo:** programme logo (HPB/QOSE) is rendered **bare, directly on the certificate surface — never inside a card, border or tinted panel**
- **Lines:** minimal — four corner brackets only. No horizontal rules, tick marks, dashes or dividers across the certificate body; structure is carried by spacing
- **Premium treatment (QOSE):** QOSE is the paid bootcamp, so its certificate is the premium edition — accent edge (`border-accent/40`), soft tinted-graphite gradient, continuous inner frame (`inset-[2.5%]` accent hairline), a low-opacity programme watermark centred behind the body, stronger corner brackets, and a double-ring **issuer seal** (QYVORA mark + "QOSE") in the footer. HPB remains the clean standard edition (neutral graphite + dotted-map backdrop, no seal)
- **Credential ID:** the full ID is printed in the footer (`break-all`) so it can be copied straight into `/verify`
- **Verification URL:** `/verify/<credentialId>` (rendered by default when `data.verificationUrl` is omitted)

**Print reference layout:** standard margins ~4.5% of certificate width (fluid), signature spacing 40px between signatures (planned), logo max height 120px (fluid-capped).

### Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast text (WCAG AA compliant)
- Print-friendly styles

## API Integration

### Endpoints

**Admin (requires `requireAdmin` middleware):**
- `GET /api/admin/certificates/templates` - List all templates
- `POST /api/admin/certificates/templates` - Create new template
- `PUT /api/admin/certificates/templates/:id` - Update template
- `DELETE /api/admin/certificates/templates/:id` - Delete template
- `POST /api/admin/certificates/issue` - Issue certificate to user
- `POST /api/admin/certificates/bulk-issue` - Bulk issue to multiple users
- `GET /api/admin/certificates` - List all issued certificates
- `DELETE /api/admin/certificates/:id` - Revoke certificate

**Student (requires `requireAuth` middleware):**
- `GET /api/student/certificates` - List user's certificates
- `GET /api/student/certificates/:id` - Get certificate details
- `GET /api/student/certificates/:id/download` - Download PDF

**Public:**
- `GET /api/credentials/verify/:credentialId` - Verify credential authenticity (contract per `CREDENTIAL-DATA-MODEL.md`)

### Certificate Generation

**PDF Generation (Backend):**
- Library: `pdfkit` or `puppeteer`
- Template rendering: HTML/CSS → PDF
- Image embedding: QYVORA logo, signatures
- QR code generation: `qrcode` package

**Download Flow:**
1. Student clicks "Download" on certificate
2. Frontend calls `GET /api/student/certificates/:id/download`
3. Backend generates PDF from template + certificate data
4. PDF streamed as `application/pdf` with `Content-Disposition: attachment`
5. Browser downloads file: `QYVORA-Certificate-{Title}-{Date}.pdf`

## Admin Workflow

### Creating a Template

1. Navigate to Admin Dashboard → Certificates tab
2. Click "Create Template"
3. Choose template type (bootcamp, course, lab, custom)
4. Configure layout and design:
   - Select orientation
   - Choose branding style
   - Set colors
   - Position logo
5. Edit content:
   - Certificate title (supports placeholders: `{userName}`, `{achievementName}`, `{date}`)
   - Body text
   - Add signature fields
6. Preview template with sample data
7. Save template

### Issuing a Certificate

**Individual Issuance:**
1. Admin Dashboard → Certificates tab → "Issue Certificate"
2. Select recipient (autocomplete by name/email)
3. Choose template
4. Fill in achievement details
5. Preview certificate
6. Issue (creates certificate record, notifies student)

**Bulk Issuance:**
1. Upload CSV with columns: `userId`, `templateId`, `achievementName`, `completionDate`
2. System validates users and templates
3. Preview first 5 certificates
4. Confirm bulk issuance
5. Certificates issued, notifications sent

### Managing Certificates

**View All Certificates:**
- Filterable by type, template, date range
- Searchable by recipient name or credential ID
- Sortable by issue date

**Revoke Certificate:**
- Select certificate → "Revoke"
- Provide reason (optional)
- Confirm revocation
- Certificate marked as revoked, no longer verifiable
- Student notified

## Student Experience

### Viewing Certificates

**Dashboard Access:**
- Navigate to `/dashboard/certificates`
- View all earned certificates in gallery layout
- Certificate cards show:
  - Certificate title
  - Issue date
  - Certificate type badge
  - Credential ID
  - Preview thumbnail

### Downloading Certificates

1. Click certificate card → detail view
2. Click "Download PDF"
3. PDF generated and downloaded
4. Filename: `QYVORA-Certificate-{Title}-{Date}.pdf`

### Sharing Certificates

**Share Options:**
- Copy verification link (`https://qyvora.org/verify/{credentialId}`)
- Share on LinkedIn (direct integration)
- Download and email
- Display on public profile (privacy controlled)

## Verification System

**Status:** ✅ IMPLEMENTED (frontend) — backend endpoint pending per `CREDENTIAL-DATA-MODEL.md`

Anyone can verify a credential by pasting its ID into the public `/verify` page. No account, no
login, no approval — this is the platform's core trust claim.

### Routes (public, inside `PublicShell`)

| Path | Component | Behaviour |
|------|-----------|-----------|
| `/verify` | `VerifyPage` | Lookup form + "how verification works" panel |
| `/verify/:credentialId` | `VerifyPage` | Deep link — verifies the ID on mount (shareable/printable) |

Both routes are declared before the `/:handle` profile catch-all in `src/app/router.tsx`, so the
static `/verify` segment always wins the match.

### Logic — `src/core/services/credentialVerification.ts`

**Input normalisation** (`normalizeCredentialId`):
- Trims whitespace/newlines (IDs are often pasted across lines)
- Accepts a full verification URL — `https://qyvora.org/verify/<id>` resolves to `<id>`
- Validates against `^[A-Za-z0-9-]{8,64}$` (UUID v4 per the credential spec, legacy `QYVORA-{TYPE}-{HASH}` also accepted)
- Lookup is case-insensitive

**Resolution order** (`verifyCredential`):
1. `GET /api/credentials/verify/:credentialId` (the spec'd public endpoint)
2. If the API answers with a credential → mapped to a result, `source: 'api'`
3. On API error / no record → consult the **local fallback registry**, `source: 'local'`
4. Nothing found → `not-found`

**States:**

| State | Meaning |
|-------|---------|
| `valid` | Credential exists, status `ACTIVE` |
| `revoked` | Credential exists but status is `REVOKED`/`SUSPENDED` |
| `not-found` | Well-formed ID, no record in the API or local registry |
| `invalid` | Input could not be parsed as a credential ID (inline form error) |
| `error` | Verification service unreachable / server error |

**Local fallback registry (temporary):** while the backend endpoint is not live, three demo
credentials resolve locally. Every local result is flagged `source: 'local'` and the UI renders a
notice — *"Served from a local demonstration record — the credential API is not connected
yet."* — so a local record is never mistaken for a chain-verified backend result. Remove the
registry once `GET /api/credentials/verify/:credentialId` ships.

| Demo ID | Programme | Status |
|---------|-----------|--------|
| `550e8400-e29b-41d4-a716-446655440000` | QOSE | ACTIVE |
| `b17e50c1-9a3f-4c2e-8d5a-2f4c1a7e9b01` | HPB | ACTIVE |
| `d4c1a9e7-3b52-4f80-9a11-6e2f7c3d5a10` | HPB | REVOKED |

### Result display

- **Valid:** status panel (verified icon, active status, chain anchor block #), recipient /
  programme / cohort / completion / result / issued fields, full credential ID, copy-link action,
  and a **read-only certificate preview** rendered by `CertificateRenderer` (programme artwork
  chosen from `bootcampId`)
- **Revoked:** revocation notice — the credential no longer proves completion; no certificate
  preview is shown
- **Not found / invalid / error:** clear InlineAlert or card with recovery guidance
- Loading state uses `Skeleton` with `role="status"` / `aria-live="polite"` on the result region

### API contract (spec'd — `CREDENTIAL-DATA-MODEL.md`)

```
GET /api/credentials/verify/:credentialId        (public, no auth)

{
  "success": true,
  "valid": true,
  "credential": {
    "recipientName": "John Doe",
    "programName": "QYVORA Offensive Security Engineer",
    "cohortIdentifier": "Cohort 1 - Nov 2026",
    "completionDate": "2027-01-31T12:00:00Z",
    "result": "PASS",
    "issuedAt": "2027-01-31T14:30:00Z",
    "chainVerified": true,
    "blockIndex": 1234
  }
}
```

The frontend mapper (`mapApiResponse`) additionally tolerates `status`
(`ACTIVE`/`REVOKED`/`SUSPENDED`) and `bootcampId` (`QOSE`/`HPB`) when the backend provides them.

### Privacy

- Public verification exposes only: recipient name, programme, cohort, completion/issue dates,
  result, status and credential ID (the fields the credential spec defines as public)
- Revocation reason is **not** exposed publicly
- The page is `noindex` — verification results are not indexed by search engines
- Verification requires no account and is rate-limited server-side when the endpoint ships

### QR Code (planned)

- Each certificate will include a QR code scanning to `/verify/<credentialId>`
- Not yet rendered — `config.showQr` is reserved in `CertificateTemplateConfig`

### Blockchain Integration (Future)

Planned features:
- Credential issuance events recorded on qyvora-chain (`CREDENTIAL_ISSUED` event type)
- Immutable audit trail
- Cryptographic verification (SHA-256 canonical record hash)
- Tamper-proof credential registry

## Technical Implementation

### File Structure

```
src/shared/components/certificates/
└── CertificateRenderer.tsx        # ✅ Certificate rendering (HPB + QOSE templates)

src/features/admin/pages/certificates/
└── TemplatesPage.tsx              # ✅ Admin Certificates tab (template config + live preview)

src/features/marketing/pages/public/
└── VerifyPage.tsx                 # ✅ Public /verify + /verify/:credentialId

src/core/services/
└── credentialVerification.ts      # ✅ Normalisation, API call, local fallback registry

Planned:
src/features/admin/components/certificates/
├── CertificatesTab.tsx            # Main admin tab
├── CertificateTemplateEditor.tsx  # Template visual editor
├── CertificatePreview.tsx         # Live preview component
├── IssueCertificateModal.tsx      # Individual issuance modal
└── BulkIssueCertificateModal.tsx  # Bulk issuance modal

src/shared/components/certificates/
├── CertificateCard.tsx            # Student dashboard card
├── CertificateDetailModal.tsx     # Full certificate view
└── CertificateDownload.tsx        # Download button + PDF gen
```

### State Management

**Admin State:**
- Template list in local state (fetched on tab mount)
- Selected template in editor state
- Form state for issuance modals

**Student State:**
- Certificates fetched via `GET /api/student/certificates`
- Cached in component state
- Refetched on certificate download/share

### Badge Primitives Integration

Certificates use badge primitives from `src/shared/components/badges/`:
- `BadgeBase` - Base badge component with consistent styling
- `BadgeIcon` - Icon badges for certificate types
- `BadgeLabel` - Text badges for status (verified, revoked)

See `docs/COMPONENTS.md` for badge primitive documentation.

## Security Considerations

### Access Control

- Certificate templates: Admin-only CRUD
- Certificate issuance: Admin-only
- Certificate viewing: Student can only view their own
- Certificate verification: Public (read-only)
- Certificate download: Authenticated, owner-only

### Data Validation

- Credential ID uniqueness enforced (database unique constraint)
- Template validation (required fields, valid colors)
- User existence check before issuance
- Rate limiting on bulk issuance (max 100 per request)

### Privacy

- Public verification shows only the credential fields defined as public in the credential spec (recipient name, programme, cohort, dates, result, status, credential ID) — no email or other personal data
- Revocation reason not exposed publicly
- Student controls certificate visibility on public profile (planned)
- Download logs not tracked (privacy-preserving)

## Future Enhancements

**Planned:**
- Blockchain verification integration
- Digital signatures (cryptographic)
- Badge/micro-credential system
- LinkedIn Skills integration
- Auto-sharing to social platforms
- Certificate expiration dates (for time-sensitive credentials)
- Multi-language certificate templates
- Certificate analytics dashboard

**Under Consideration:**
- Certificate stacking/progression paths
- Employer verification API
- Certificate marketplace (showcase achievements)

> NFT minting / token standards are **explicitly out of scope** — qyvora-chain is a
> proof-of-authority event ledger (see OCT-007 in `qyvora-docs`). "Certified" / "accredited"
> wording is blocked on company registration (FDR-001); use "credential" / "Certificate of
> Completion" only.

## Related Documentation

- **COMPONENTS.md** - Badge primitives and shared components
- **DESIGN_SYSTEM.md** - Visual design tokens and patterns
- **ARCHITECTURE.md** - Admin features and API integration
- **ROUTING.md** - Route table (includes `/verify` routes)
- `knowledge/qyvora-docs/09-technical/credential-system/` - Credential data model, hash/chain
  integration and verification service spec (source of truth for the API contract)
- `knowledge/qyvora-docs/11-october-execution/OCT-007-CERTIFICATE-BADGE-ARCHITECTURE-GAP.md` -
  Architecture gap report and build order for the credential system
