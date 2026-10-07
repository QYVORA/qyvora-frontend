# Certificate System

> **Status:** ✅ IMPLEMENTED  
> **Last Updated:** 2026-10-07  
> **Location:** `src/features/admin/components/certificates/`

## Overview

The QYVORA certificate system provides a template-based certificate generation and management system for recognizing student achievements. Certificates can be issued for bootcamp completion, course completion, lab mastery, and other learning milestones.

## Architecture

### Components

**Admin Components:**
- `CertificatesTab` - Admin dashboard tab for certificate management
- `CertificateTemplateEditor` - Visual editor for certificate templates
- `CertificatePreview` - Live preview of certificate with sample data
- `IssueCertificateModal` - Modal for issuing certificates to students

**Shared Components:**
- `src/shared/components/certificates/CertificateCard` - Display certificate in student dashboard
- `src/shared/components/certificates/CertificateDownload` - Download certificate as PDF

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

**Layout:**
- Standard margins: 60px all sides
- Content max-width: 800px (portrait), 1000px (landscape)
- Signature spacing: 40px between signatures
- Logo size: 120px max height

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
- `GET /api/verify/:credentialId` - Verify certificate authenticity

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

### Public Verification

**Verification Page:** `/verify/:credentialId`

Displays:
- Certificate preview (read-only)
- Verification status (valid/revoked/not found)
- Issue date
- Recipient name (first name + last initial for privacy)
- Issuing authority: "QYVORA"
- Credential ID

**QR Code:**
- Each certificate includes QR code
- Scans to verification page
- Mobile-friendly verification

### Blockchain Integration (Future)

Planned features:
- Certificate issuance events recorded on qyvora-chain
- Immutable audit trail
- Cryptographic verification
- Tamper-proof credential registry

## Technical Implementation

### File Structure

```
src/features/admin/components/certificates/
├── CertificatesTab.tsx           # Main admin tab
├── CertificateTemplateEditor.tsx # Template visual editor
├── CertificatePreview.tsx        # Live preview component
├── IssueCertificateModal.tsx     # Individual issuance modal
└── BulkIssueCertificateModal.tsx # Bulk issuance modal

src/shared/components/certificates/
├── CertificateCard.tsx           # Student dashboard card
├── CertificateDetailModal.tsx    # Full certificate view
├── CertificateDownload.tsx       # Download button + PDF gen
└── CertificateVerification.tsx   # Public verification display
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

- Public verification shows limited info (first name + last initial)
- Student controls certificate visibility on public profile
- Revocation reason not exposed publicly
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
- NFT certificates (blockchain-native)
- Certificate stacking/progression paths
- Employer verification API
- Certificate marketplace (showcase achievements)

## Related Documentation

- **COMPONENTS.md** - Badge primitives and shared components
- **DESIGN_SYSTEM.md** - Visual design tokens and patterns
- **ARCHITECTURE.md** - Admin features and API integration
