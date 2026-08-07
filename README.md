# VÄRDA — K-Beauty Reality Check

Organic-demand validation MVP for K-beauty product intelligence.

## Product promise

VÄRDA helps shoppers answer three questions before buying:

- Is the product actually used and reviewed in Korea, or is global hype stronger?
- What praise and complaints repeat across review sources?
- Did the formula, product name, or regional version change?

Every assessment separates verified facts, community signals, and AI-assisted estimates. Missing evidence remains visible.

## Current MVP

- open-world product search with cached live Quick Scans
- six verified/editorial product reports
- full Reality Check report for ANUA Heartleaf 77 Soothing Toner
- five sourced formula/version reports from the original pilot
- device-local saved-product list
- no-account product research requests
- Vercel Web Analytics pageview and custom-event hooks
- structured data, sitemap, robots, canonical metadata

## Validation events

The home page emits these Vercel Web Analytics custom events when analytics is enabled for the Vercel project:

- `Open Search Result`
- `Search Miss`
- `Quick Scan Started`
- `Quick Scan Completed`
- `Quick Scan Failed`
- `Product Request`
- `Save Product`
- `Filter Reality Checks`

## Live research setup

1. Run `supabase/migrations/001_varda_research.sql` in the VÄRDA Supabase project.
2. Add these environment variables to the Vercel project for Preview and Production:

   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY` (preferred) or `SUPABASE_SERVICE_ROLE_KEY`
   - `VARDASCAN_HASH_SALT`

3. Optional controls:

   - `OPENAI_MODEL` defaults to `gpt-5.5`
   - `VARDASCAN_CACHE_DAYS` defaults to `30`
   - `VARDASCAN_DAILY_LIMIT` defaults to `5` new scans per IP hash

Secret keys are backend-only. Never expose them in browser JavaScript or commit them to GitHub.

The live route is `POST /api/scan`. Cached results are shared across visitors; new results stay provisional and are not assigned indexable URLs.

Product requests are also saved locally in the visitor's browser so the interaction remains transparent and does not collect an email address.

This project intentionally stays small until search impressions, product requests, saved products, and repeat visits support expansion.
