# Glucent

**Open-source AI carb counter for Type 1 Diabetes.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbelibathan%2Fglucent)

> Demo screenshot/gif coming soon

## Why This Exists

People with Type 1 Diabetes need to estimate carbohydrates for every meal to calculate insulin doses — often within a 15–30 second window before eating. Getting it wrong means hours of correcting blood sugar. Glucent uses Claude's vision capabilities to provide instant, structured macro estimates from a single food photo.

## Features

- **Photo-based analysis** — Snap a photo or upload an image to get instant nutritional estimates
- **Carb-first design** — Net carbs are front and center, because that's what drives insulin dosing
- **Structured macro output** — Protein, fat, calories, and fiber alongside carbs
- **Per-item breakdown** — See individual food items with portion estimates and individual macros
- **Conversational refinement** — Correct portions or ingredients and get an updated analysis
- **Confidence scoring** — Know how reliable the estimate is with High/Medium/Low confidence
- **Glycemic context** — GI/absorption notes to help with insulin timing
- **BYOK / Privacy-first** — Your API key stays in your browser. No accounts, no data stored on servers
- **PWA-ready** — Install on your home screen for a native app experience

## Quick Start

```bash
git clone https://github.com/belibathan/glucent.git
cd glucent
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and enter your [Anthropic API key](https://console.anthropic.com/settings/keys) when prompted.

### Deploy to Vercel

Click the button above, or:

```bash
pnpm i -g vercel
vercel
```

No environment variables are required — Glucent is BYOK (Bring Your Own Key). Each user enters their own Anthropic API key in the app.

## How It Works

1. You take a photo of your meal (or upload one)
2. The image is resized client-side (max 1024px) and sent as base64 to the Next.js API route
3. The API route forwards it to Claude Vision with a carefully crafted system prompt
4. Claude returns structured JSON with per-item macros, totals, confidence, and glycemic notes
5. The UI renders the results with carbs as the hero number
6. You can refine the analysis with follow-up messages (e.g., "that's actually brown rice")

## Privacy

Glucent is designed to be privacy-first:

- **No accounts, no database, no server-side storage.** All data lives in your browser session.
- **Your API key** is stored in `localStorage` and sent directly to Anthropic's API. It is never logged or stored server-side.
- **Your photos** are processed client-side and sent to Claude's API for analysis. They are not saved anywhere.
- Self-hosting is encouraged — clone the repo and run it on your own infrastructure for full control.

## Tech Stack

- **Next.js 14+** — App Router with TypeScript
- **Tailwind CSS v4** + **shadcn/ui** — Clean, accessible components
- **Anthropic SDK** — Claude Vision API for food analysis
- **pnpm** — Fast, disk-efficient package manager

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

See [SECURITY.md](SECURITY.md) for our security policy and responsible disclosure process.

## License

[MIT](LICENSE)

## Disclaimer

**Glucent is not a medical device.** It has not been evaluated or approved by the FDA, EMA, or any regulatory body.

This tool provides **estimates only** based on AI vision analysis, which can and will make mistakes. Nutritional estimates may be inaccurate due to portion size ambiguity, food identification errors, or hidden ingredients.

**Do not rely solely on Glucent for insulin dosing decisions.** Always cross-reference with nutritional labels, food scales, or established carb-counting resources. Consult your endocrinologist or diabetes care team for medical advice.

By using this software, you acknowledge that the developers assume no liability for health outcomes resulting from its use.
