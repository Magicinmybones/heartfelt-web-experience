# Heartfelt Web Experience

A responsive, five-section Valentine invitation built with React, TypeScript,
Vite, and Motion. The experience moves from the initial question through date
and food selection to a personalized confirmation.

## Highlights

- Responsive layouts for desktop, tablet, and mobile
- Accessible keyboard, focus, and reduced-motion behavior
- Section-specific watercolor backgrounds and transition celebrations
- Interactive date, time, and food selection
- Static SPA routing support for Vercel
- Cloudflare-compatible server output

## Technology

- React 19
- TypeScript
- Vite
- Motion for React
- Cloudflare Vite plugin

## Getting started

Requires Node.js 22.

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal. If port `5173` is
occupied, it selects the next available port.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run typecheck` | Validate TypeScript without emitting files |
| `npm run build` | Type-check and create the production build |
| `npm run preview` | Preview the production build locally |
| `npm run clean` | Remove generated build output |

## Project structure

```text
.
├── .github/workflows/   # Continuous integration
├── build/               # Build-time Vite integration
├── public/              # Optimized images and static assets
├── scripts/             # Build preparation utilities
├── src/
│   ├── app/             # Application flow, configuration, and shared types
│   ├── components/      # Reusable decorations and transition effects
│   ├── data/            # Shared content data
│   ├── sections/        # One component for each experience section
│   ├── styles/          # Global responsive presentation
│   └── main.tsx         # Browser entry point
├── worker/              # Cloudflare worker entry point
├── index.html
├── vercel.json
├── vite.config.ts
└── wrangler.jsonc
```

## Architecture

`src/app/App.tsx` owns navigation and the visitor's selections. Individual
sections own only their local interaction state. Shared data, presentation
configuration, decorations, and transition effects live in dedicated modules
so each section can evolve without expanding the application shell.

## Deployment

`vercel.json` builds the Vite client and preserves SPA routing on Vercel.
Additional local hosting metadata is intentionally excluded from version
control.

Run `npm run build` before publishing. Generated output is written to `dist/`
and is intentionally excluded from Git.
