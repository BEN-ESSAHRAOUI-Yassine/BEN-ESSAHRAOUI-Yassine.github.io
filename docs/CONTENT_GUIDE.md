# Content Guide — `data/content.json`

Edit **only** `data/content.json` to update the site. No HTML/JS editing needed.

The site is a single page with three domain worlds:

| key | world | section |
| --- | --- | --- |
| `spec` | Software development | `#spec` |
| `field` | Civil engineering & telecom / fiber | `#field` |
| `flow` | IT systems & automation | `#flow` |

> Older docs used the keys `dev` / `telecom` / `it`. They are now `spec` / `field` / `flow` everywhere.

## Translation rule

Any visible string is either:

- a **plain string** — shown as-is in both languages (use for names, acronyms, URLs, years: `Laravel`, `FTTH`, `2022 – 2024`), or
- a **bilingual object** — `{ "fr": "…", "en": "…" }`.

The renderer resolves objects through `t()` in `js/modules/i18n.js`. For every new visible string, add both languages or you will get an English fallback in French mode (or vice-versa).

## Structure

- `meta` — `name`, `email`, `phone`, `location` (`{fr,en}`), `links` (`linkedin`, `github`).
- `domains` — one object per `spec` / `field` / `flow`:
  - `index` (`01`, `02`, `03`), `label`, `markerSub` — hero marker + section chip
  - `kicker` (mono eyebrow), `heading`, `intro`
  - `steps` — 4 entries `{ n, label:{fr,en}, desc:{fr,en} }`
  - `panelCaption` (caption under the section diagram), `stack` (tech line), `link` ("See … projects")
- `profiles` — one object per domain: `title`, `tagline` (`{fr,en}`) — used by the three role cards in **About**.
- `about` — `spec` / `field` / `flow`: role bio (`{fr,en}`).
  - `about.stats` still exists in the file but is **not rendered** by the redesigned site (numbers are not shown anywhere).
- `skills` — `spec` / `field` / `flow`: array of `{ group:{fr,en}, items:[…] }`.
  Items are strings or `{fr,en}` objects when the term differs between languages
  (`"Piquetage"` → `{"fr":"Piquetage","en":"Staking out"}`).
- `experience` — array newest → oldest:
  ```json
  {
    "title": { "fr": "…", "en": "…" },
    "company": "OPTICAL TELECOM",
    "date": { "fr": "Mai 2019 – Juin 2019", "en": "May 2019 – Jun 2019" },
    "domains": ["spec", "field"],
    "bullets": {
      "field": [ { "fr": "…", "en": "…" } ],
      "spec":  [ { "fr": "…", "en": "…" } ]
    }
  }
  ```
  `domains` decides which bullets are shown and which domain chips appear on the timeline entry.
- `education` — array: `{ diploma:{fr,en}, school, year }`.
- `certifications` — `{ provider, items:[…] }` (certificate titles stay in their original language).
- `projects` — array:
  ```json
  {
    "title": "FiberFlow",
    "desc": { "fr": "…", "en": "…" },
    "tags": ["Laravel 13", "PostGIS"],
    "domains": ["spec"],
    "links": { "github": "…", "demo": null },
    "image": "assets/img/projects/fiberflow.svg",
    "featured": true,
    "legacy": false
  }
  ```
  - `featured: true` → the large case-study card (one per filter result).
  - `legacy: true` → adds the "Early work" badge.
  - `links.demo` omitted/`null` → Demo link hidden; `github: "#"` hides the GitHub link.
  - The **Projects** section filter (All / SPEC / FIELD / FLOW) reads `domains`.
- `cv` — `{ spec, field, flow, automation }` → PDF paths in `assets/cv/`.
- `faq` — array: `{ domain: null | "spec" | "field" | "flow", q:{fr,en}, a:{fr,en} }`.
  `domain: null` shows the question without a domain tag (general questions first).
- `i18n` — every UI string by key:
  `nav.*`, `hero.*`, `sections.*` (`work`, `competences`, `about`, `faq`, `contact`),
  `work.*`, `skills.*`, `contact.*`, `footer.*`, `diagram.*`, `a11y.*`.
  The SVG diagrams in `index.html` reference `diagram.*` through `data-i18n` attributes —
  if you change a label in a diagram, update `i18n.diagram` too.

## How to add a project

1. Add `assets/img/projects/myproj.svg` (400×200 placeholder or real screenshot).
2. Append an entry to `projects` with `desc` in both languages and the right `domains`.
3. Set `featured` only on the project that should lead the section.

## How to change CVs

Replace the files in `assets/cv/` keeping the same names, or update the `cv` paths.

## Language toggle

`js/modules/i18n.js` resolves `?lang=` (URL) → `localStorage.lang` → browser language → `fr`.
Static markup uses `data-i18n="key"` / `data-i18n-attr="aria-label:key"`; dynamic markup uses `t(value, lang)`.

## Validation

Check `data/content.json` is valid JSON (no trailing commas) after editing:

```bash
node -e "JSON.parse(require('fs').readFileSync('data/content.json','utf8')); console.log('OK')"
```

The site fetches it at load — a broken file renders an empty page.
