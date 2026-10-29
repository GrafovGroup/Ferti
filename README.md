# Ferti.ca

Canadian fertility information and provider discovery, implemented from the “Ferti.ca Business Concept” master prompt. English and French experiences include service hubs, directory search, provider profiles, eight city pages, learning guides, cost and coverage resources, trust pages and a four-step care finder.

## Run

Use Node 22.13+ and the checked-in npm lockfile. `npm run install:ci`, `npm run dev`, `npm run build`. The project uses React, TypeScript, Vinext and Cloudflare Workers. Sites identity and logical DB binding live in `.openai/hosting.json`.

## Content

Structured records live in `content/`: services, providers, articles, coverage and trust pages. Provider entries are public-source listings, not contracted referral partners. Dates mean source checks, not medical reviews. No fictional providers, outcome claims, pricing or testimonials are displayed. The homepage uses generated illustrative photography; it is not a patient testimonial.

## Inquiries and privacy

POST `/api/inquiries` validates payload size, origin, schema, consent, timing and honeypot. D1 holds records and atomic rate limits. There is no public lead-list endpoint. UUID request identifiers make retries idempotent. Rate keys expire after 15 minutes; expired keys and leads older than 90 days are purged on submissions. Forms do not persist answers to browser storage or send them to analytics. Users can view matching results without sending contact details.

React forms submit to the validated `/api/inquiries` route. New consented requests are saved to D1 and sent as JSON to `https://formspree.io/f/mqpaeazb` with `Accept: application/json`. Care, contact and provider messages include their category, language, reference, reply-to email, submitted fields and separate marketing consent. Formspree acceptance produces a sent confirmation; this does not verify inbox delivery or book an appointment. No clinic referral is sent. Optional marketing consent does not trigger a subscription. The server uses an atomic delivery claim and content fingerprint to prevent repeated or concurrent requests from resending confirmed submissions. Confirmed 4xx rejections can be retried; timeouts, malformed responses and 5xx failures remain unconfirmed to avoid duplicate delivery. Previously stored enquiries are not forwarded. Provider-routing contracts remain separate in `lib/lead-routing.ts`.

Use access-controlled Sites database tools for owner lead review. A public admin portal is deliberately absent. Future admin UI must use authenticated role authorization; never expose database reads to anonymous visitors.

## Operations

- The site is public. `ferti.ca` and `www.ferti.ca` are connected through WHC DNS with active HTTPS. The canonical origin is `https://ferti.ca`.
- Standard user-specified placeholder phone: (833) 696-9996. Replace with the business number when supplied.
- Formspree endpoint `mqpaeazb` is configured in `lib/formspree.ts`; no API secret or new package is required. Delivery depends on that form’s activation, notification recipients, spam settings and plan limits in Formspree. The website cannot verify final inbox placement. `.env.example` fields are reserved for future provider-routing integrations and are unused.
- Have qualified bilingual clinicians review medical content before assigning medical-review credits. All current content explicitly identifies its source-check status.
- Review changing provider and funding data regularly. The content files can later be replaced by a CMS adapter.
- For exact retention deadlines regardless of traffic, add a scheduled purge; current removal runs on subsequent submissions as described in the privacy notice.

## Database

Schema: `db/schema.ts`. Generate append-only migrations using `npm run db:generate`; Sites applies them on publication. For local QA, build and apply the new migration with Wrangler D1 execute to `.wrangler/state` using `dist/server/wrangler.json`. Never replay applied production migrations.

## Verification

TypeScript check and production build. `work/verify.mjs` (local scratch) exercises all sitemap routes, metadata, 404, validation, consent, origin rejection, honeypot, matching and idempotent submission. Browser QA covers the guided flow, directory filtering and responsive layouts. No test submissions are made to clinics.

## Location SEO and editorial imagery (2026-09-19)

- `/locations` and `/locations/[province]` provide an English/French hierarchy across all 13 provinces and territories. Server-rendered GET search supports accent-insensitive municipality lookup.
- `content/locations.json` contains the complete 5,161 census subdivisions from Statistics Canada table 98-10-0002-01 (2021). These are municipalities and equivalents, not 5,161 incorporated cities. Geographic vintage is disclosed in the UI; amalgamations and name changes after 2021 are not represented. Source: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=9810000201 . Source download: https://www150.statcan.gc.ca/n1/tbl/csv/98100002-eng.zip . Derived geography is attributed to Statistics Canada and is not endorsed by Statistics Canada.
- `/clinics/[municipality]` has location metadata, bilingual canonical/hreflang links, breadcrumb and CollectionPage data, local vs. provincial provider separation, funding resources, and regional navigation. Duplicate municipality names have province and census ID in their URLs. Existing eight city URLs are retained.
- Municipality pages without checked local provider listings use `noindex, follow` and are excluded from the sitemap. This deliberately avoids indexing thousands of thin location pages. Adding verified local provider records makes their pages eligible automatically. Never imply a local office, clinic partnership or treatment availability from a location page.
- The sitemap contains 160 indexable English/French URLs. Provider search and location query-result pages are excluded from indexing.
- Eight original AI-created fertility illustrations supplement the existing homepage photo. Each has one editorial placement, shared only by the matching French translation, with descriptive localized alt text, reserved dimensions, lazy loading and 640/1200px WebP variants. They never represent listed providers or actual patients.
- Checked: TypeScript, production build, 186 page responses (all sitemap routes plus a non-indexed location in each province in each language), canonical/hreflang metadata, JSON-LD validity, location search, invalid-route 404s and all 17 image files.
- Public access was enabled at the user's request. WHC's two authoritative servers now agree, and both custom domains are active. Canonical URLs, hreflang, structured data and the sitemap use `https://ferti.ca` through `lib/site.ts`. Google and Bing domain ownership are verified; sitemap submission and indexing are separate steps.

## Form delivery verification

Run `node --test tests/formspree.test.mjs` for confirmed acceptance, retryable rejection, uncertain delivery, concurrent submits, changed-payload/legacy protection, database failure after acceptance and payload mapping. New Formspree disclosures require consent version `2026-09-19-formspree`; old cached clients must refresh before submitting. Website retention removes D1 copies after 90 days during submission processing, but Formspree and email copies require separate retention/deletion management.
