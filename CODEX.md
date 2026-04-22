# CODEX – Mike Brouse Reverse Mortgage Codebase

## Project Overview
A full-stack reverse mortgage landing page with a lead-capture wizard form, MongoDB persistence, and an admin CRM panel. Built with vanilla HTML/CSS/JS on the frontend and Node.js + Express + Mongoose on the backend.

---

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | HTML5, Vanilla CSS, Vanilla JS (no framework) |
| Backend | Node.js, Express 4 |
| Database | MongoDB Atlas via Mongoose |
| Deployment | Vercel (serverless, `@vercel/node`) |
| Fonts | Google Fonts – Inter + Merriweather |

---

## File Structure
```
reverse-loan/
├── index.html        # Main landing page (all sections)
├── admin.html        # Admin CRM panel (self-contained, no external deps)
├── style.css         # All styles for index.html (design system + components)
├── script.js         # All frontend JS for index.html
├── server.js         # Express backend (API + static file serving)
├── package.json      # Node dependencies
├── vercel.json       # Vercel deployment config (routing + bundling)
├── .env              # Secrets (MONGO_URI, ADMIN_PASSWORD) — never committed
├── .gitignore        # Ignores node_modules and .env
├── hero_couple.png   # Hero section background image
├── img.jpeg          # Mike Brouse headshot (about section)
└── CODEX.md          # This file
```

---

## Frontend – `index.html`

### Sections (top to bottom)
1. **Navbar** — fixed, scrolls to sections, phone CTA, mobile hamburger
2. **Hero** — full-viewport background image with overlay, headline, dual CTAs
3. **Trust Bar** — animated counters: 15,000+ families, 25+ years, 98% satisfaction
4. **About** — Mike's profile card with headshot (`img.jpeg`), contact info
5. **Why Reverse** — 3 benefit cards with SVG icons and hover effects
6. **Calculator** — 3-field form (home value, age, mortgage balance); clicking opens wizard modal instead of calculating
7. **Testimonials** — auto-rotating card carousel (6 reviews, no images)
8. **Wizard Modal** — 7-step lead capture form (overlay)

### Key IDs
| ID | Element |
|---|---|
| `navbar` | Fixed navigation header |
| `heroEstimateBtn` | Hero "Get Your Free Estimate" CTA → opens wizard |
| `heroCallBtn` | Hero phone CTA |
| `carouselTrack` | Testimonial carousel sliding wrapper |
| `carouselDots` | Dynamically generated dot indicators |
| `carouselProgressBar` | Auto-advance progress bar |
| `carouselPrev` / `carouselNext` | Arrow buttons |
| `wizBackdrop` | Wizard modal overlay |
| `wizProgressBar` | Wizard step progress bar |
| `homeValSlider` | Step 4 home value range slider |
| `mortgageInputRow` | Step 5 conditional mortgage balance input |
| `wizSubmit` | Step 7 submit → POSTs to `/api/leads` |

---

## Frontend – `style.css`

### Design Tokens (CSS variables on `:root`)
```css
--navy:       #0f2447   /* primary dark blue */
--navy-mid:   #1a3a6e
--navy-light: #1e4d8c
--gold:       #c9943a   /* accent gold */
--gold-light: #e8b457
--cream:      #faf8f4   /* light background */
--muted:      #667085   /* secondary text */
--border:     rgba(0,0,0,.09)
--white:      #ffffff
--radius-sm/md/lg       /* 8px / 14px / 22px */
--shadow-sm/md/lg
--transition: 0.28s cubic-bezier(0.4, 0, 0.2, 1)
```

### Major CSS Sections (in order)
1. Reset & base
2. Design tokens
3. Utilities (`.container`, `.section`, `.btn` variants)
4. Section labels & titles (`.section-label`, `.section-title`)
5. Navbar
6. Hero
7. Trust Bar
8. About Section
9. Why/Benefits Section
10. Calculator Section
11. Testimonial Carousel (`.carousel-wrapper`, `.tc-card`, `.carousel-dot`)
12. Animations (`@keyframes fadeInUp`, `scrollPulse`, `observe-animate`)
13. Responsive breakpoints (1024px, 768px, 480px)
14. **Wizard Modal** (`.wiz-backdrop`, `.wiz-modal`, `.wiz-step`, `.wiz-opt`, `.wiz-slider`, `.wiz-continue`)

---

## Frontend – `script.js`

### Modules (IIFEs / functions in order)
1. **`initCarousel()`** — auto-rotating testimonial carousel
   - `getVisible()` — returns 1/2/3 cards based on viewport width
   - `buildDots()` — generates dot nav buttons
   - `goTo(index)` — slides track via `translateX`
   - RAF-driven progress bar, auto-advances every **2500ms**
   - Pause on hover/focus, touch/swipe support, keyboard (←→)

2. **Navbar scroll** — adds `.scrolled` class at 40px scroll

3. **Mobile menu** — toggles `.open` on `#navLinks`

4. **Smooth scroll** — overrides `<a href="#...">` for fixed navbar offset

5. **Scroll-in animations** — `IntersectionObserver` adds `.in-view` to `.observe-animate` elements

6. **Counter animation** — `animateCounter()` runs on trust bar enter

7. **Age spinner** — `spinAge(delta)` increments/decrements the age input

8. **Calculator formatting** — formats currency inputs on blur/focus

9. **`initWizard()`** — 7-step lead wizard
    - Opens on any CTA click (`heroEstimateBtn`, `heroCallBtn`, `aboutEstimateBtn`, `calcSubmitBtn`)
    - Also intercepts `a.btn[href="#calculator"]` and `a.btn[href="#about"]`
    - Step 1–3: click an option → auto-advances after 220ms
    - Step 4: range slider with live `$` display
    - Step 5: Yes shows mortgage balance input; No auto-advances
    - Step 6: Continue unlocks only when ZIP has 4–10 digits
    - Step 7: validates name + email, then `POST /api/leads`
    - Success screen shown after submit

---

## Backend – `server.js`

### Architecture
- Lazy MongoDB connection via `connectDB()` — connects once, reuses on subsequent requests (critical for Vercel cold starts)
- Connection runs as Express middleware before every request
- Exports `app` (no `listen`) in production; calls `listen` only in local dev

### Mongoose Schema – `Lead`
```js
{
  goal:            String,   // 'cash' | 'payment' | 'income' | 'explore'
  propertyType:    String,   // 'single' | 'condo' | 'coop' | 'townhome' | 'multi' | 'mobile'
  timeline:        String,   // 'asap' | '3mo' | '6mo' | 'research'
  homeValue:       Number,
  hasMortgage:     String,   // 'yes_mort' | 'no_mort'
  mortgageBalance: Number,
  zipCode:         String,
  name:            String,   // required
  email:           String,   // required
  phone:           String,
  createdAt:       Date,     // auto
  status:          String,   // 'new' | 'contacted' | 'qualified' | 'closed'  (default: 'new')
  notes:           String,
}
```

### API Endpoints
| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/leads` | None | Create lead from wizard submission |
| `GET` | `/api/leads` | ✅ | List leads — supports `?status`, `?search`, `?sort`, `?page`, `?limit` |
| `PATCH` | `/api/leads/:id` | ✅ | Update status or notes |
| `DELETE` | `/api/leads/:id` | ✅ | Delete lead |
| `GET` | `/api/stats` | ✅ | Dashboard totals (total, new, contacted, qualified, closed, recent7Days) |
| `GET` | `/` | None | Serve `index.html` |
| `GET` | `/admin` | None | Serve `admin.html` (auth handled client-side) |

### Admin Auth
Simple header check: `req.headers['x-admin-password'] === process.env.ADMIN_PASSWORD`
Password is set in `.env` as `ADMIN_PASSWORD=admin1234`.

---

## Admin Panel – `admin.html`

Fully self-contained single HTML file with inline `<style>` and `<script>`. No external dependencies except Google Fonts.

### Features
- Login screen (password check via `/api/stats` call)
- Sidebar navigation (All Leads, New, Contacted, Qualified, Closed)
- Stats cards (5 metrics from `/api/stats`)
- Leads table with inline status dropdowns, search, sort, filter, pagination (20/page)
- Lead detail drawer (slide-in panel with all fields, notes editor, email/call links)
- CSV export (downloads all leads as `.csv`)
- Toast notifications for actions

### Key JS Functions in `admin.html`
| Function | Purpose |
|---|---|
| `doLogin()` | Validates password via API, stores in `ADMIN_PW` variable |
| `loadStats()` | Fetches and renders 5 stat cards |
| `loadData()` | Fetches paginated/filtered leads, renders table |
| `renderTable(leads)` | Builds HTML table rows |
| `updateStatus(id, status)` | PATCH request for status change |
| `deleteLead(id, name)` | DELETE request with confirm dialog |
| `openDrawer(id)` | Fetches lead and renders detail slide-in panel |
| `saveNotes(id)` | PATCH request for notes |
| `exportCSV()` | Fetches all leads and triggers `.csv` download |

---

## Deployment – `vercel.json`

```json
{
  "builds": [{ "src": "server.js", "use": "@vercel/node",
    "config": { "includeFiles": ["index.html","admin.html","style.css","script.js","*.png","*.jpg","*.jpeg"] }
  }],
  "routes": [
    { "handle": "filesystem" },        // serve static files first (CSS, JS, images)
    { "src": "/api/(.*)", "dest": "server.js" },
    { "src": "/admin",   "dest": "server.js" },
    { "src": "/(.*)",    "dest": "server.js" }
  ]
}
```

`"handle": "filesystem"` — Vercel checks if the requested file exists on disk before routing to Express. This ensures `style.css`, `script.js`, and images are served from Vercel's CDN.

---

## Environment Variables

| Variable | Value | Used In |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas connection string | `server.js` |
| `ADMIN_PASSWORD` | Plain text password for admin panel | `server.js` |
| `NODE_ENV` | `production` on Vercel, undefined locally | `server.js` — controls `app.listen` |

---

## Known Patterns & Gotchas

- **Calculator opens the wizard** — the calculator fields are a lead-capture entry point; the removed estimate animation/result path is no longer part of the app.
- **Carousel card width** — calculated as `cards[0].offsetWidth + 24` (gap). Must be recalculated on resize.
- **Wizard state** — all wizard data lives in DOM (selected `.wiz-opt` classes and input values). There is no JS state object.
- **Admin auth is client-side only** — the password gate on `admin.html` is just UX. Real security is the `x-admin-password` header check on every API call.
- **MongoDB lazy connect** — `isConnected` boolean prevents reconnecting on every request in serverless cold starts.
- **Phone number** — `(707) 888-8230` / `tel:7078888230` throughout HTML.

---

## Color Reference
| Name | Hex | Usage |
|---|---|---|
| Navy | `#0f2447` | Primary backgrounds, headings, buttons |
| Gold | `#c9943a` | Accents, CTAs, highlights |
| Gold Light | `#e8b457` | Hover states, hero badge |
| Cream | `#faf8f4` | Section backgrounds, card fills |
| Muted | `#667085` | Body text, subtitles |
