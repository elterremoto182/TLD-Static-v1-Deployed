# AI Website Builder Template v2.0

A modern, production-ready Next.js template for building small business websites with AI. Built with performance, modularity, and flexibility in mind.

## Features 

- **Fast & Optimized**: Static generation, lazy loading, image optimization, and CDN-ready
- **Modern Design**: Clean typography, smooth animations, and professional styling
- **Config-Driven**: All content managed through JSON and Markdown files
- **Modular Components**: Reusable, well-organized component structure
- **Blog System**: Full Markdown blog with category support
- **SEO Optimized**: Meta tags, Open Graph, Twitter cards, sitemap.xml, and robots.txt
- **Responsive**: Mobile-first design with breakpoints
- **Image Optimization**: Automatic WebP conversion with blur placeholders and responsive sizing
- **Media Optimized**: Lazy-loaded images and videos with loading skeletons
- **Error Handling**: Custom 404 page and error boundaries
- **Accessible**: WCAG compliant with semantic HTML
- **Database Ready**: Supabase integration for data persistence

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Forms**: React Hook Form with Zod validation
- **Image Optimization**: next-image-export-optimizer
- **Animations**: CSS transitions and transforms
- **Theme**: next-themes for dark/light mode support
- **Typography**: Inter (Google Fonts)
- **Icons**: Lucide React
- **Blog**: Markdown with gray-matter and react-markdown

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── blog/                # Blog pages
│   │   ├── [slug]/         # Dynamic blog post pages
│   │   ├── loading.tsx     # Blog loading state
│   │   └── page.tsx        # Blog listing page
│   ├── error.tsx           # Error boundary
│   ├── global-error.tsx    # Global error handler
│   ├── layout.tsx          # Root layout with SEO
│   ├── loading.tsx         # Root loading state
│   ├── not-found.tsx       # Custom 404 page
│   ├── page.tsx            # Home page
│   └── sitemap.ts          # Dynamic sitemap generator
├── components/
│   ├── blog/               # Blog-specific components
│   │   └── MarkdownRenderer.tsx
│   ├── media/              # Media components
│   │   └── VideoPlayer.tsx
│   ├── sections/           # Page sections
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── About.tsx
│   │   ├── Gallery.tsx
│   │   ├── Testimonials.tsx
│   │   ├── TrustBadges.tsx
│   │   ├── CTABanner.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── loading-skeleton.tsx
│   ├── AnimateOnScroll.tsx # Scroll animation wrapper
│   ├── OptimizedImage.tsx  # Image optimization component
│   └── ReviewBadge.tsx     # Review/rating component
├── config/                 # Configuration files
│   ├── site.json          # Site metadata & navigation
│   ├── theme.json         # Theme customization
│   └── content.json       # Page content
├── content/
│   └── blog/              # Markdown blog posts
├── lib/
│   ├── blog/              # Blog utilities
│   │   └── posts.ts
│   └── utils.ts           # Helper functions
├── public/
│   ├── images/            # Image assets
│   │   └── */nextImageExportOptimizer/ # Optimized WebP images
│   └── robots.txt         # Search engine directives
├── loader.js              # Custom Next.js image loader
├── next.config.js         # Next.js configuration
└── .env                   # Environment variables (Supabase)
```

## Configuration

### Site Configuration (`config/site.json`)

Contains site-wide settings:
- Business name and contact info
- Navigation menu
- Social media links (Facebook, Twitter/X, Instagram, YouTube, LinkedIn, TikTok)
- SEO metadata

**Social Links:** Add any combination of social platforms. The footer automatically displays only the platforms you configure. Supported platforms: `facebook`, `twitter`, `instagram`, `youtube`, `linkedin`, `tiktok`.

### Theme Configuration (`config/theme.json`)

Customize the visual appearance:
- Color palette (HSL format for Tailwind)
- Typography
- Spacing
- Border radius

### Content Configuration (`config/content.json`)

All page content:
- Hero section
- Services
- About section with stats
- Gallery (before/after showcase)
- Testimonials
- Trust badges
- CTA banner
- Contact form

### Database Configuration (`.env`)

Supabase connection settings:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The template includes Supabase client integration for data persistence. You can use it for:
- Contact form submissions
- User authentication
- Dynamic content management
- Blog comments
- Any custom database needs

### Image Optimization Configuration

Image optimization is configured in `next.config.js`:
- **Quality**: 75% (configurable via `nextImageExportOptimizer_quality`)
- **Format**: WebP conversion enabled
- **Blur Placeholders**: Automatically generated
- **Responsive Sizes**: 16px to 3840px for all devices
- **Cache**: Optimized images are cached and only regenerated when source changes

## Customization

### Changing Colors

Edit `config/theme.json` and update the CSS variables in `app/globals.css`:

```json
{
  "colors": {
    "primary": "217.2 91.2% 59.8%",
    "accent": "37.7 92.1% 50.2%"
  }
}
```

### Adding Content

1. **Update site info**: Edit `config/site.json`
2. **Modify sections**: Edit `config/content.json`
3. **Add blog posts**: Create `.md` files in `content/blog/`

### Blog Post Format

```markdown
---
title: "Post Title"
date: "2025-10-15"
excerpt: "Brief description"
author: "Author Name"
category: "Category"
image: "/images/blog/image.jpg"
---

# Your content here
```

## Component Features

### OptimizedImage

Automatically optimizes images with WebP conversion and blur placeholders:
```tsx
<OptimizedImage
  src="/images/hero/hero-background.jpeg"
  alt="Hero background"
  width={1920}
  height={1080}
  priority={true}
/>
```

Images are automatically:
- Converted to WebP format
- Generated at multiple responsive sizes
- Given blur placeholders for smooth loading
- Cached for faster subsequent builds

### VideoPlayer

Custom video player with controls:
```tsx
<VideoPlayer
  src="/path/to/video.mp4"
  poster="/poster.jpg"
  autoPlay={true}
  loop={true}
  muted={true}
/>
```

### AnimateOnScroll

Wrapper component for scroll-based animations:
```tsx
<AnimateOnScroll animation="fade-up" delay={0.2}>
  {/* Your content */}
</AnimateOnScroll>
```

### Form Components

Built with React Hook Form and Zod validation:
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(10),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

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

# Start production server
npm start

# Type check
npm run typecheck
```

### Build Commands Explained

- **`npm run build`**: Standard build with CSS optimization (no image processing)
- **`npm run build:optimized`**: Full build including image optimization and WebP conversion
- **`npm run export-images`**: Run image optimization separately without building

**Note**: If images are already optimized (exist in `nextImageExportOptimizer` folders), they will be skipped unless the source image has changed. This makes subsequent builds much faster.

## Deployment

This template is optimized for static deployment:

1. **Vercel** (recommended):
   - Push to GitHub and connect to Vercel
   - Use build command: `npm run build` (images already optimized)
   - Output directory: `out`

2. **Netlify**:
   - Use build command: `npm run build`
   - Publish directory: `out`

3. **Static hosting** (S3, GitHub Pages, etc.):
   - Run `npm run build` locally
   - Upload the `out` directory

**Deployment Tips**:
- Pre-optimize images before deploying to reduce build times
- The `out` directory contains the complete static site
- All optimized images are included in the build
- No server runtime required

## SEO Features

- Dynamic meta tags from config
- Open Graph support
- Twitter Cards
- Automatic sitemap.xml generation
- robots.txt for crawler control
- Semantic HTML structure
- Image alt tags
- Structured data ready (add Schema.org markup)

## Performance

- Static generation for all pages (output: 'export')
- Advanced image optimization with WebP conversion and blur placeholders
- Lazy-loaded images and videos with loading skeletons
- Automatic CSS optimization and minification
- Code splitting and tree shaking
- Optimized fonts with preloading
- Minimal JavaScript footprint
- Fast Time to Interactive (TTI)
- Error boundaries for graceful degradation
- Console.log removal in production builds
- Compression enabled
- SWC minification for faster builds

## Contact Form Integration

The contact form is now integrated with **n8n webhooks** for serverless form submissions. The form sends data to your n8n workflow, which can then:
- Send email notifications
- Store submissions in a database
- Trigger other automations
- Integrate with CRM systems

### Setting Up n8n Webhook

1. **Create an n8n Webhook Workflow:**
   - In your n8n instance, create a new workflow
   - Add a "Webhook" node and configure it to accept POST requests
   - Copy the webhook URL (e.g., `https://your-n8n-instance.com/webhook/abc123`)

2. **Configure the Environment Variable:**
   - Create a `.env.local` file in the project root
   - Add your webhook URL:
     ```
     NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/abc123
     ```
   - For static exports, you'll need to set this during build time or use a config file

3. **Activate Your Workflow:**
   - Make sure your n8n workflow is **active** (not just saved)
   - The workflow must be running for the webhook to accept requests

4. **Configure CORS (Important for Local Development):**
   - In your n8n webhook node settings, you may need to configure CORS
   - For n8n.cloud, CORS is usually handled automatically for production domains
   - For local development (localhost:3000), you have two options:
     - **Option A**: Add a "Respond to Webhook" node after your webhook with these headers:
       ```
       Access-Control-Allow-Origin: *
       Access-Control-Allow-Methods: POST, OPTIONS
       Access-Control-Allow-Headers: Content-Type
       ```
     - **Option B**: Use n8n's production URL (not localhost) for testing
   - **Note**: The 404 error suggests your workflow might not be active - make sure to activate it!

5. **Build and Deploy:**
   - The form will automatically use the webhook URL from the environment variable
   - For static sites, make sure to set the environment variable during your build process

### Troubleshooting CORS Errors

If you see a CORS error when submitting the form:

1. **Check if workflow is active**: The workflow must be active (not just saved) in n8n
2. **Add CORS headers in n8n**: Add a "Respond to Webhook" node with CORS headers (see step 4 above)
3. **Verify webhook URL**: Make sure the webhook URL is correct and the workflow is active
4. **Test the webhook directly**: Use a tool like Postman or curl to test if the webhook accepts requests

### Form Data Structure

The form sends the following JSON payload to your n8n webhook:
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

### Alternative Integration Options

If you prefer other solutions:
1. **Formspree** (easiest): No backend required
2. **Netlify Forms**: Simple attribute addition
3. **Custom API Route**: Full control with email service
4. **Email Link**: Simplest fallback option

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

MIT

## Support

For issues or questions, please open a GitHub issue.
