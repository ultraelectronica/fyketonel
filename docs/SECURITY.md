# Security Hardening Plan

This project runs on Vercel and is mostly a public portfolio site, so the main abuse surface is app-layer traffic against the API routes, especially `/api/contact`.

## Goals

- Cut down bot and spam traffic before it reaches the contact handler.
- Add basic browser-side hardening headers.
- Make the contact endpoint stop trusting raw user input.
- Replace local-only throttling with a distributed limiter in the next phase.

## Current State

- Hosting: Vercel
- Framework: Next.js App Router
- Existing throttling: in-memory device-based limiter for `/api/contact`
- Current gap: no global middleware rate limiting, no CAPTCHA, no WAF rules, no bot challenge

## Roadmap

### P0: Implemented now

- Add baseline security headers in `next.config.ts`
- Add server-side validation for contact email and message fields
- Escape contact form content before rendering it into the HTML email body
- Stop trusting the client to choose the contact recipient address
- Mirror the server limits in the contact form inputs for better UX

### P1: Next

- Replace the in-memory contact limiter with Upstash Redis or Vercel KV
- Add `middleware.ts` with IP-based rate limits for public pages and API routes
- Add Cloudflare Turnstile to `/api/contact`
- Enforce request body size limits and log 429 spikes

### P2: Platform hardening

- Enable Vercel Bot Protection
- Add Vercel WAF rules for common attack patterns
- Add monitoring and alerting for error spikes and sustained 429 responses

### P3: Escalation path

- Put Cloudflare in front of Vercel only if attack volume justifies the extra layer
- Add challenge-based protection for higher-risk endpoints if abuse continues

## Notes

- The current in-memory limiter is not enough for serverless scale because separate instances do not share state.
- CSP needs to stay in sync with the app's real external dependencies. Right now that includes GitHub API, the GitHub contributions API, and `ghchart.rshah.org`.
- Secrets should stay in Vercel environment variables or local-only env files, not committed repo files.
