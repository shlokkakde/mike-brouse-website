# SEO Audit Report

**Project:** Reverse mortgage landing page for Mike Brouse  
**Scope:** Local repository audit of the public landing page, admin surface, crawl directives, schema, and AI-search readiness

## Overall Score

**84 / 100 — Good**

The site is in strong shape on the core SEO fundamentals: it has a clear canonical URL, valid JSON-LD, a single H1, robots and sitemap files, admin noindex protection, and a reasonably focused title/meta pair. The main issues are now more about GEO hygiene and repository cleanliness than basic discoverability.

## What Is Working Well

- The landing page has one clear primary H1 and a focused title/meta description.
- `robots.txt` and `sitemap.xml` are present and publicly reachable.
- The admin surface is protected with `noindex, nofollow` at both the HTML and header level.
- FAQ schema matches the visible FAQ content.
- JSON-LD parses successfully.
- The hero image was converted from PNG to JPG, reducing weight.
- The page includes `llms.txt` and `llms-full.txt`, which is good GEO/AEO groundwork.

## Findings

### 1) High: AI guidance files reference removed page sections

**Evidence**

- `llms.txt` still lists `/#reverse-mortgage-definition` and `/#sources`.
- Those anchors do not exist in `index.html` anymore.

**Why it matters**

This creates a mismatch between the machine-readable guidance files and the actual page. AI crawlers and answer engines rely on consistency; stale anchors reduce trust and can make the site harder to summarize correctly.

**Fix**

- Update `llms.txt` so it only references anchors that actually exist.
- Remove the stale `/#reverse-mortgage-definition` and `/#sources` entries, or reintroduce a lightweight visible section if you want those references to stay.
- Keep `llms-full.txt` aligned with the current page structure at the same time.

**Confidence:** High

### 2) Medium: `sameAs` schema links are not clearly verified

**Evidence**

- The `FinancialService` and `Person` JSON-LD blocks include `sameAs` links to `rate.com`, `norcalreverse.com`, and NMLS-related pages.

**Why it matters**

`sameAs` is strongest when it points to clearly owned, stable, and consistent profiles. If any of these URLs are not actually controlled by the business or are not the canonical identity pages, they can weaken entity clarity instead of improving it.

**Fix**

- Keep only verified, owned profiles in `sameAs`.
- Add official profiles only if they are real public identity pages for Mike Brouse or the business.
- If you cannot verify ownership, remove the questionable entries rather than guessing.

**Confidence:** Medium

### 3) Low: Unused PNG asset still ships with the build

**Evidence**

- `hero_couple.png` is still present in the repo and is listed in `vercel.json` `includeFiles`.
- The live page now uses `hero_couple.jpg`.

**Why it matters**

This is not a ranking problem by itself, but it adds deployment bloat and makes the repo noisier than it needs to be. For a lean site, unused assets should not ship.

**Fix**

- Delete `hero_couple.png` if nothing references it.
- Remove the broad `*.png` include if you no longer need other PNG assets in deployment.

**Confidence:** High

### 4) Info: Internal linking is flat by design for a one-page site

**Evidence**

- The homepage contains 9 internal links total.
- All internal links are anchor jumps within the same page: `/`, `#about`, `#why`, `#calculator`, `#how-it-works`, `#faq`, and `#testimonial`.
- There are no crawlable internal subpages in the current build.

**Why it matters**

This is not a problem for a one-page brochure site, but it means the site does not distribute internal link equity across multiple indexed pages. If the site later expands into articles or service pages, the current architecture will need more internal linking depth.

**Fix**

- Keep the current anchor navigation for the one-page layout.
- If you add new indexed pages later, link to them from the nav, hero, and supporting sections.

**Confidence:** Confirmed

### 5) Hypothesis: Backlink profile is not verifiable from public crawl signals alone

**Evidence**

- The live site returned `403` to the link-profile crawler.
- CommonCrawl index queries for `mikebrouse.com` timed out.
- Quick search-engine checks did not surface a clean parseable referring-domain result set in this environment.

**Why it matters**

Without Google Search Console or another backlink source, the real referring-domain profile cannot be confirmed. That means we cannot reliably judge backlink strength, anchor mix, or toxic-link risk from public crawl data here.

**Fix**

- Connect Google Search Console and export the Links report.
- Review top linking sites, top linked pages, and anchor text.
- If you want off-site authority, earn a small set of real citations from owned profiles, partners, and relevant local or finance directories.

**Confidence:** Hypothesis

## Secondary Notes

- Title length is good.
- Meta description length is good.
- There is only one H1.
- Image alt coverage is present for the visible image.
- The homepage has 0 outbound external links, which keeps the page clean but gives it no citation/outbound context.
- The main performance issue left is mostly repository/deployment cleanliness, not a broken SEO surface.

## Summary

The site is SEO-ready at a basic and mid-level standard. The biggest remaining issue is GEO consistency: the machine-readable guidance files point at anchors that were removed from the page. Fixing that, tightening `sameAs`, and trimming unused assets would make the site cleaner and more trustworthy without changing the design direction.
