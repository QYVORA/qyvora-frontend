# QYVORA Certificate System Audit, Redesign, and Implementation

## 1. Role and Objective

You are a senior React, Vite, frontend architecture, UI/UX, and document-rendering engineer working on the QYVORA platform.

Your task is to perform a comprehensive audit of the existing certificate system, recommend the best design improvements based on your findings, and implement those improvements directly in the current repository.

This is an implementation task, not a request for a report alone.

The objective is to deliver a professional, visually distinctive, minimal, responsive, and technically reliable certificate system for QYVORA, with particular attention to the **Hacker Protocol Bootcamp (HPB)** and **QYVORA Offensive Security Engineer Bootcamp (QOSE)** certificates.

Both certificate types must look intentional, premium, and recognizably part of the QYVORA platform. They must not resemble plain white sheets with text and logos scattered across them.

Audit first, establish the current architecture, define the appropriate improvements, and then implement and test the changes.

## 2. Mandatory Repository-First Audit

Before changing code, inspect the current repository and establish how the certificate system actually works.

Identify:

- The certificate preview, rendering, and layout components.
- The certificate templates and their relationship to HPB and QOSE.
- The existing logo assets, their mappings, and how they are rendered.
- The certificate verification text, verification URL, certificate ID, and any QR code or verification mechanism.
- The PDF generation and download implementation.
- The existing font-loading, image-loading, and page-sizing logic.
- The certificate preview and any admin-side template configuration.
- The backend endpoints or data structures responsible for certificate information, if applicable.
- The current platform design system, typography, colors, spacing, and component conventions.
- Any shared components used by certificates, badges, courses, labs, bootcamps, or public profile pages.

Use the current repository as the source of truth. Do not rely on old screenshots, outdated branches, assumed file paths, or previous implementations that may no longer exist.

Before editing, trace the complete flow from certificate data to preview to exported document. Identify the causes of existing layout problems instead of applying superficial CSS patches.

Preserve existing functionality, established architecture, and valid certificate records unless a change is necessary and justified.

## 3. Certificate Design Audit and Recommendations

Evaluate the existing certificates against professional certificate-design standards.

Inspect:

- Visual hierarchy and readability.
- Logo placement, sizing, alignment, and proportions.
- Typography, font weights, and spacing.
- Certificate title, recipient name, program name, achievement description, and issue date.
- Decorative borders, geometric elements, dividers, and background treatments.
- Use of the QYVORA brand identity.
- Verification information and certificate authenticity.
- Layout balance and whitespace.
- Landscape or portrait orientation and the suitability of the aspect ratio.
- Screen preview versus exported PDF consistency.
- Long names, long course titles, missing optional fields, and other edge cases.
- Print readability and the visual quality of downloaded certificates.

Based on the audit, determine the best certificate layout and implement it. Do not stop after listing recommendations.

Choose a coherent visual direction that makes the certificates distinctive, modern, and credible while remaining consistent with QYVORA's existing platform.

## 4. Required Logo Changes

The certificate must contain **exactly two visible logos**:

1. The relevant program logo at the top, such as the HPB logo on an HPB certificate.
2. The QYVORA company logo at the top.

Requirements:

- Increase the logos' current rendered sizes moderately so they are clearly visible and recognizable.
- Position them within a deliberate, balanced header layout.
- Maintain their original aspect ratios.
- Ensure neither logo appears stretched, distorted, cropped, or pixelated.
- Provide consistent spacing between the logos and surrounding content.
- Make sure both logos remain correctly positioned in the certificate preview and every exported format.
- Remove the additional badge currently appearing at the bottom of the certificate.
- Do not render duplicate logos or introduce extra branding marks that function as additional logos.

Use the correct existing logo assets and mappings. Do not substitute arbitrary images or create text-based imitations of the logos.

The logo arrangement should feel like part of a professionally designed certificate rather than two images placed above a document.

## 5. Verification Text and Authenticity

Redesign the verification information so that it appears as a small, unobtrusive element at the very bottom of the certificate.

The verification text must:

- Be compact and readable.
- Use restrained typography and appropriate spacing.
- Remain visually subordinate to the recipient's name, program title, and achievement.
- Stay within the certificate's bottom boundary.
- Avoid competing with the main content.
- Remain visible in the preview, PDF, and image exports.

Preserve the existing verification mechanism, certificate identifier, and verification URL where applicable. Do not weaken, remove, or fabricate authenticity information.

If the system currently supports a verification QR code, inspect its implementation before deciding whether it belongs in the final design. Any retained QR code must remain functional and must not introduce a third logo.

The goal is a subtle verification footer, not a large badge or an additional branding section.

## 6. Visual Redesign: HPB and QOSE

Redesign the HPB and QOSE certificates so they have a distinctive, professional appearance.

### Brand direction

Use QYVORA's established visual identity as the starting point. Prefer a restrained combination of two complementary brand colors, supported by neutral tones.

For example, investigate combinations involving:

- Deep black or charcoal.
- QYVORA's existing green.
- White or a warm, light neutral background.
- Subtle secondary accents that improve visual hierarchy without introducing unnecessary decoration.

Do not automatically use every color listed. Select a coherent palette after inspecting the actual platform styles and existing brand assets.

### Design requirements

The certificates should include:

- A well-balanced header containing the two required logos.
- A clear, prominent certificate heading.
- A visually strong recipient-name treatment.
- A clear program or qualification title.
- A readable statement describing the achievement.
- Appropriate issue-date and other existing certificate metadata.
- A restrained verification footer at the bottom.
- Intentional decorative elements that make the certificate look designed rather than generic.

Use a considered combination of typography, spacing, borders, fine rules, geometric accents, or restrained color panels to create depth and identity.

Avoid:

- Plain white layouts with no meaningful design treatment.
- Random decorative elements.
- Excessive colors or gradients.
- Large empty areas caused by poor alignment.
- Excessive borders, badges, icons, or repeated branding.
- Overlapping or clipped text.
- Inconsistent spacing.
- Tiny or excessively large logos.
- Unnecessary UI controls inside the exported certificate.

### HPB certificate

The HPB certificate should have its own recognizable identity while remaining consistent with QYVORA's overall brand system.

Use the actual HPB logo and program information. Ensure that the certificate communicates successful completion of the Hacker Protocol Bootcamp without unnecessary clutter.

### QOSE certificate

The QOSE certificate should feel appropriate for a more advanced, professional offensive-security training program.

Use the correct QOSE program branding and qualification information. It may use a slightly different decorative treatment or color balance from HPB, but both certificates must clearly belong to the same certificate family.

Do not invent accreditation, licensing, university affiliations, professional qualifications, signatures, or institutional endorsements that are not supported by the existing system.

### Shared design system

Prefer a shared certificate renderer with configurable templates or design tokens over two unrelated implementations.

The HPB and QOSE templates should reuse the same layout logic, typography rules, logo handling, verification footer, and export infrastructure wherever practical.

Program-specific colors, decorative elements, titles, and content should be configurable without duplicating the entire rendering implementation.

If the current architecture already provides a sound template system, extend it rather than introducing unnecessary abstractions.

## 7. Fix PDF Export and Text Clipping

A critical existing problem is that some certificate text appears in the preview but is missing from the downloaded PDF.

Investigate and fix the underlying cause.

Check for:

- Content extending beyond fixed-height containers.
- Incorrect page dimensions or aspect ratios.
- CSS properties unsupported by the PDF renderer.
- Text wrapping and line-height differences.
- Font loading failures or font substitution.
- Images and logos that have not finished loading before export.
- Asynchronous rendering and premature PDF capture.
- Incorrect print styles or export-specific styles.
- Clipping caused by overflow, transforms, or absolute positioning.
- Content positioned outside the printable page.
- Incorrect scaling or cropping during capture.
- Export libraries that omit certain elements or render them inconsistently.

Implement a reliable export process that ensures the complete certificate content is included.

Requirements:

1. The downloaded PDF must contain all intended certificate text and metadata.
2. The page dimensions and orientation must match the intended certificate format.
3. Logos and decorative elements must be rendered correctly.
4. Fonts must be loaded or embedded appropriately for the chosen export method.
5. Text must remain readable and must not be clipped, overlapped, or unexpectedly substituted.
6. Export must wait for required fonts, images, and rendering operations to complete.
7. The certificate must maintain correct margins and remain within the page boundaries.
8. The exported PDF must not introduce extra blank pages or unintended UI elements.
9. Long recipient names and program titles must be handled gracefully.
10. Export failures must be handled clearly instead of silently producing broken files.

Prefer a robust export approach compatible with the current project architecture. Do not replace the existing PDF library merely for stylistic reasons. Change it only if the audit establishes that the current approach cannot meet the requirements reliably.

Avoid brittle CSS hacks designed only to make one example certificate look correct.

## 8. Add Image Downloads and Recommended Formats

Users must be able to download their certificates as both PDF and image files.

### Required formats

**PDF**

- Suitable for printing, applications, and formal document submission.
- Uses consistent page dimensions.
- Preserves the complete certificate layout.

**PNG**

- Provides a high-resolution, lossless image.
- Suitable for sharing online, displaying on profiles, and preserving fine text and decorative details.
- Should be the primary image-download format.

**JPEG**

- Provides an additional image option for platforms that prefer JPEG.
- Use a sensible quality setting and an appropriate background so transparency does not cause visual problems.

Evaluate whether additional formats are genuinely useful. SVG may be appropriate if the existing renderer can produce a safe, faithful vector export. Otherwise, do not add it merely to increase the number of buttons. Do not introduce DOCX or editable source exports unless there is a clear product requirement.

### Export implementation requirements

- Provide clear, accessible download controls for PDF, PNG, and JPEG.
- Use meaningful filenames containing the certificate type and recipient identifier or name where appropriate, without exposing unnecessary personal information.
- Ensure all formats use the same certificate data and visual template.
- Preserve the two-logo rule and verification footer across every format.
- Produce sufficiently high-resolution images for professional sharing and printing.
- Prevent incomplete downloads while rendering or assets are still loading.
- Provide useful loading and error states.
- Prevent duplicate submissions or overlapping export operations where necessary.
- Ensure downloads work on supported desktop and mobile browsers.
- Clean up temporary resources such as generated object URLs when appropriate.

Do not simply capture the visible preview at its current screen resolution. Export quality must be independent of the size at which the preview happens to be displayed.

## 9. Preview and User Interface

Improve the certificate interface without introducing unnecessary clutter.

The certificate preview should be the main focus.

Organize the controls so users can clearly identify the available download formats. Reuse the platform's existing button styles, icons, typography, spacing, and responsive conventions.

Requirements:

- Keep the certificate preview visually dominant.
- Place PDF, PNG, and JPEG download actions in a compact, understandable control area.
- Avoid excessive buttons, duplicate actions, unnecessary cards, or decorative containers.
- Preserve relevant existing verification and certificate-management functionality.
- Ensure the preview is responsive on desktop and mobile.
- Prevent the preview controls from appearing in exported certificate files.
- Ensure the certificate itself retains its intended aspect ratio instead of becoming distorted to fit the screen.
- Handle small screens by scaling the preview appropriately without making the actual exported document smaller or lower quality.

Inspect the existing certificate admin or template-management interface before making changes. If administrators can configure templates, ensure the redesign remains compatible with that workflow and that the preview accurately reflects the final exported document.

## 10. Implementation and Architecture Requirements

Work within the existing QYVORA repository and its established conventions.

- Reuse existing shared components, design tokens, and logo assets.
- Maintain the current React and Vite architecture.
- Preserve existing API contracts and certificate data structures unless a change is necessary.
- Keep rendering, template configuration, and file-export responsibilities clearly separated.
- Avoid duplicating layout logic between HPB and QOSE.
- Keep the implementation maintainable, readable, and testable.
- Avoid unnecessary dependencies and unrelated refactors.
- Do not hardcode recipient details, certificate IDs, verification URLs, or program-specific content into shared components.
- Preserve existing authorization and certificate ownership checks.
- Ensure that generated exports use the actual certificate data rather than placeholder content.
- Avoid exposing sensitive certificate data in filenames, logs, or public URLs unnecessarily.

If the current architecture contains a defect that affects the required result, fix it at the appropriate level rather than concealing it with a visual workaround.

## 11. Testing and Validation

Do not consider the task complete simply because the page looks good in the browser.

Run the relevant existing checks and add or update tests where practical.

### Functional tests

Verify that:

- HPB certificates render with the correct HPB and QYVORA logos.
- QOSE certificates render with the correct QOSE and QYVORA logos.
- Exactly two visible logos appear on each certificate.
- No unwanted bottom badge is rendered.
- The verification footer appears at the bottom.
- All certificate fields appear correctly.
- PDF downloads contain the full intended content.
- PNG downloads produce valid, high-resolution images.
- JPEG downloads produce valid images with an appropriate background.
- Existing certificate verification remains functional.
- Download actions handle failures and loading states correctly.

### Visual tests

Inspect both certificates at realistic export dimensions.

Check:

- Logo sizing and alignment.
- Typography and text hierarchy.
- Background colors and decorative elements.
- Margins and page boundaries.
- Text wrapping and long names.
- Footer placement.
- Missing assets.
- Unexpected blank space.
- Content clipping and overlapping.
- Differences between preview, PDF, PNG, and JPEG.

Use screenshots or rendered-file inspection when available. Compare the actual exported files with the intended preview rather than relying exclusively on browser screenshots.

### Regression tests

Confirm that the changes do not break:

- Existing certificate records.
- Other programs that use the shared certificate renderer.
- Certificate verification pages.
- Admin-side certificate configuration.
- Existing certificate download workflows.
- Responsive layout.
- Existing authentication and authorization behavior.

Run the repository's applicable test suite, linting, type checks, and production build. Fix failures introduced by the changes and clearly identify any pre-existing failures.

## 12. Definition of Done

The task is complete only when all applicable criteria below have been met:

- [ ] The existing certificate implementation has been audited.
- [ ] The audit findings have informed an implemented design, not just a written recommendation.
- [ ] HPB and QOSE certificates have a professional, branded two-color design.
- [ ] Each certificate displays exactly two logos, both at the top.
- [ ] The logos are moderately larger, correctly proportioned, and aligned.
- [ ] The unwanted bottom badge has been removed.
- [ ] The verification text is small, subtle, readable, and positioned at the bottom.
- [ ] PDF export includes all intended text and metadata.
- [ ] PNG and JPEG downloads work correctly.
- [ ] The PDF and image exports retain the correct layout and branding.
- [ ] Preview and exported documents have been visually checked.
- [ ] Long names and content variations do not break the layout.
- [ ] Existing verification, authorization, and certificate records remain intact.
- [ ] Relevant automated checks and the production build have been run.
- [ ] No unnecessary clutter or unrelated UI changes have been introduced.

## 13. Final Report

After implementation, provide a concise but technically meaningful report covering:

1. **Audit findings:** What was wrong with the original certificate system and why.
2. **Design decisions:** What design was selected for HPB and QOSE and why it fits QYVORA.
3. **Files changed:** The important files and components modified or created.
4. **Export improvements:** The cause of missing PDF text and the implemented fix.
5. **Download formats:** How PDF, PNG, and JPEG generation works.
6. **Testing:** Which tests, lint checks, builds, and export validations passed or failed.
7. **Remaining issues:** Any limitations that could not be resolved, with their actual causes.

Do not claim that a test passed unless it was actually executed and passed.

## Final Instruction

Start by auditing the current certificate implementation and tracing its rendering and export pipeline. Form evidence-based design recommendations, then implement the best practical solution directly in the existing codebase.

Prioritize visual quality, layout precision, export reliability, maintainable architecture, and consistency with QYVORA's established design system.

**Do not stop after the audit. Do not return recommendations without implementing them. Do not make superficial styling changes while leaving PDF export broken. Deliver a tested, production-ready improvement to the existing certificate system.**

## 14. Additional Requirement: Fix HPB Badge and Student Profile Branding

As part of this task, audit and fix the HPB badge/logo displayed throughout the student profile pages, including both public and private profiles where applicable.

### The Core Requirement

**The official HPB logo must be the single source of truth for HPB branding. The HPB logo itself is the badge for the Hacker Protocol Bootcamp.**

The website currently displays an incorrect HPB badge. Investigate the existing badge assets, logo mappings, badge-rendering components, and profile data to identify the cause and correct it.

### Required Changes

1. **Replace the incorrect HPB badge:** Use the correct, existing official HPB logo asset wherever the HPB achievement badge is displayed on student profiles.
2. **Remove duplicate HPB branding:** Do not create or retain a separate, unrelated badge design for HPB. The HPB logo itself must represent the achievement.
3. **Audit all profile views:** Check public student profiles, private student profiles, profile achievement sections, and any shared components responsible for displaying earned bootcamp badges.
4. **Preserve other achievements:** Do not replace QOSE badges, other bootcamp logos, course badges, lab badges, or unrelated achievements with the HPB logo.
5. **Correct the underlying mapping:** Fix the asset-to-program mapping or badge-resolution logic responsible for the incorrect image. Do not solve this with a one-off visual workaround.
6. **Preserve existing achievement behavior:** Keep the current earned-status checks, badge metadata, profile permissions, and achievement records intact.
7. **Maintain visual consistency:** Display the HPB logo clearly, with appropriate sizing, aspect ratio, and alignment across desktop and mobile layouts.
8. **Reuse shared components:** If the same badge renderer serves multiple profile or achievement views, correct the shared mapping so every relevant view uses the proper asset.

### Validation

After implementation:

- Verify that the HPB logo appears as the HPB achievement badge on both public and private student profiles.
- Confirm that no incorrect or duplicate HPB badge remains in the audited profile components.
- Confirm that QOSE and all other achievement badges still display their correct logos.
- Check that the badge is not stretched, cropped, or incorrectly scaled.
- Run the relevant tests and inspect the actual rendered profile pages.

Include this fix in the overall certificate and branding audit, and report the files and mappings changed.

**Important:** The HPB logo is the HPB badge. Do not design another HPB badge, generate a replacement logo, or introduce a second HPB-specific achievement graphic. Reuse the official existing HPB logo asset and correct the underlying implementation.
