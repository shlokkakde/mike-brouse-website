# SEO Action Plan

## Priority 1

### Restore public crawl access

**Files / systems**
- Live site on `www.mikebrouse.com`
- Cloudflare / WAF / edge rules

**What to do**
- Remove the rule or challenge that is returning `403` for `/`, `/sitemap.xml`, `llms.txt`, and `llms-full.txt`.
- Confirm the homepage returns `200` to a normal browser UA and to search-engine crawlers.
- Re-test with `robots_checker.py`, `social_meta.py`, and a browser fetch after the change.

**Why this is first**
- If the page cannot be fetched, the rest of the SEO work is mostly invisible to search engines.

## Priority 2

### Serve the AI guidance files publicly

**Files**
- [llms.txt](C:/Users/shlok/Desktop/projects/reverse-loan/llms.txt)
- [llms-full.txt](C:/Users/shlok/Desktop/projects/reverse-loan/llms-full.txt)
- [vercel.json](C:/Users/shlok/Desktop/projects/reverse-loan/vercel.json)

**What to do**
- Add `llms.txt` and `llms-full.txt` to the deployment bundle if needed.
- Confirm both files return `200` from the live domain.
- Keep their anchor references aligned with the visible page.

**Why this matters**
- GEO/AEO systems can’t use files that aren’t publicly reachable.

## Priority 3

### Fix live crawl directives

**Files / systems**
- Live `robots.txt`

**What to do**
- Add a `Sitemap:` directive if the live policy is meant to expose one.
- Make sure the live `robots.txt` reflects the intended crawler policy, including AI crawler behavior.
- Re-test `robots_checker.py` after the update.

**Why this matters**
- It gives search engines a clean crawl map and reduces policy ambiguity.

## Priority 4

### Pull real backlink data

**Files / systems**
- Google Search Console

**What to do**
- Export the Links report.
- Review referring domains, top linked pages, and anchor text.
- Use that data to decide whether cleanup or outreach is needed.

**Why this matters**
- Public crawl data is not enough to verify the backlink profile here.

## Priority 5

### Keep the on-page SEO intact

**Files**
- [index.html](C:/Users/shlok/Desktop/projects/reverse-loan/index.html)

**What to do**
- Preserve the current title, canonical, OG/Twitter tags, JSON-LD, FAQ structure, and single-H1 layout.
- Avoid reintroducing stale anchor refs into `llms.txt` or `llms-full.txt`.

**Why this matters**
- The repo has a strong content/metadata base; the deployment layer is the current blocker.

