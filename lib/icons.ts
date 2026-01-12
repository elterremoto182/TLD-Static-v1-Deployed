/**
 * Icon Map Utility
 * 
 * This file provides a centralized icon mapping to avoid importing the entire
 * Lucide icons library (1,400+ icons) via wildcard imports, which would bloat
 * the JavaScript bundle.
 * 
 * Only the icons actually used in the application are imported and exported here.
 */

import {
  AlertTriangle,
  ArrowRight,
  Award,
  Ban,
  Bath,
  Building,
  Calendar,
  Camera,
  CheckCircle,
  ClipboardCheck,
  Clock,
  CloudRain,
  Droplet,
  Droplets,
  Eye,
  FileCheck,
  FileText,
  Flame,
  Layers,
  MapPin,
  Mountain,
  Phone,
  Search,
  Shield,
  TestTube,
  TreeDeciduous,
  Users,
  Video,
  Waves,
  Wrench,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Map of icon names to their Lucide React components.
 * Add new icons here as needed - this keeps bundle size minimal
 * while supporting dynamic icon rendering.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  AlertTriangle,
  ArrowRight,
  Award,
  Ban,
  Bath,
  Building,
  Calendar,
  Camera,
  CheckCircle,
  ClipboardCheck,
  Clock,
  CloudRain,
  Droplet,
  Droplets,
  Eye,
  FileCheck,
  FileText,
  Flame,
  Layers,
  MapPin,
  Mountain,
  Phone,
  Search,
  Shield,
  TestTube,
  TreeDeciduous,
  Users,
  Video,
  Waves,
  Wrench,
  Zap,
};

/**
 * Get an icon component by name with a fallback.
 * 
 * @param iconName - The name of the icon (e.g., "Phone", "AlertTriangle")
 * @param fallback - The fallback icon to use if iconName is not found (defaults to AlertTriangle)
 * @returns The icon component
 */
export function getIcon(iconName: string, fallback: LucideIcon = AlertTriangle): LucideIcon {
  return ICON_MAP[iconName] ?? fallback;
}

// Re-export commonly used icons for direct imports
export {
  AlertTriangle,
  ArrowRight,
  Award,
  Ban,
  Bath,
  Building,
  Calendar,
  Camera,
  CheckCircle,
  ClipboardCheck,
  Clock,
  CloudRain,
  Droplet,
  Droplets,
  Eye,
  FileCheck,
  FileText,
  Flame,
  Layers,
  MapPin,
  Mountain,
  Phone,
  Search,
  Shield,
  TestTube,
  TreeDeciduous,
  Users,
  Video,
  Waves,
  Wrench,
  Zap,
};
