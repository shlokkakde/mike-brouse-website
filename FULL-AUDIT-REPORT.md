# SEO Audit Report

**Project:** Reverse mortgage landing page for Mike Brouse  
**Scope:** Live-domain SEO audit of `https://www.mikebrouse.com/` with local repo inspection where live fetches were blocked

## Overall Score

**25 / 100 — Critical**

Score confidence: **Medium**

The local repository has strong on-page SEO foundations, but the live site is currently the bottleneck. Generic browser fetches return `403` for the homepage and for key crawl files, which means search engines and AI systems may not be able to access the content that the repo is preparing.

## Audit Summary

### Top 3 Issues

- The live homepage returns `403` to generic browser clients.
- `llms.txt`, `llms-full.txt`, and `sitemap.xml` are not publicly fetchable in the live environment.
- The live `robots.txt` is a Cloudflare-managed content-signals file and does not include a `Sitemap:` directive.

### Top 3 Opportunities

- Restore public `200` access to the homepage and crawl files.
- Deploy the llms guidance files so AI systems can actually read them.
- Pull backlink data from Google Search Console once crawl access is stable.

## Findings

| Area | Severity | Confidence | Finding | Evidence | Fix |
|---|---|---:|---|---|---|
| Technical SEO / Indexability | Critical | Confirmed | The live homepage is returning `403` to generic browser fetches, so the public page is not reliably accessible for crawl/render. | `Invoke-WebRequest` with a normal Chrome UA returned `403` for `https://www.mikebrouse.com/`; `web.open` on the root also failed. Googlebot/Bingbot-style requests were aborted by the connection. | Remove or relax the Cloudflare/WAF rule or challenge that is blocking the homepage, and confirm `/` returns `200` for standard browsers and search-engine crawlers. |
| AI Search Readiness / GEO | Warning | Confirmed | `llms.txt` and `llms-full.txt` are not publicly reachable in the live environment. | `llms_txt_checker.py` reported `exists: false`, `full_exists: false`, with `status: 403` and `full_status: 403`; direct requests to both files also returned `403`. | Serve both files as public static assets and confirm they return `200` from the live domain. |
| Crawl Signals | Warning | Confirmed | The live `robots.txt` is Cloudflare-managed content-signal output and does not advertise a sitemap. | `robots_checker.py` returned a live robots file with `search=yes, ai-train=no` and flagged no `Sitemap` directive. | Add an explicit `Sitemap:` line and make sure the live robots policy matches the intended crawl and AI policy. |
| On-Page SEO | Pass | Confirmed | The local repo has a strong metadata and heading setup. | `index.html` contains a focused title, meta description, canonical URL, Open Graph tags, Twitter tags, valid JSON-LD, and a single H1. | Keep this structure stable once deployment access is fixed. |
| Internal Linking | Info | Confirmed | The homepage’s internal linking is intentionally flat and anchor-based. | Local parse found `9` internal links and `0` external links; all navigation is same-page anchors (`#about`, `#why`, `#calculator`, `#how-it-works`, `#faq`, `#testimonial`). | Fine for a one-page brochure site; add deeper internal links only if the site expands into indexed subpages. |
| Backlink Profile | Info | Hypothesis | Public backlink data is not verifiable from this environment. | CommonCrawl queries timed out; the live site also blocked crawler-style fetches; Search Console data is not available in the workspace. | Use Google Search Console’s Links report to confirm referring domains, anchor text, and any cleanup needs. |

## Prioritized Action Plan

1. Fix the live access block first. Make sure the homepage and crawl files return `200` instead of `403`.
2. Deploy `llms.txt` and `llms-full.txt` publicly and confirm they are reachable from the live domain.
3. Update the live `robots.txt` policy to include the sitemap and align AI crawler instructions with the intended policy.
4. Once access is stable, export backlink data from Google Search Console and review referring domains / anchor text.
5. Keep the current on-page SEO structure intact while you fix the deployment layer.

## Unknowns and Follow-ups

- Whether the `403` is caused by a Cloudflare/WAF rule, a deployment misconfiguration, or IP-based blocking.
- Whether Googlebot and Bingbot are actually allowed in production despite the generic fetch failures.
- The true external backlink profile, because it cannot be confirmed without Search Console or a reliable backlink source.

## Secondary Notes

- The local repo’s title, meta description, canonical, OG/Twitter metadata, JSON-LD, and FAQ structure are all in good shape.
- The repo currently has no outbound external citation links on the homepage.
- The deployment bundle in `vercel.json` includes `robots.txt` and `sitemap.xml`, but not `llms.txt` or `llms-full.txt`.

