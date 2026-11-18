# prahashegde.github.io

Personal portfolio of Prahas Hegde, AI engineer.
Plain HTML, CSS and [D3.js](https://d3js.org). No build step, no framework.

## Features

- Interactive map of the work in the hero (D3). Edit the `nodes`, `links` and `angle` objects near the bottom of `index.html`.
- Filterable project grid: each project's `data-tags` sets which filters it appears under (`agents`, `rag`, `eval`, `cv`).
- Command palette: press `Ctrl K`, `⌘K` or `/`.
- Light and dark theme. Add `?theme=light` or `?theme=dark` to the URL to force one.
- **Save CV as PDF:** the print stylesheet turns the page into a clean, multi-page CV.
- SEO: JSON-LD `Person` schema, Open Graph tags, `sitemap.xml`, `robots.txt`.

## Deploy (GitHub Pages, free)

1. Create a new **public** repository named exactly `PrahasHegde.github.io` (no README).
2. Push this folder: `git push -u origin main`.
3. Open **Settings → Pages** and set **Source** to **GitHub Actions**. The workflow in `.github/workflows/pages.yml` then deploys on every push.
4. The site is live at **https://prahashegde.github.io** after about a minute.

## Preview locally

```bash
python -m http.server 8000
# open http://localhost:8000
```
