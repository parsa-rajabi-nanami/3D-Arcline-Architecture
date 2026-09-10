# ARCLINE Architecture repository guide

## Project identity

This repository is a single-page React 19 landing page for an architecture and design-build studio. It uses TanStack Start/Router, Vite, TypeScript, Tailwind CSS 4, GSAP, and Nitro. The production target is a static GitHub Pages site at `/3D-Arcline-Architecture/`.

## Tooling and commands

Use npm and keep `package-lock.json` committed. Dependency changes must be reflected in the npm lockfile.

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

The build uses TanStack Start prerendering and writes the deployable site to `.output/public/`. Do not treat `.output/`, `dist/`, or other generated directories as source files.

## Source ownership

- `src/routes/__root.tsx`: document shell, global metadata, favicon, error and not-found UI.
- `src/routes/index.tsx`: root route entry point.
- `src/router.tsx`: router creation, scroll restoration, and the production base path.
- `src/features/landing/`: page composition, sections, and static content data.
- `src/components/media/`: media loading, fallbacks, and playback behavior.
- `src/components/motion/`: shared GSAP reveal behavior.
- `src/components/ui/`: small reusable UI/media components.
- `src/hooks/`: browser-only capability and preference hooks.
- `src/assets/`: imported assets that Vite hashes during build.
- `public/hero/`: responsive hero video and poster files served as public assets.
- `public/palace-movie/`: numbered frames used by the scroll-driven canvas sequence.
- `vite.config.ts`: Vite base path, TanStack prerendering, Nitro, Tailwind, and React plugins.
- `.github/workflows/deploy-pages.yml`: GitHub Pages build and deployment.

`src/routeTree.gen.ts` is generated. Never edit it manually. There are no `CLAUDE.md` or Cursor rule files in this repository; do not add overlapping agent files unless a future workflow specifically needs one.

## Implementation rules

- Use functional React components and strict TypeScript.
- Preserve the editorial architecture visual language and existing component boundaries unless a bug requires a move.
- Keep shared design tokens in `src/styles.css`; do not scatter replacement global styles through components.
- Use PascalCase for React component files, camelCase for hooks, and the existing naming convention for route/data files.
- Use meaningful alt text for informative images and empty alt text plus `aria-hidden` for decorative media.
- Keep keyboard focus states, semantic headings, skip navigation, mobile navigation semantics, and reduced-motion behavior intact.
- Do not add dependencies when the current stack or CSS can handle the change.
- For client-only browser APIs, guard execution in effects or browser-safe callbacks; do not read `window` or `document` during SSR render.
- For motion, prefer transform/opacity, avoid layout thrashing, and limit pointer motion to fine hover-capable devices.
- For media, keep intrinsic dimensions, use lazy loading where it does not harm the first viewport, and provide an error/static fallback.
- Public URLs must be built from `import.meta.env.BASE_URL`; do not introduce root-absolute asset paths that break the repository deployment.

## GitHub Pages constraints

Production Vite output uses `/3D-Arcline-Architecture/` as its base path. The router uses that base in the browser while retaining `/` for SSR prerender requests. If the repository name changes, update the Vite base, router expectation, canonical URL, Open Graph URLs, README URL, and workflow assumptions together.

The workflow builds with npm, prerenders the root page, copies `index.html` to `404.html`, and publishes `.output/public` to the `gh-pages` branch through the `gh-pages` package. A deployment change is incomplete until the generated HTML references the repository-prefixed CSS/JS and public asset URLs.

## Verification and stop condition

After UI, routing, metadata, media, or configuration changes, run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Inspect the final diff and `.output/public/index.html` for broken root-absolute assets, missing metadata, accidental generated files, or unrelated cleanup. Stop when all four checks pass and the artifact contains `index.html`, hashed assets, favicon, hero media, and the image-sequence frames.

## Security and repository hygiene

No environment variables are currently required. Keep local secrets in `.env.local` and never commit them. Do not commit `node_modules`, build output, coverage, logs, editor state, or generated type/build metadata.
