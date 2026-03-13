# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Glucent, please report it responsibly.

**Email:** Open a [GitHub Security Advisory](https://github.com/belibathan/glucent/security/advisories/new) on this repository.

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact

We will acknowledge your report within 48 hours and work to release a fix promptly.

## Architecture & Data Handling

Glucent is a **BYOK (Bring Your Own Key)** application:

- **API keys** are stored in the user's browser `localStorage` and sent directly to Anthropic's API via the Next.js backend route. They are never logged or persisted server-side.
- **Images** are processed client-side (resized to max 1024px) and sent as base64 to Claude's API. They are not stored on any server.
- **No database, no user accounts, no server-side storage.** All data lives in the browser session and is lost on page refresh.
- The Next.js API route acts as a pass-through proxy — it forwards the user's API key and image to Anthropic and returns the result.

## Best Practices for Users

- **Treat your API key like a password.** Do not share it or enter it on untrusted deployments of this app.
- **Self-host if concerned about privacy.** Clone the repo and run it locally or on your own infrastructure.
- If you believe a third-party deployment is logging API keys, do not use it. Rotate your key at [console.anthropic.com](https://console.anthropic.com/settings/keys).
