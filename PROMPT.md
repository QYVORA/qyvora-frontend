# QYVORA Profile System Redesign: Full Execution Prompt

## 1. Mission and execution rules

Redesign and implement the entire QYVORA profile system, including both public profiles and private, authenticated user profiles.

This is a **complete profile experience redesign**, not a cosmetic update to the existing pages.

Treat the existing profile UI, layout decisions, and page-specific styling as replaceable. Do not assume the current profile structure must be preserved. However, do not delete existing backend capabilities, account data, authentication flows, permissions, achievements, or integrations simply because the UI is being redesigned.

The objective is to create a distinctive, minimal, polished, responsive profile experience that fits the established QYVORA design language and presents each user's identity, accomplishments, progression, and social presence without unnecessary visual clutter.

### Mandatory execution rules

1. Inspect the current repository before implementing anything.
2. Identify the actual frontend framework, routing, shared components, API clients, authentication implementation, database models, and existing profile functionality.
3. Study the current landing page and other well-designed public pages. Use these as the primary visual references for the new profile system.
4. Inspect the existing course, lab, bootcamp, badge, CP, rank, and achievement implementations before changing their presentation.
5. Reuse existing functionality wherever it is correct. Extend or refactor it when necessary rather than creating competing implementations.
6. Implement the actual pages, components, integrations, and tests. Do not stop after producing a design proposal or a list of recommendations.
7. Do not fabricate backend endpoints, database fields, OAuth configurations, user statistics, achievement records, or successful integrations.
8. If a required capability does not exist, implement it when feasible or clearly document the missing dependency.
9. Preserve backward compatibility with existing routes and stored user data wherever practical.
10. Do not touch the existing bootcamp logo assets, bootcamp badge system, or bootcamp completion behavior.
11. Complete the redesign using the actual repository and available assets, not imagined screenshots or assumptions about an older version of the application.

Before modifying files, produce a concise internal implementation plan based on the repository audit. Then proceed with the implementation without waiting for approval unless a genuine blocker requires a decision.

---

## 2. Design direction

The new profile system must feel native to QYVORA.

Use the current landing page and the strongest existing public pages to establish the visual direction. Inspect their typography, spacing, navigation, borders, backgrounds, iconography, section layouts, responsive behavior, and interaction patterns.

### Existing design language

Follow the established QYVORA visual identity:

* Predominantly black and near-black backgrounds.
* White and muted neutral text.
* QYVORA's established green accent, including the existing `#06B66F` palette where appropriate.
* Clean typography using the fonts and tokens already adopted by the application, including Space Grotesk and JetBrains Mono where they fit.
* Restrained borders and carefully controlled contrast.
* Minimal, purposeful interface elements.
* Consistent spacing, alignment, and typography.
* No decorative gradients.
* No oversized dashboard cards.
* No unnecessary shadows or ornamental effects.
* No horizontal scrolling on mobile.
* No unnecessary animations or distracting motion.

Use the existing design tokens and shared components wherever possible.

Do not impose a new design system on the application merely to build the profile pages.

### The intended visual identity

The profile should feel like a personal cybersecurity identity and achievement record.

It should communicate:

* Who the person is.
* What they have accomplished on QYVORA.
* Their current rank and progression.
* Their earned course and lab badges.
* Their CP balance.
* Their verified external presence.

The design should be restrained enough that the achievements themselves become the visual highlights.

Do not make the profile resemble a generic SaaS account dashboard, a social network feed, a gaming inventory, or a collection of identical cards.

---

## 3. Architecture: public and private profiles

Create a unified profile architecture with two distinct experiences.

### A. Public profile

The public profile is the shareable representation of a user's QYVORA identity.

It should show only information that the user has chosen to make public and that the application is authorized to expose.

Expected elements:

* Profile avatar.
* Display name.
* Username or public profile handle.
* Short biography, if provided.
* Earned course badges.
* Earned lab badges.
* Current rank insignia and rank name.
* Publicly visible CP information, subject to the platform's privacy settings.
* Connected public social accounts.
* Portfolio website, if provided and public.
* Optional joined date or other useful profile metadata, if already supported and appropriate.

Keep this information concise and well organized.

Do not automatically expose private account information, email addresses, OAuth tokens, private GitHub data, authentication provider identifiers, internal account IDs, or administrative information.

Do not show empty sections simply because the user has not completed their profile.

If a user has no achievements, provide a clean, understated empty state rather than rendering a large empty container.

### B. Private profile

The private profile is the authenticated user's profile management experience.

It should use the same core visual components as the public profile, with additional controls for editing and account management.

Include the following capabilities:

* Edit display name and biography.
* Upload or change the profile avatar, if avatar upload is supported or can be implemented safely.
* View earned course badges.
* View earned lab badges.
* View current rank and CP balance.
* Inspect achievement details.
* Connect or disconnect supported social accounts.
* Add or edit a portfolio URL.
* Control which supported profile details appear publicly.
* Preview the public-facing profile where practical.
* View profile completeness only if it provides genuine value without encouraging meaningless data entry.

Do not create two unrelated profile implementations.

Use shared components, data models, and presentation logic wherever appropriate, while keeping private editing controls separate from the public profile.

An unauthenticated visitor must never gain access to another user's private profile controls by manipulating routes, API requests, or client-side state.

---

## 4. Recommended page composition

Use this as the structural direction, not as permission to force every element into a card.

### Section 1: Identity header

Create a compact, distinctive identity header.

It should contain:

* Avatar.
* Display name.
* Username.
* Short biography.
* Rank insignia and rank name.
* A restrained CP summary.
* Relevant social links.

On public profiles, do not display editing controls.

On private profiles, provide a clearly placed Edit Profile action without making it the visual centerpiece.

Avoid wasting vertical space on a giant profile banner, oversized avatar, or decorative header artwork.

The header should adapt naturally to smaller screens.

### Section 2: Achievement badges

This is the most important visual section of the profile.

Create a dedicated achievement area containing badges for completed courses and completed labs.

**The badge is the original course or lab logo. It is not a generic icon placed inside a badge-shaped card.**

Each course and lab should use its corresponding existing transparent-background PNG logo as the achievement image.

Display these assets directly on the page without wrapping every logo in a card, tile, colored background, decorative frame, or unnecessary border.

Preserve their transparent backgrounds.

Do not distort their aspect ratios, crop important details, or modify the source assets unnecessarily.

Use consistent visual sizing and alignment while preserving the individual artwork.

The achievement area should feel like a carefully organized collection of earned insignia, not a grid of product cards.

#### Achievement interaction

Each badge should have an accessible, meaningful interaction.

On hover, keyboard focus, or activation, provide a concise indication of:

* Achievement name.
* Achievement category.
* Completion status.
* Completion date, if recorded.
* A short description, if available.

Use an accessible tooltip, popover, or compact detail view where appropriate.

On touch devices, provide a reliable tap interaction rather than depending on hover.

Do not place essential information exclusively in tooltips.

Avoid unnecessarily large modals for simple badge descriptions.

#### Achievement organization

Separate course achievements from lab achievements using clear headings, tabs, or compact filters.

Choose the simplest structure that fits the current volume of achievements.

If a user has many achievements, provide sensible pagination or a Show More interaction. Do not render an excessively long profile by default.

If filtering is implemented, support categories such as Courses and Labs. Do not invent additional achievement categories without examining the existing data model.

Display only legitimately earned achievements.

A course or lab appearing in the catalog does not mean that the user has completed it.

---

## 5. Course and lab completion badges

Implement or connect the achievement-awarding mechanism so that course and lab completion grants the corresponding logo as an earned badge.

### Required behavior

1. Identify the existing authoritative completion event or completion record for each course and lab.
2. Map each eligible course or lab to its existing logo asset and stable achievement identifier.
3. When completion is confirmed by the backend, award the corresponding achievement.
4. Persist the achievement using the existing data model or a suitable extension.
5. Make the achievement available to the user's private and public profiles according to the platform's privacy rules.
6. Prevent duplicate awards when completion requests are retried, completion events are replayed, or users refresh the page.
7. Ensure that users cannot award achievements to themselves by submitting a fabricated client-side completion request.
8. Preserve legitimate historical completion records and existing achievements.
9. Handle missing logo mappings gracefully without breaking the profile.
10. Make the completion flow and profile update consistent with the actual backend architecture.

Use stable identifiers for achievements rather than relying solely on display names or filenames.

A suitable logical relationship is:

`User → Earned Achievement → Achievement Definition → Course/Lab Logo`

Adapt this to the actual application architecture rather than blindly introducing new collections or models.

If achievements are already awarded correctly, do not replace that system. Integrate it into the new profile presentation and fix only verified gaps.

### Important distinction

The profile displays the badge because the user earned the achievement.

The profile must not award an achievement merely because a logo was loaded, a course page was visited, or a lab was opened.

---

## 6. Bootcamp preservation

Bootcamps are explicitly outside the scope of the new badge-system redesign.

Existing bootcamp logos and completion badges must remain unchanged.

Do not:

* Redesign bootcamp logos.
* Replace bootcamp badges with new SVGs.
* Change bootcamp achievement identifiers unnecessarily.
* Alter bootcamp completion requirements.
* Reimplement bootcamp certification or award logic.
* Break existing bootcamp pages or certificate integrations.

Inspect how bootcamp achievements currently work and preserve their existing behavior.

If the current profile already exposes bootcamp achievements, maintain their compatibility. Do not introduce a new bootcamp badge design or change the bootcamp asset mapping as part of this task.

Keep the new course and lab badge work isolated enough that a later, separately authorized bootcamp redesign can be undertaken without rewriting the entire achievement architecture.

---

## 7. CP balance and rank

QYVORA already has a CP or CyberPoints system. Integrate with its existing authoritative source.

Do not create a second point balance or calculate a new balance from incomplete frontend data.

### A. CP presentation

Show the user's accumulated CP in the identity header or a nearby progression area.

The CP presentation should include:

* The existing CP coin asset, if one is available.
* The user's actual earned CP balance.
* A concise label identifying the value as CP or CyberPoints.

**Do not place the CP coin inside a card.**

Display the coin directly alongside the number, preserving its transparent background and intended proportions.

Use a clean typographic treatment that makes the numerical balance easy to read without turning the profile into a statistics dashboard.

If the existing CP system exposes a transaction history or other useful detail, that may remain accessible through the relevant existing interface. Do not add a lengthy transaction feed to the profile.

### B. Rank presentation

The user's current rank must be visible near the identity header or CP summary.

Rank is separate from CP.

Read the current rank from the application's authoritative progression system. Do not invent a rank by arbitrarily dividing CP totals unless that is how the existing rank system actually works.

Each rank must have a distinct insignia.

Since the required rank badge assets do not yet exist, create a small, coherent set of original SVG rank insignias suitable for the current rank structure.

The SVGs must:

* Match the QYVORA design language.
* Use crisp vector geometry.
* Work against dark and light backgrounds where applicable.
* Remain recognizable at small sizes.
* Use transparent backgrounds where suitable.
* Scale without pixelation.
* Have consistent sizing and visual weight.
* Be distinguishable without relying exclusively on color.
* Avoid excessive detail that disappears on mobile.

Use simple geometric shapes, restrained cybersecurity-inspired symbolism, and a consistent progression in visual complexity.

Do not copy existing commercial game rank icons or another organization's proprietary insignias.

Create a reusable rank-to-insignia mapping so the interface can display the correct SVG for each actual rank.

Do not invent a new ranking algorithm or silently alter the existing rank thresholds.

If the application has no rank system, document that gap and implement only the rank presentation and mapping that can be supported safely by existing progression data. Do not fabricate ranks for real users.

---

## 8. Social account connections and portfolio

Build a clean social identity management area for the private profile.

The user should be able to connect supported external accounts and choose which account links are displayed publicly.

Initial scope:

* GitHub.
* X.
* LinkedIn.
* Portfolio website.

The design and connection architecture should be extensible to other providers in the future.

### A. GitHub account linking

QYVORA already has a GitHub OAuth integration or implementation in progress. Inspect the actual repository and reuse the existing integration where appropriate.

Users who already have a QYVORA account should be able to connect a GitHub identity to that account without creating a duplicate QYVORA account.

Where supported by the existing integration, provide a clear connection state:

* Not connected.
* Connected.
* Connection needs attention, if the provider or stored connection is invalid.

Display the verified GitHub username and a link to the corresponding public profile.

Do not assume that a successful QYVORA login automatically means GitHub is connected as a public social account. Authentication and optional account linking are distinct concerns.

If GitHub is already used as a sign-in provider, preserve its existing login behavior and implement explicit account linking as a separate, safe flow.

### B. X and LinkedIn OAuth

Determine whether the current application has provider integrations, credentials, callback routes, and sufficient API access for X and LinkedIn.

Where supported, implement proper OAuth-based account linking.

Use the provider's currently supported OAuth flow and minimum required scopes. Verify the official provider requirements before implementing the integration.

For each provider:

1. Initiate the connection from the authenticated private profile.
2. Generate and validate the appropriate state parameter.
3. Use PKCE where required or supported by the selected OAuth flow.
4. Redirect to the provider's legitimate authorization endpoint.
5. Validate the callback and exchange the authorization code on the server.
6. Retrieve the provider identity through an authorized, documented mechanism.
7. Associate the verified identity with the currently authenticated QYVORA account.
8. Persist only the information necessary for account linking and the intended public profile functionality.
9. Return the user to the appropriate profile page with a clear success or failure status.
10. Provide a safe disconnect action.

Do not implement a fake OAuth experience that merely asks the user to enter a username and marks the account as verified.

Do not assume that provider credentials, scopes, API permissions, or paid access are available.

If a provider requires application registration, developer approval, credentials, or permissions that are not present, implement the safe integration structure where feasible and document the exact external setup required. Never pretend the integration is operational until it has been tested with valid provider configuration.

### C. Prevent account-linking vulnerabilities

Social account linking must be tied to the authenticated QYVORA account initiating the flow.

Implement appropriate protections against:

* OAuth CSRF.
* Account-linking substitution.
* Account takeover through unsafe provider linking.
* Duplicate linking of the same external identity to multiple QYVORA accounts.
* Forged callback parameters.
* Unvalidated redirect URLs.
* Unauthorized unlinking.
* Accidental account creation during an account-linking flow.

Validate provider identity server-side.

Do not trust client-submitted usernames or profile URLs as proof of ownership.

Store OAuth secrets and refresh tokens only on the server when necessary. Never expose them in frontend responses, public profile data, logs, or client-side storage.

Request only the permissions required for the feature.

Disconnecting a social account must not automatically delete a user's QYVORA account or erase their course achievements.

If disconnecting an account could affect sign-in, warn the user and preserve a safe authentication method.

### D. Public social links

A connected account and a publicly displayed account are not necessarily the same thing.

Provide a simple visibility control for each supported social link.

Only show links the user has elected to publish.

Display provider icons and concise labels using the existing icon system where appropriate. Make external links accessible, validate their destinations, and open them safely.

Do not turn social links into a large grid of cards.

### E. Portfolio website

Allow the user to add, edit, and remove a portfolio URL.

Portfolio URLs do not require OAuth.

Validate and normalize the URL appropriately. Accept only safe web protocols such as HTTPS, with HTTP permitted only if there is a deliberate product requirement.

Reject dangerous schemes and malformed destinations.

Do not automatically mark a manually entered portfolio URL as identity-verified.

Display the portfolio as a compact, clearly labeled external link.

### F. Google OAuth

Google OAuth is explicitly outside this task's implementation scope.

Do not add Google to the public social-links list.

Do not add Google account linking as a feature of this profile redesign.

Preserve any existing Google authentication functionality elsewhere in the application.

Keep the account-linking architecture extensible so Google could be considered separately in the future without being implemented now.

---

## 9. Profile privacy and ownership

Implement profile visibility with server-side enforcement.

The public profile must never rely on CSS alone to hide private information.

Define which fields are public and which are private, based on the current application's data model and the intended profile experience.

At minimum:

* Public visitors can view only approved public profile information.
* Users can edit only their own profiles.
* Social visibility preferences are respected by the public API.
* OAuth credentials and provider tokens are never returned to public clients.
* Internal user IDs and provider IDs are not unnecessarily exposed.
* CP and rank values are read from authoritative application data.
* Earned achievements cannot be fabricated through frontend requests.
* Account-linking and disconnect operations require appropriate authentication and authorization.
* Public profile routes handle nonexistent, private, and unavailable profiles gracefully.

Use the existing authentication and authorization middleware wherever possible.

Do not duplicate authorization logic inconsistently across new routes.

---

## 10. Shared component architecture

Implement a reusable component architecture for the new profile system.

The precise component names should follow the repository's conventions, but the architecture should support components equivalent to:

* `ProfileHeader`
* `ProfileAvatar`
* `ProfileRank`
* `ProfileCPBalance`
* `AchievementSection`
* `AchievementBadge`
* `AchievementDetails`
* `SocialLinks`
* `SocialAccountConnection`
* `PortfolioLink`
* `ProfileVisibilityControls`
* `ProfileEditForm`
* `ProfileEmptyState`

Do not create every component as a separate file if doing so would add unnecessary complexity. Choose sensible boundaries based on reuse, responsibilities, and the existing project structure.

### Shared architecture requirements

* Reuse the same profile header on public and private profiles.
* Reuse the same badge-rendering component for course and lab achievements.
* Use a centralized mapping for course and lab logos.
* Use a centralized mapping for rank insignias.
* Keep bootcamp-specific achievement behavior separate and unchanged.
* Keep API and authentication logic out of purely presentational components.
* Use existing API clients and query patterns.
* Implement proper loading, error, empty, and success states.
* Prevent unnecessary repeated API requests.
* Avoid duplicating profile logic across separate routes.
* Follow existing accessibility conventions.
* Ensure that shared components remain maintainable when new courses, labs, ranks, or social providers are added.

Do not hardcode a long list of individual course badges into the profile JSX.

Use the actual achievement definitions and records returned by the application's existing data layer.

---

## 11. Responsive design requirements

The redesign must work properly on desktop, tablet, and mobile.

Test the actual pages at narrow and wide viewport sizes.

### Desktop

* Keep the identity header compact and well balanced.
* Use available horizontal space efficiently.
* Allow achievement logos to breathe without placing them in individual cards.
* Keep the rank and CP summary visually connected to the identity.
* Preserve the established site navigation and content alignment.
* Avoid an excessively wide or sparse layout.

### Mobile

* Stack the identity information naturally.
* Keep the avatar, name, rank, and CP balance readable.
* Ensure achievement logos remain large enough to recognize.
* Allow achievement sections to wrap cleanly.
* Prevent social links and editing controls from overflowing.
* Make tap targets accessible.
* Ensure tooltips and popovers work without hover.
* Avoid horizontal scrolling and clipped content.
* Keep editing forms comfortable to use on a touchscreen.
* Preserve sensible spacing without making the page excessively tall.

Do not simply shrink the desktop layout.

Use responsive layouts that reflect how people actually browse profiles on phones.

Test at least a narrow mobile viewport, a typical mobile viewport, a tablet viewport, and a desktop viewport.

---

## 12. Accessibility and interaction quality

Follow accessible interface practices throughout the implementation.

Requirements:

* Semantic headings and page landmarks.
* Accessible names for icon-only controls.
* Meaningful alternative text for achievement logos.
* Keyboard-accessible badge details and editing controls.
* Visible focus states.
* Sufficient text and icon contrast.
* Clear validation messages.
* Properly labeled form fields.
* Screen-reader-friendly success and error feedback.
* Reduced-motion support if animations are introduced.
* No interaction that requires a mouse hover to access essential information.

Do not use the same generic alternative text for every badge. Use the actual achievement name and category.

Keep animations subtle and consistent with the rest of the application. Motion must not delay basic navigation or interfere with scrolling.

---

## 13. Badge asset and mapping architecture

Audit the actual asset directories before creating or moving images.

Identify the existing transparent PNG logos for all eligible courses and labs.

Use existing assets whenever they are suitable.

Do not generate replacement logos for assets that already exist and are intended for this purpose.

Create or extend a centralized achievement mapping that associates each stable achievement identifier with its category, display name, logo asset, and any supported metadata.

Handle missing assets without crashing the page.

If a course or lab genuinely lacks a suitable logo, record the missing mapping and use a restrained fallback. Do not silently invent an official-looking logo and associate it with an existing achievement.

The mapping must make it straightforward to introduce future course and lab badges without rewriting the profile components.

### Rank SVG assets

Create the required original SVG insignias for the rank values that the existing platform actually supports.

Keep the SVGs in the project's established asset or component directory.

Avoid embedding large amounts of repeated SVG markup throughout profile components.

Use a centralized rank-to-asset mapping, with an explicit fallback for an unknown rank.

Do not change existing bootcamp assets.

---

## 14. Future badge-system specification document

Create a separate Markdown document defining the proposed QYVORA badge system.

Suggested location: follow the repository's existing documentation conventions. If there is no appropriate location, use:

`docs/profile/badge-system.md`

This document must describe the future badge system for:

1. Course badges.
2. Lab badges.
3. Rank insignias.

**Bootcamp badges are explicitly excluded from this specification.**

Do not redesign or redefine them.

The document should cover the following.

### A. Course badge specification

Define the visual and technical requirements for course completion badges.

Include:

* Purpose.
* Asset format and transparent-background requirements.
* Recommended dimensions and aspect-ratio handling.
* Naming conventions.
* Stable achievement identifiers.
* Metadata requirements.
* Completion and awarding rules.
* Profile display behavior.
* Accessibility requirements.
* Asset validation requirements.
* How future course badges are added.

Course badges should use the corresponding course logo as their primary artwork.

Do not require every badge to use the same shape or background when that would undermine the original transparent logo artwork.

### B. Lab badge specification

Define the corresponding requirements for lab achievements.

Include:

* Stable lab achievement identifiers.
* Mapping to the existing lab definitions.
* Completion verification.
* Idempotent awarding.
* Logo asset requirements.
* Metadata and accessibility.
* Profile display behavior.
* How future lab badges are registered.

Lab badges should use their corresponding lab logos where available.

### C. Rank insignia specification

Define the visual system for rank insignias.

Include:

* The relationship between the authoritative rank system and its insignia.
* SVG asset requirements.
* Consistent sizing and rendering.
* Visual distinction between ranks.
* Accessibility and contrast.
* Centralized mapping.
* Fallback behavior.
* A process for introducing new ranks without changing existing progression rules.

### D. Shared technical requirements

Document:

* Achievement identifiers and metadata.
* Asset organization.
* Backend ownership of award decisions.
* Duplicate-prevention rules.
* Public versus private visibility.
* Compatibility with existing achievements.
* How tests should verify awarding and display.
* How developers can introduce a new achievement safely.

The document should be a practical engineering specification, not merely a design mood board.

Do not turn this task into a complete visual redesign of every badge in the platform. Implement the course and lab logo presentation and the necessary rank insignias, then document the future system for broader development.

---

## 15. Performance and maintainability

The profile should remain fast even for users with many achievements.

Requirements:

* Avoid unnecessary profile data requests.
* Avoid loading unrelated course content just to render badges.
* Use the application's existing caching and query patterns where appropriate.
* Lazy-load off-screen achievement images when beneficial.
* Reserve appropriate image dimensions to avoid layout shifts.
* Avoid generating expensive derived data repeatedly.
* Keep public profile responses limited to necessary public fields.
* Avoid fetching private account details for anonymous visitors.
* Avoid N+1 database queries when retrieving achievements.
* Preserve existing performance optimizations and error handling.
* Use stable identifiers and React keys.
* Avoid unnecessary dependencies.

Do not introduce a new state-management library, API client, database collection, or routing system unless the repository audit demonstrates a genuine need.

---

## 16. Testing requirements

Add or update tests for the redesigned profile system.

Use the existing test framework and conventions.

### Frontend tests

Verify:

* Public profile renders correctly.
* Private profile renders correctly for an authenticated user.
* Editing controls are absent from public profiles.
* Only the intended public information is displayed.
* Course badges render from the correct asset mappings.
* Lab badges render from the correct asset mappings.
* Badge details are accessible.
* CP and rank display the authoritative values.
* Unknown rank values do not break rendering.
* Empty achievements are handled cleanly.
* Social links respect visibility settings.
* Portfolio URLs are validated.
* Loading and error states are usable.
* Responsive behavior does not introduce overflow.

### Backend and integration tests

Verify, as applicable:

* Users cannot edit other users' profiles.
* Private information is not exposed through public endpoints.
* Course completion awards the appropriate badge.
* Lab completion awards the appropriate badge.
* Repeated completion events do not create duplicate achievements.
* Unverified client requests cannot award badges.
* Social accounts cannot be linked to conflicting accounts.
* OAuth state and callback validation are enforced.
* OAuth tokens are not exposed in public responses.
* Disconnect operations are appropriately authorized.
* Existing authentication and bootcamp behavior remain intact.

Mock external OAuth providers for automated tests. Do not require real provider credentials in the standard test suite.

Where browser testing is available, inspect the actual public and private profile pages at mobile and desktop viewport sizes.

Do not claim tests passed unless they were actually run.

---

## 17. Implementation sequence

Execute the work in the following order.

### Phase 1: Repository audit

Inspect:

* Current landing page and public-page design patterns.
* Existing public and private profile routes.
* Authentication and authorization.
* Existing profile API and data models.
* Course and lab definitions.
* Completion records and achievement awarding.
* Bootcamp logos and achievement logic.
* CP balance and rank calculation.
* Existing profile images and transparent PNG logos.
* GitHub OAuth implementation.
* Any existing X or LinkedIn integration.
* Current responsive behavior and shared UI components.

Identify the files that need to change and the functionality that must remain intact.

### Phase 2: Design and architecture

Establish:

* Public profile layout.
* Private profile layout.
* Shared component boundaries.
* Achievement rendering and asset mapping.
* CP and rank presentation.
* Social account connection states.
* Public visibility rules.
* Responsive layout behavior.

Follow the established QYVORA UI rather than inventing a disconnected visual language.

### Phase 3: Core profile implementation

Implement the new public and private profile pages.

Build the shared identity header, badge collection, CP summary, rank insignia, and social links.

Integrate existing data sources.

Remove or replace the old profile-specific UI where appropriate, without deleting unrelated account capabilities.

### Phase 4: Achievement integration

Implement or connect the course and lab badge-awarding flows.

Verify server-side completion checks, persistent storage, duplicate prevention, and profile rendering.

Preserve bootcamp behavior.

### Phase 5: Social connections

Integrate GitHub using the existing OAuth implementation where appropriate.

Implement X and LinkedIn linking where the necessary provider configuration and permissions are available.

Implement portfolio editing and public visibility controls.

Document any missing external configuration precisely.

Do not add Google OAuth.

### Phase 6: Rank insignias and documentation

Create the required SVG rank insignias.

Add the centralized mapping.

Write the future badge-system specification covering courses, labs, and ranks only.

### Phase 7: Verification and cleanup

Run the relevant frontend and backend tests.

Run the project's available lint, type-check, build, and integration-test commands.

Inspect responsive behavior.

Review access controls and public API responses.

Fix regressions introduced by the redesign.

Remove obsolete profile-only code when it is safe to do so.

Check that the old routes, authentication, existing user data, bootcamp functionality, and certificate-related integrations still work.

### Phase 8: Final report

Provide a concise implementation report containing:

* Pages redesigned.
* Shared components created or refactored.
* Achievement behavior implemented or reused.
* Rank SVG assets created.
* Social providers integrated.
* External OAuth configuration still required.
* Backend or data-model changes made.
* Documentation created.
* Tests and build checks actually executed.
* Known limitations or outstanding issues.

Distinguish fully implemented features from features that still require external credentials or configuration.

---

## 18. Explicit exclusions

Do not expand this project into unrelated platform development.

Do not:

* Redesign the entire QYVORA website.
* Redesign the landing page.
* Rebuild the course or lab learning interfaces.
* Change bootcamp logos or bootcamp completion behavior.
* Redesign the certificate system.
* Introduce Google as a public social account.
* Create a new CP economy or change CP awarding rules.
* Invent a new ranking algorithm.
* Introduce fake achievements or sample statistics into production.
* Add a social feed, posts, followers, messaging, or unnecessary community features.
* Add decorative cards around every achievement logo.
* Add a card around the CP coin merely to make the layout symmetrical.
* Replace existing assets without a verified reason.
* Break current routes or existing integrations.

Keep the implementation focused on the profile experience and the functionality directly required to support it.

---

## 19. Definition of done

The redesign is complete only when all applicable requirements below are satisfied.

* [ ] Public and private profiles have been redesigned.
* [ ] The visual design matches the current QYVORA landing page and public pages.
* [ ] The profile is clean, distinctive, and not overloaded with information.
* [ ] The interface works on mobile, tablet, and desktop.
* [ ] Course logos appear directly as earned badges without unnecessary cards.
* [ ] Lab logos appear directly as earned badges without unnecessary cards.
* [ ] Badge visibility reflects actual completion records.
* [ ] Course and lab achievements are awarded securely and without duplicates.
* [ ] Existing bootcamp logos and behavior remain untouched.
* [ ] CP is displayed using the existing authoritative balance and coin asset.
* [ ] Rank is displayed using the existing authoritative progression data.
* [ ] Original SVG insignias exist for the supported ranks.
* [ ] GitHub account linking follows the existing integration and security requirements.
* [ ] X and LinkedIn linking are implemented where configuration permits, with missing dependencies documented.
* [ ] Portfolio URLs can be added and validated.
* [ ] Public social visibility is configurable and enforced by the backend.
* [ ] Private profile controls are protected by authentication and authorization.
* [ ] The future badge-system Markdown specification exists.
* [ ] The specification covers course badges, lab badges, and rank insignias, excluding bootcamp redesign.
* [ ] Existing routes, user records, authentication, and unrelated integrations remain functional.
* [ ] Relevant tests and build checks have been executed and their actual results reported.

## Final instruction

Build a profile system that feels unmistakably like QYVORA.

The user should immediately recognize the identity, rank, CP balance, and earned achievements without having to navigate a maze of cards and account settings.

Let the actual logos carry the visual weight. Keep the interface restrained, make achievement ownership trustworthy, make social account linking secure, and ensure the same coherent design works across public profiles, private profiles, desktop screens, and mobile devices.

Inspect the repository, make evidence-based implementation decisions, execute the work, test it, and report the real outcome. Do not stop at a plan, mockup, or superficial visual refresh.
