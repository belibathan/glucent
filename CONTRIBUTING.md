# Contributing to Glucent

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

```bash
git clone https://github.com/belibathan/glucent.git
cd glucent
pnpm install
pnpm dev
```

## Making Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b my-feature`
3. Make your changes
4. Run `pnpm build` to verify everything compiles
5. Commit with a clear message: `git commit -m "feat: add portion slider"`
6. Push and open a Pull Request

## Guidelines

- **Use pnpm** for all package management (not npm or yarn)
- **TypeScript** — no `any` types
- **Keep it simple** — this is a focused tool, not a platform
- **Mobile-first** — test at 375px width minimum
- **Accessibility** — use semantic HTML, ARIA labels for icon-only buttons

## Ideas for Contributions

- Meal history (local storage)
- Offline mode with service worker
- Barcode scanning for packaged foods
- Export analysis to clipboard/share
- Localization / i18n
- Dark mode support

## Code of Conduct

Be respectful and constructive. We're building something to help people manage a chronic condition — keep that in mind.
