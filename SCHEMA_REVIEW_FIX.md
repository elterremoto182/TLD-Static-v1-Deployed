# Schema Audit & HP Best Practices Implementation

## Overview

This document describes the schema changes implemented to align with 2026 Google expectations and best practices (Hernandez Plumbing / local service SEO guidance). Schema now uses a single main entity, AggregateRating only (no individual Review objects), and proper page-type-specific structure.

## Changes Implemented

### 1. Review & Rating Fixes (Phase 1)

**Removed individual Review objects**
- Deleted `getCustomerReviews()` and all hardcoded `Review` schema
- Google heavily restricts self-served Review schema for LocalBusiness/Organization on homepages
- Individual Review objects rarely trigger rich results for local services

**Aligned AggregateRating with visible content**
- `getAggregateRating()` now uses **Google reviews only** (not Yelp/Facebook average)
- Schema values match ReviewBadge and Contact component displays (4.6, 137)
- Schema must reflect what users see and what Google can verify (Google Business Profile)
- Source: `config/site.json` → `reviews.google.rating` and `reviews.google.reviewCount`

### 2. Entity Consolidation (Phase 2)

**Single main entity with `#plumber`**
- Main entity uses `@id: ${baseUrl}#plumber` (exported as `ENTITY_ID`)
- WebSite publisher, Service provider, Article publisher all reference `#plumber`
- Removed duplicate Organization schema from layout (was on every page)

**LocalBusiness restricted to homepage only**
- Full Plumber/LocalBusiness with AggregateRating: **home page only**
- Service hubs, service pages, city-service, contact: **minimal entity stub** + Service schema (no full LocalBusiness)
- Prevents duplicate entity signals across hundreds of pages

### 3. Problem Pages Refactor (Phase 3)

**Problem × city pages** (`/problems/[problem]/[city]/`)
- Switched from custom schema (Breadcrumb + LocalBusiness + WebPage) to `buildPageSchemaGraph` with `pageType: 'problem-city'`
- Now output: WebSite, main entity stub, BreadcrumbList, WebPage, **Service** schema
- Service schema: `"name": "${problem.name} in ${city.name}, FL"`, `provider: #plumber`, `areaServed: City`
- **No LocalBusiness** on problem pages — Service + WebPage + Breadcrumb only
- Single `@graph` script tag (consolidated)

### 4. Config & Maintainability

**Review data**
- Schema uses `reviews.google` from `config/site.json` as the single source
- When updating displayed ratings (ReviewBadge, Contact), ensure `config/site.json` reviews.google is updated to match
- Do not fake review counts; values must match real Google Business Profile data

## Current Schema Architecture

| Page Type     | Main Entity     | Other Schema                           |
|---------------|-----------------|----------------------------------------|
| Home          | Full Plumber + AggregateRating | WebSite, WebPage, Breadcrumb, FAQ |
| Contact       | Minimal stub    | WebSite, WebPage, Breadcrumb            |
| Service hub   | Minimal stub    | WebSite, Service, CollectionPage, Breadcrumb |
| City-service  | Minimal stub    | WebSite, Service, WebPage, HowTo, Breadcrumb, FAQ |
| Problem-city  | Minimal stub    | WebSite, Service, WebPage, Breadcrumb   |
| Article       | Minimal stub    | WebSite, Article, WebPage, Breadcrumb   |
| Collection    | Minimal stub    | WebSite, CollectionPage, Breadcrumb     |

## Trust Signals Still Present

- `<ReviewBadge>` component in footer (uses `reviews.google` from config)
- "4.6 Rating on Google with 137 Reviews" in page copy
- Visual trust indicators on all pages

**Schema changes ≠ trust signals removed.** Users still see the same trust elements.

## Validation

After implementation:
- [x] Only AggregateRating on main entity (no individual Review objects)
- [x] AggregateRating matches visible Google review content
- [x] Single Plumber entity with `#plumber` on homepage only
- [x] All Service schemas reference `provider: #plumber`
- [x] Problem pages have Service schema (no LocalBusiness)
- [x] No duplicate Organization in layout
- [ ] Google Rich Results Test passes for homepage
- [ ] Schema.org validator passes

## Files Modified

- `lib/seo/schema.ts` — Review removal, AggregateRating fix, @id → #plumber, LocalBusiness restriction, problem-city pageType
- `app/layout.tsx` — Removed standalone Organization schema
- `app/problems/[problem]/[city]/page.tsx` — Switched to buildPageSchemaGraph with problem-city
