# Furlore

Static, multi-language site about the furry fandom — identity, Furscience, culture, community, dating, and a fun furry horoscope/quiz. Deployed to GitHub Pages at `https://furlore.github.io/`.

## Tech stack

- Pure HTML + CSS + vanilla JS (no frameworks, no build step).
- Mobile-first, WCAG 2.1 AA target.
- Dark/light theme with `prefers-color-scheme` + manual toggle (localStorage).
- Multilingual (en primary, uk added; de/ru reserved for later).
- Affiliate links routed via `/go/dating/` with 18+ gate, geo-filter, and sub-ID tracking. **Zero tracking** otherwise — no GA, no Plausible, no pixels.

## Before deployment

Replace these placeholders (searchable across the project):

| Placeholder | Replace with | Where |
|---|---|---|
| `{{SMARTLINK_URL}}` | Your dating smartlink URL | `/data/affiliate.json` |
| `{{EMAIL}}` | Contact email | site-wide (mailto links) |
| `{{AUTHOR_NAME}}` | Author display name | `/data/site.json`, article bylines |
| `{{AUTHOR_BIO}}` | Short author bio | `/data/site.json` |
| `{{FACT: ...}}` | Verified statistics with citations | throughout `/science/` (see note below) |

### Changing the domain

All internal links are root-relative (`/science/who-are-furries/`). To move from `furlore.github.io` to a custom domain:

1. Edit only the `SITE_URL` value in `/data/site.json` (and update canonical tags across the site — a simple global find/replace of `https://furlore.github.io` with the new origin works since no URL is hand-built in JS).
2. Add a `CNAME` file in the root containing the bare domain (GitHub Pages convention).
3. Set up DNS.

## Funnel architecture (per TZ)

- **Trust pages** (`/science/**`) — zero affiliate links, 2000+ words, primary link-acceptors.
- **Bridge pages** (`/horoscope/**`, `/culture/**`, `/community/safety`) — 1–2 contextual CTAs + end-of-article block.
- **Money pages** (`/dating/**`, `/community/find-friends/`, `/community/online/`) — 3–5 CTA points, first after intro paragraph.

Funnel: trust → culture → community → dating. There are **no direct links from `/science/**` to `/dating/**`**, by design.

## Funnel rules enforced in code

1. All affiliate links use `rel="sponsored nofollow noopener noreferrer"`, `target="_blank"`, `referrerpolicy="no-referrer"`.
2. Affiliation JS binds `data-affiliate="dating"` links to `/go/dating/` at runtime — the smartlink URL **never appears in raw HTML**.
3. `<meta name="referrer" content="no-referrer">` is in `<head>` of every page.
4. `/go/` is noindex,nofollow and disallowed in robots.txt.
5. Sub-IDs are short slugs (`sub1=page-slug, sub2=lang, sub3=placement`) — the full referrer URL is never sent.
6. No affiliate JS is loaded on trust pages (`/science/**`).

## Structure

```
/.nojekyll
/404.html
/index.html                          English homepage (mockup-matching design)
/uk/index.html                       Ukrainian homepage
/robots.txt
/sitemap.xml
/data/site.json                      SITE_URL, nav, socials, author, email
/data/affiliate.json                 Smartlink URL (only place it appears)
/data/signs.json                     Zodiac → fursona archetype data
/assets/css/tokens.css               Design tokens (colors, spacing, radii, fonts)
/assets/css/main.css                 Full stylesheet (mobile-first, dark-first)
/assets/js/theme.js                  Dark/light toggle + language switcher
/assets/js/affiliate.js              Affiliate link wiring + /go/ redirect logic
/assets/js/quiz.js                   Fursona quiz (client-side only)
/assets/js/compatibility.js          Compatibility calculator
/i18n/en.json, /i18n/uk.json         UI strings
/horoscope/, /science/, /culture/,
/community/, /dating/, /events/, /blog/
/go/dating/index.html                Age gate + geo filter + sub-ID redirect
```

## Local preview

```bash
cd project
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Deployment (GitHub Pages)

1. Push the `project/` directory contents (not the directory itself) to the `main` branch of repository `furlore/furlore.github.io`.
2. In repository Settings → Pages, set source to `main` branch, root folder.
3. Enable "Enforce HTTPS".
4. `.nojekyll` is already present.

## Content backlog

Pages marked with `{{FACT:...}}` placeholders need verified statistics with primary sources (IARP/Furscience papers, DOIs) before they are considered done.

Remaining pages to build out (see TZ §13 for full roadmap):
- `/dating/safety/`, `/dating/how-to-start/`, `/dating/apps-compare/`, `/dating/profile-tips/`, `/dating/first-date/`, `/dating/long-distance/`, `/dating/faq/`
- `/horoscope/daily/`, `/horoscope/weekly/`, `/horoscope/{sign}/` × 12
- `/horoscope/compatibility/{a}-{b}/` × top 20–30 pairs (alpha order only)
- Remaining `/science/` depth pages (psychology, demographics, community-health, lgbt-in-fandom, sources, for-parents, for-media)
- `/culture/fursona/species/`, `/culture/fursona/name/`, `/culture/fursuit/makers/`, `/culture/ukraine/`
- `/search/`, `/rss.xml`, proper OG images in `/assets/img/og/`

## License

Site code and design: © Furlore. All rights reserved. Third-party trademarks belong to their respective owners.
