# Content Guide — `data/content.json`

Edit **only** `data/content.json` to update the site. No HTML editing needed.

## Structure

- `meta` — name, email, phone, location (`fr`/`en`), links
- `profiles` — 3 entries: `dev` (default), `telecom`, `it`. Each has `label`, `icon` (emoji), `lucide` (icon name), `title`, `heroDesc` (short pill under switcher), `tagline`, `roles` (typewriter list per `fr`/`en`)
- `about` — `dev`/`telecom`/`it` bios (FR+EN) + `stats` (array per profile: `value`, `suffix` `+` or `""`, `label` FR/EN)
- `skills` — per profile: array of `{ group: {fr,en}, items: [strings] }`
- `experience` — array ordered newest→oldest: `{ title:{fr,en}, company, date, profiles:[...], bullets:{ dev:[], telecom:[], it:[] } }`. `profiles` controls visibility.
- `education` — array: `{ diploma:{fr,en}, school, year }`
- `certifications` — `{ provider, items:[...] }`
- `projects` — array: `{ title, desc:{fr,en}, tags:[], profiles:[...], links:{github,demo}, image }`. `demo:null` hides Demo button. `image` points to `assets/img/projects/*.svg` (placeholders ok).
- `cv` — `{ dev, telecom, it }` paths to `assets/cv/*.pdf`
- `i18n` — all UI strings by key: `nav.*`, `hero.*`, `sections.*`, `contact.*`, `footer.*`

## How to add a project

1. Add file `assets/img/projects/myproj.svg` (or .jpg) or use existing placeholder.
2. Add entry to `projects` array in `content.json`.
3. Set `profiles` to control which switch shows it.

## How to change CVs

Replace files in `assets/cv/` keeping same names, or update paths in `cv` object.

## Language toggle

`i18n.js` reads `content.json:i18n` + per-profile strings. Add `fr`/`en` for every new string you introduce.

## Validation

Check `data/content.json` is valid JSON (no trailing commas) after editing. Site will fetch it at load.
