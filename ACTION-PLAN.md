# SEO Action Plan

## Priority 1

### Fix stale GEO references

**Files**
- [llms.txt](C:/Users/shlok/Desktop/projects/reverse-loan/llms.txt)
- [llms-full.txt](C:/Users/shlok/Desktop/projects/reverse-loan/llms-full.txt)

**What to do**
- Remove references to `/#reverse-mortgage-definition` and `/#sources` if those sections are intentionally gone.
- Make sure every anchor in the guidance files exists in `index.html`.
- Keep the guidance files short, literal, and aligned with the current page.

**Why this comes first**
- It is the clearest current GEO inconsistency.
- It can confuse AI crawlers even though the public page itself is otherwise healthy.

## Priority 2

### Verify or trim `sameAs`

**Files**
- [index.html](C:/Users/shlok/Desktop/projects/reverse-loan/index.html)

**What to do**
- Keep only `sameAs` URLs that are actually owned or clearly official.
- Remove any profile link that is not verified.
- Add official identity URLs only when they are genuinely stable and public.

**Why this matters**
- This improves entity confidence for search and AI systems.
- It prevents weak or mismatched identity signals.

## Priority 3

### Remove unused assets from deploy

**Files**
- [hero_couple.png](C:/Users/shlok/Desktop/projects/reverse-loan/hero_couple.png)
- [vercel.json](C:/Users/shlok/Desktop/projects/reverse-loan/vercel.json)

**What to do**
- Delete `hero_couple.png` if it is no longer referenced.
- Narrow the Vercel asset include list if PNGs are not needed.

**Why this matters**
- Keeps the repository lean.
- Avoids shipping dead files to production.

## Priority 4

### Optional polish

**Files**
- [index.html](C:/Users/shlok/Desktop/projects/reverse-loan/index.html)

**What to do**
- Add `og:site_name` and `og:image:alt`.
- Confirm the canonical domain is the real production domain.
- Keep the FAQ and schema content exactly aligned if future edits are made.

**Why this is optional**
- The page already has the core SEO foundations in place.
- These are polish items, not blockers.

## Priority 5

### Get real backlink data

**Files**
- Google Search Console for the live domain

**What to do**
- Export the Links report from Search Console.
- Review top linking sites, top linked pages, and anchor text.
- Use that data to decide whether any cleanup or outreach is actually needed.

**Why this matters**
- Public crawl signals are not enough to verify the backlink profile here.
- This is the only reliable way to move backlink analysis from hypothesis to confirmed evidence.
