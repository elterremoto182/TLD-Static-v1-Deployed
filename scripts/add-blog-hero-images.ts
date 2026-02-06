/**
 * One-off: Add image + imageAlt to all draft blog posts based on category/slug.
 * Uses existing assets only. Run: npx tsx scripts/add-blog-hero-images.ts
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'content/blog');

// Hero image + alt by category; slug keywords can pick a variant
const LEAK_HERO = [
  { image: '/images/services/leak-detection.jpg', imageAlt: 'Professional leak detection technician using specialized equipment to locate hidden water leaks' },
  { image: '/images/gallery/leak-detection-technician.jpg', imageAlt: 'Leak detection technician performing non-invasive inspection in a South Florida home' },
  { image: '/images/gallery/leak-detection-equipment.jpg', imageAlt: 'Professional leak detection equipment including thermal imaging and acoustic sensors' },
  { image: '/images/gallery/moisture-detection.jpg', imageAlt: 'Moisture detection equipment being used to locate hidden water leaks' },
  { image: '/images/gallery/leak%20detection%20moisture.JPG', imageAlt: 'Technician using moisture detection equipment to find slab or wall leaks' },
];
const MOLD_HERO = [
  { image: '/images/services/mold.jpg', imageAlt: 'Professional mold inspector collecting samples for laboratory mold testing' },
  { image: '/images/gallery/mold-inspection-before.jpg', imageAlt: 'Mold inspection revealing visible mold growth before remediation' },
  { image: '/images/gallery/mold-inspection-after.jpg', imageAlt: 'Post-remediation mold inspection confirming successful cleanup' },
];
const SEWER_HERO = [
  { image: '/images/gallery/camera-inspection-before.jpg', imageAlt: 'Sewer camera inspection showing interior of sewer line' },
  { image: '/images/gallery/camera-inspection-after.jpg', imageAlt: 'Sewer camera inspection after repair or cleaning' },
];
const DRAIN_HERO = [
  { image: '/images/services/drain-cleaning.jpg', imageAlt: 'Professional drain cleaning service clearing blocked drains' },
  { image: '/images/gallery/camera-inspection-before.jpg', imageAlt: 'Sewer camera inspection used to diagnose drain and sewer problems' },
];

function pickHero(category: string, slug: string): { image: string; imageAlt: string } {
  const cat = (category || '').toLowerCase();
  const s = slug.toLowerCase();
  let list: { image: string; imageAlt: string }[];
  if (cat.includes('leak')) {
    list = LEAK_HERO;
    if (s.includes('slab') || s.includes('concrete')) list = [LEAK_HERO[3], LEAK_HERO[4], ...LEAK_HERO];
  } else if (cat.includes('mold')) {
    list = MOLD_HERO;
  } else if (cat.includes('sewer') || cat.includes('camera')) {
    list = SEWER_HERO;
  } else if (cat.includes('drain')) {
    list = DRAIN_HERO;
  } else {
    list = LEAK_HERO;
  }
  const idx = Math.abs(s.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)) % list.length;
  return list[idx];
}

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
let updated = 0;
for (const file of files) {
  const fullPath = path.join(postsDir, file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  if (data.draft !== true) continue;
  if (data.image && data.imageAlt) continue;
  const slug = file.replace(/\.md$/, '');
  const { image, imageAlt } = pickHero(data.category || '', slug);
  data.image = image;
  data.imageAlt = imageAlt;
  // lineWidth is passed through to js-yaml; gray-matter types don't declare it
  const newRaw = matter.stringify(content, data, { lineWidth: 1000 } as Parameters<typeof matter.stringify>[2]);
  fs.writeFileSync(fullPath, newRaw, 'utf8');
  updated++;
  console.log(slug, '->', image);
}
console.log('Updated', updated, 'draft posts with hero images.');
