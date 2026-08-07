# VÄRDA — K-Beauty Reality Check

Organic-demand validation MVP for K-beauty product intelligence.

## Product promise

VÄRDA helps shoppers answer three questions before buying:

- Is the product actually used and reviewed in Korea, or is global hype stronger?
- What praise and complaints repeat across review sources?
- Did the formula, product name, or regional version change?

Every assessment separates verified facts, community signals, and AI-assisted estimates. Missing evidence remains visible.

## Current pilot

- searchable six-product database
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
- `Product Request`
- `Save Product`
- `Filter Reality Checks`

Product requests are also saved locally in the visitor's browser so the interaction remains transparent and does not collect an email address.

This project intentionally stays small until search impressions, product requests, saved products, and repeat visits support expansion.
