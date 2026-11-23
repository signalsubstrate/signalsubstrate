# Signal & Substrate

A minimalist, text-first personal blog and interactive explainer site built with [Astro](https://astro.build/) and Astro Content Collections, using zero third-party CSS or UI frameworks.

## Local Development

```bash
npm install
npm run dev      # Start dev server at http://localhost:3000
npm run lint     # Sync content types and run astro check
npm run build    # Build static site into dist/
npm run preview  # Preview the production build locally
```

## Adding a Standard Blog Post

Create a new Markdown file in `src/content/blog/<slug>.md`. The filename (without `.md`) becomes the post URL at `/blog/<slug>`.

```markdown
---
title: "Your Post Title"
date: 2026-11-21
description: "A concise 1–2 line summary shown on the index page and in RSS."
category: "ai-safety"
interactive: false
---

Write your post body in Markdown here.
```

### Frontmatter Schema (`src/content.config.ts`)

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | `string` | Yes | Displayed on the index (`20px`) and article `<h1>` (`29px`). |
| `date` | `YYYY-MM-DD` | Yes | Posts on `/` and `/rss.xml` are sorted newest-first. |
| `description` | `string` | Yes | Used as the index summary, article lead, and RSS item description. |
| `category` | `'ai-safety' \| 'ml' \| 'data-engineering'` | Yes | Rendered as a subtle monospace metadata label. |
| `interactive` | `boolean` | No | Defaults to `false`. Set to `true` to show the `[interactive]` label. |
| `externalUrl` | `string` | No | When set, clicking the post on `/` or in RSS navigates to this URL instead of `/blog/<slug>`. |

### Semantic Callouts

You can use the utility callout classes defined in `src/styles/global.css` directly inside Markdown files:

```html
<div class="callout callout-safe">
  <span class="callout-label">INVARIANT</span>
  <p>Key takeaway or verified safeguard.</p>
</div>

<div class="callout callout-warn">
  <span class="callout-label">CAVEAT</span>
  <p>Subtle failure mode or edge case to watch for.</p>
</div>

<div class="callout callout-danger">
  <span class="callout-label">ANTI-PATTERN</span>
  <p>Critical pitfall to avoid.</p>
</div>
```

## Adding an Interactive Explainer

Interactive pieces are standalone HTML/CSS/JS pages hosted under `public/viz/<slug>/`, linked from a lightweight content entry so they appear in the chronological index and RSS feed.

1. Create the standalone page at `public/viz/my-explainer/index.html` (you do not need to write a back-to-home nav bar manually—`scripts/inject-viz-nav.mjs` runs automatically on `npm run dev` and `npm run build` to inject a consistent `← Signal & Substrate` return bar into every `.html` file under `public/viz/`).
2. Add a corresponding Markdown entry in `src/content/blog/my-explainer.md`:

```markdown
---
title: "Interactive Explainer: Title"
date: 2026-11-21
description: "One-line summary of what the interactive simulation demonstrates."
category: "ml"
interactive: true
externalUrl: "/viz/my-explainer/"
---
```

Clicking the entry on `/` navigates directly to `/viz/my-explainer/`.

### Automated Nav Bar Injection (`scripts/inject-viz-nav.mjs` & `public/nav.js`)

- **Same-repo pages (`public/viz/`)**: `scripts/inject-viz-nav.mjs` runs automatically before `dev` and `build` (or manually via `npm run inject-nav`). Idempotently injects `#ss-top-nav` right after `<body>` without touching existing layout or styles. Add `data-ss-nav="skip"` to `<body>` on any page you want the script to skip.
- **Separate-repo pages** (e.g., `https://signalsubstrate.github.io/How-Large-Language-Models-Store-and-Edit-Facts/`):
  - **Option 1 (1-line HTML tag)**: Add `<script src="https://signalsubstrate.github.io/nav.js" defer></script>` to the separate repo's `index.html`. It mounts `#ss-top-nav` before `#root` without conflicting with React/Vite.
  - **Option 2 (Zero-edit CI injection)**: Add this step right after `npm run build` in the separate repo's GitHub Actions workflow:

```bash
curl -fsSL https://signalsubstrate.github.io/inject-nav.mjs -o /tmp/inject-nav.mjs
node /tmp/inject-nav.mjs --dir ./dist --home https://signalsubstrate.github.io/
```


## GitHub Pages Deployment

1. Confirm `site` in `astro.config.mjs` matches `https://signalsubstrate.github.io`.
2. Enable **Settings → Pages → Source: GitHub Actions** in your repository. Pushing to `main` triggers `.github/workflows/deploy.yml` automatically.
