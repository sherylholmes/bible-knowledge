# Bible Knowledge

A multilingual Bible reading application built for deep study and worship.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **API:** Bolls.life (Hebrew/Greek interlinear + audio)
- **Deployment:** Cloudflare Pages

## Features

- **Multilingual Scripture Reading** — Read Bible passages in Chinese, English, and Hebrew/Greek side by side
- **Original Text Comparison** — Hebrew/Greek interlinear with morphological analysis powered by Bolls.life API
- **YouTube Worship Songs** — Integrated worship song search and playback for worship preparation
- **Responsive Design** — Optimized for desktop and mobile reading

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
src/app/          Next.js App Router pages and layouts
src/components/   React components
src/lib/          Utilities and API helpers
public/           Static assets
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
```

## Deployment

This project is configured for Cloudflare Pages deployment. Push to the `main` branch to trigger automatic builds.

For manual builds:

```bash
pnpm build
```

The output is deployed directly to Cloudflare's edge network.

## License

Private.
