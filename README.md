# Total Leak Detection - Static Website v2.0

A production-ready Next.js static website for Total Leak Detection, featuring a sophisticated 3-tier content architecture for SEO authority, comprehensive local SEO system, and educational pillar content strategy.

## Features

- **3-Tier SEO Architecture**: Educational content → Services → Local SEO pages
- **Local SEO System**: City-specific service pages for 39+ South Florida cities
- **Pillar Content Strategy**: Comprehensive guides linking to service clusters
- **Blog with Taxonomy**: Posts organized by category with related post discovery
- **Fast & Optimized**: Static generation, lazy loading, image optimization, CDN-ready
- **Config-Driven**: All content managed through JSON and Markdown files
- **SEO Optimized**: Meta tags, Open Graph, structured data, sitemap.xml
- **Responsive**: Mobile-first design with breakpoints
- **Image Optimization**: Automatic WebP conversion with blur placeholders

## Tech Stack

- **Framework**: Next.js 14 (App Router, Static Export)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Image Optimization**: next-image-export-optimizer
- **Animations**: CSS transitions and transforms
- **Typography**: Inter (Google Fonts)
- **Icons**: Lucide React
- **Content**: Markdown with gray-matter and react-markdown

---

## Content Architecture

### 3-Tier SEO Strategy

```
┌─────────────────────────────────────────────────────────────┐
│  TIER 1: Educational Content (Informational Intent)         │
│  ├── /guides/{topic}/ - Pillar pages                        │
│  └── /blog/{slug}/ - Supporting articles                    │
│      ↓ Links down to services                               │
├─────────────────────────────────────────────────────────────┤
│  TIER 2: Service Pages (Transactional Intent)               │
│  └── /services/{service}/ - Main service pages              │
│      ↓ Links down to local pages                            │
├─────────────────────────────────────────────────────────────┤
│  TIER 3: Local SEO (Transactional + Local Intent)           │
│  ├── /{service}/{city}/ - City service pages                │
│  └── /problems/{problem}/{city}/ - Problem-specific pages   │
└─────────────────────────────────────────────────────────────┘
```

### Pillar Pages (Guides)

Comprehensive educational content that establishes topical authority:

| Guide | Path | Feeds Service |
|-------|------|---------------|
| Leak Detection Guide | `/guides/leak-detection/` | `/services/leak-detection/` |
| Sewer Camera Guide | `/guides/sewer-camera-inspection/` | `/services/camera-inspection/` |
| Drain Cleaning Guide | `/guides/drain-cleaning/` | `/services/drain-cleaning/` |
| Mold Testing Guide | `/guides/mold-testing/` | `/services/mold-testing/` |

### Services (Tier 2)

Main service pages with detailed information:

- `/services/leak-detection/` - Water leak detection
- `/services/mold-testing/` - Mold inspection & air quality
- `/services/camera-inspection/` - Sewer camera inspection
- `/services/slab-leaks/` - Foundation leak detection
- `/services/drain-cleaning/` - Drain maintenance
- `/services/clogged-drains/` - Blockage clearing
- `/services/hydro-jetting/` - High-pressure cleaning
- `/services/damaged-sewer/` - Sewer line repair
- `/services/leaking-toilet/` - Toilet leak services
- `/services/plumbing-report-writing/` - Documentation services
- `/services/commercial-services/` - Commercial solutions

### Local SEO Pages (Tier 3)

City-specific service pages for local search visibility:

**Service + City Pages:**
- `/leak-detection/{city}/` - Leak detection in specific cities
- `/mold-testing/{city}/` - Mold testing in specific cities
- `/sewer-camera-inspection/{city}/` - Camera inspection in specific cities

**Problem + City Pages:**
- `/problems/{problem}/{city}/` - Problem-specific pages by city
- Examples: `/problems/slab-leak/miami/`, `/problems/root-intrusion/fort-lauderdale/`

---

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout with SEO
│   ├── sitemap.ts                # Dynamic sitemap generator
│   │
│   ├── guides/                   # Tier 1: Pillar pages
│   │   └── [slug]/page.tsx       # Dynamic guide pages
│   │
│   ├── blog/                     # Tier 1: Blog content
│   │   ├── page.tsx              # Blog listing
│   │   └── [slug]/page.tsx       # Individual posts
│   │
│   ├── services/                 # Tier 2: Service pages
│   │   ├── page.tsx              # Services overview
│   │   └── [slug]/page.tsx       # Individual services
│   │
│   ├── leak-detection/           # Tier 3: Local SEO
│   │   ├── page.tsx              # Service hub
│   │   └── [city]/page.tsx       # City-specific pages
│   │
│   ├── mold-testing/             # Tier 3: Local SEO
│   │   ├── page.tsx              # Service hub
│   │   └── [city]/page.tsx       # City-specific pages
│   │
│   ├── sewer-camera-inspection/  # Tier 3: Local SEO
│   │   ├── page.tsx              # Service hub
│   │   └── [city]/page.tsx       # City-specific pages
│   │
│   ├── problems/                 # Tier 3: Problem pages
│   │   ├── page.tsx              # Problems overview
│   │   ├── [problem]/page.tsx    # Problem detail
│   │   └── [problem]/[city]/     # Problem + city pages
│   │
│   ├── areas/page.tsx            # Service areas overview
│   ├── about/page.tsx            # About page
│   ├── contact/                  # Contact page
│   └── [slug]/page.tsx           # Dynamic static pages
│
├── components/
│   ├── local-seo/                # Local SEO components
│   │   ├── LocalHero.tsx         # Hero with city name
│   │   ├── LocalIntro.tsx        # City-specific intro
│   │   ├── ServiceOverview.tsx   # Service details
│   │   ├── ServiceProcess.tsx    # How-it-works steps
│   │   ├── LocalFAQ.tsx          # FAQ section
│   │   ├── LocalCTA.tsx          # Call-to-action
│   │   ├── CityGrid.tsx          # City selection grid
│   │   ├── NearbyAreas.tsx       # Related cities
│   │   ├── NeighborhoodList.tsx  # Local neighborhoods
│   │   └── RelatedLinks.tsx      # Internal linking
│   │
│   ├── blog/                     # Blog components
│   │   ├── MarkdownRenderer.tsx  # MDX rendering
│   │   └── RelatedPosts.tsx      # Related post cards
│   │
│   ├── sections/                 # Page sections
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── About.tsx
│   │   ├── Gallery.tsx
│   │   ├── Testimonials.tsx
│   │   ├── TrustBadges.tsx
│   │   ├── CTABanner.tsx
│   │   ├── FAQ.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── ServiceAreas.tsx
│   │   ├── FindInYourCity.tsx
│   │   ├── GoogleMap.tsx
│   │   └── ValueProposition.tsx
│   │
│   ├── ui/                       # shadcn/ui components
│   │   ├── breadcrumb.tsx
│   │   └── loading-skeleton.tsx
│   │
│   ├── media/VideoPlayer.tsx
│   ├── AnimateOnScroll.tsx
│   ├── OptimizedImage.tsx
│   ├── ReviewBadge.tsx
│   ├── StickyCallButton.tsx
│   └── YouTubeHydrator.tsx
│
├── config/                       # Configuration files
│   ├── site.json                 # Site metadata & navigation
│   ├── theme.json                # Theme customization
│   ├── content.json              # Home page content
│   ├── seo.json                  # SEO settings
│   ├── taxonomy.json             # Content structure & linking rules
│   └── local-seo/                # Local SEO data
│       ├── cities.json           # 39+ city definitions
│       ├── services.json         # Service templates
│       ├── problems.json         # Problem type definitions
│       └── faqs.json             # FAQ content
│
├── content/
│   ├── blog/                     # 23 Markdown blog posts
│   └── pages/                    # Static page content
│       ├── guides-*.md           # Pillar page content
│       └── services-*.md         # Service page content
│
├── lib/
│   ├── local-seo/                # Local SEO utilities
│   │   ├── data.ts               # Data fetching
│   │   ├── templates.ts          # Content templating
│   │   ├── links.ts              # Internal linking
│   │   └── schema.ts             # Structured data
│   ├── blog/posts.ts             # Blog utilities
│   ├── pages/pages.ts            # Page utilities
│   ├── seo/                      # SEO utilities
│   │   ├── structured-data.ts
│   │   └── faq-data.ts
│   └── utils.ts                  # Helper functions
│
└── public/
    ├── images/                   # Image assets
    ├── robots.txt
    └── llms.txt                  # AI crawler guidance
```

---

## Local SEO System

### Service Areas

**Miami-Dade County (18 cities):**
Miami, Miami Beach, Coral Gables, Hialeah, Doral, Kendall, Pinecrest, Homestead, Miami Lakes, Aventura, North Miami, North Miami Beach, South Miami, Cutler Bay, Palmetto Bay, Key Biscayne, Sweetwater, Sunny Isles Beach

**Broward County (20 cities):**
Fort Lauderdale, Hollywood, Pembroke Pines, Miramar, Coral Springs, Plantation, Davie, Sunrise, Pompano Beach, Deerfield Beach, Lauderhill, Lauderdale Lakes, Tamarac, Coconut Creek, Margate, Weston, Hallandale Beach, Cooper City, Parkland, Oakland Park

**Palm Beach County (1 city):**
Boca Raton

### City Data Structure

Each city includes:
- Name and slug
- County and state
- Coordinates (lat/lng)
- Neighborhoods served
- ZIP codes
- Response time estimates
- Local factors (climate, risks, characteristics)
- Custom intro and extended content
- Nearby areas for linking

### Problem Types

**Leak Detection Problems:**
- Slab Leak Detection
- Burst Pipe Detection
- Water Heater Leak Detection
- Pool Leak Detection
- Underground Leak Detection
- Shower Pan Leak Detection
- Toilet Leak Detection

**Mold Testing Problems:**
- Bathroom Mold Testing
- Water Damage Mold Assessment
- Hidden Mold Detection

**Sewer Inspection Problems:**
- Tree Root Intrusion
- Collapsed Pipe Detection
- Sewer Blockage Diagnosis

---

## Blog Taxonomy

Blog posts are organized by category and linked to their parent service and pillar page:

### Category: Leak Detection
- Parent Pillar: `/guides/leak-detection/`
- Parent Service: `/services/leak-detection/`
- 10 published articles, 11 planned

### Category: Mold Testing
- Parent Pillar: `/guides/mold-testing/`
- Parent Service: `/services/mold-testing/`
- 3 published articles, 12 planned

### Category: Sewer Camera Inspection
- Parent Pillar: `/guides/sewer-camera-inspection/`
- Parent Service: `/services/camera-inspection/`
- 6 published articles, 9 planned

### Category: Drain Cleaning
- Parent Pillar: `/guides/drain-cleaning/`
- Parent Service: `/services/drain-cleaning/`
- 4 published articles, 11 planned

---

## Internal Linking Strategy

### Rules

1. **Tier 1 → Tier 2**: Every blog post links to its parent service page
2. **Tier 1 → Pillar**: Every blog post links to its pillar page
3. **Pillar → Cluster**: Pillar pages link to all supporting blog posts
4. **Pillar → Service**: Pillar pages include CTAs to related services
5. **Service → Local**: Service pages link to city-specific pages
6. **Cross-Cluster**: Related topics link horizontally (e.g., leaks → mold)

### Example Link Flow

```
Blog Post: "Signs of Hidden Water Leaks"
    ↓
Pillar Page: /guides/leak-detection/
    ↓
Service Page: /services/leak-detection/
    ↓
Local Page: /leak-detection/miami/
```

---

## Configuration

### Site Configuration (`config/site.json`)

Site-wide settings including:
- Business name and contact info
- Navigation menu
- Social media links
- SEO metadata

### Theme Configuration (`config/theme.json`)

Visual appearance including:
- Color palette (HSL format)
- Typography
- Spacing
- Border radius

### Taxonomy Configuration (`config/taxonomy.json`)

Complete content structure including:
- 3-tier architecture definition
- Page structure and paths
- Blog category mappings
- Pillar page definitions
- Internal linking rules

### Local SEO Configuration (`config/local-seo/`)

- `cities.json` - City data with neighborhoods, ZIP codes, local factors
- `services.json` - Service templates with process steps, technology, content
- `problems.json` - Problem definitions with symptoms, causes, urgency
- `faqs.json` - FAQ content organized by service type

---

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (standard)
npm run build

# Build with image optimization
npm run build:optimized

# Optimize images only
npm run export-images

# Type check
npm run typecheck
```

### Build Output

The build generates a complete static site in the `out` directory, including:
- All static pages
- City-specific local SEO pages
- Problem-specific pages
- Blog posts
- Optimized images
- Sitemap.xml

---

## Deployment

Optimized for static deployment:

### Vercel (Recommended)
```bash
# Push to GitHub and connect to Vercel
# Build command: npm run build
# Output directory: out
```

### Netlify
```bash
# Build command: npm run build
# Publish directory: out
```

### Static Hosting (S3, GitHub Pages)
```bash
npm run build
# Upload 'out' directory
```

---

## SEO Features

- Dynamic meta tags from config
- Open Graph and Twitter Cards
- Structured data (LocalBusiness, FAQPage, Service schemas)
- Automatic sitemap.xml generation
- robots.txt for crawler control
- Semantic HTML structure
- Internal linking for PageRank flow
- City-specific canonical URLs
- Breadcrumb navigation

---

## Performance

- Static generation for all pages
- WebP image optimization with blur placeholders
- Lazy-loaded images and videos
- CSS optimization and minification
- Code splitting and tree shaking
- Optimized fonts with preloading
- Console.log removal in production
- SWC minification

---

## Contact Form Integration

The contact form integrates with **n8n webhooks** for serverless form submissions.

### Setup

1. Create n8n webhook workflow
2. Add webhook URL to `.env.local`:
   ```
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/abc123
   ```
3. Activate workflow in n8n

### Form Data Structure

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "Your message here",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "source": "contact-form"
}
```

---

## Page Count Summary

| Content Type | Count |
|--------------|-------|
| Static Pages | ~15 |
| Service Pages | 11 |
| Guide/Pillar Pages | 4 |
| Blog Posts | 23 |
| City Service Pages | ~117 (39 cities × 3 services) |
| Problem Pages | ~13 |
| Problem + City Pages | ~500+ |
| **Total Pages** | **~700+** |

---

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

---

## License

MIT

---

## Support

For issues or questions, please open a GitHub issue.
