# Glucent

**Open-source AI carb counter for Type 1 Diabetes.**

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

## How It Works

1. You take a photo of your meal (or upload one)
2. The image is resized client-side (max 1024px) and sent as base64 to the Next.js API route
3. The API route forwards it to Claude Vision with a carefully crafted system prompt
4. Claude returns structured JSON with per-item macros, totals, confidence, and glycemic notes
5. The UI renders the results with carbs as the hero number
6. You can refine the analysis with follow-up messages (e.g., "that's actually brown rice")

## Tech Stack

- **Next.js 14+** — App Router with TypeScript
- **Tailwind CSS v4** + **shadcn/ui** — Clean, accessible components
- **Anthropic SDK** — Claude Vision API for food analysis
- **pnpm** — Fast, disk-efficient package manager

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

[MIT](LICENSE)

## Disclaimer

This tool provides estimates only and should not replace professional medical advice. Always verify carb counts when making insulin dosing decisions. Glucent is not a medical device and has not been evaluated by any regulatory body.
