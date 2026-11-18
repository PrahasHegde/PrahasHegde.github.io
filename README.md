# prahashegde.github.io

Personal portfolio of Prahas Hegde, AI engineer.
Built with **React 18 + TypeScript + Vite**, **Framer Motion** for animation and **d3-force** for the interactive work map.

## Editing content

All text lives in [`src/data/content.tsx`](src/data/content.tsx): profile, projects, experience, skills, about and interests.
Components in `src/components/` only handle layout and behaviour.

- **Add a project:** add an entry to `featured` (big cards) or `more` (grid). `tags` controls which filters show it.
- **Add it to the hero map:** add a leaf to `LEAVES` in `src/components/WorkGraph.tsx` with an angle between its neighbours.
- **Interest photos:** put an image in `public/interests/` (e.g. `hiking.jpg`) and set `photo: '/interests/hiking.jpg'` on that interest.
  Landscape images around 1200×900 px work best. Without a photo the card shows an illustration.
- **Travel blog link:** set `link: { label: 'Read the blog', href: 'https://…' }` on the `blog` interest.

## Features

- Interactive, draggable map of the work in the hero
- Filterable project grid with layout animations
- Command palette: `Ctrl K`, `⌘K` or `/`
- Light and dark theme (`?theme=light` / `?theme=dark` forces one)
- **Save CV as PDF:** a print stylesheet turns the page into a clean multi-page CV
- Scroll progress bar, reduced-motion support, keyboard navigation
- SEO: JSON-LD `Person` schema, Open Graph tags, `sitemap.xml`, `robots.txt`, `<noscript>` fallback

## Develop

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check and build to dist/
```

## Deploy

Every push to `main` runs `.github/workflows/pages.yml`, which builds the site and deploys `dist/` to GitHub Pages.
In the repository, **Settings → Pages → Source** must be set to **GitHub Actions**.
