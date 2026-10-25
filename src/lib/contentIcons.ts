import {
  Award,
  BadgeCheck,
  Clock,
  Crosshair,
  Droplets,
  Factory,
  Feather,
  PackageCheck,
  FlaskConical,
  Flame,
  Fuel,
  Gauge,
  LucideIcon,
  Mountain,
  Ruler,
  ShieldCheck,
  Siren,
  Star,
  Trees,
  Truck,
  Waves,
  Weight,
  Wrench,
  Zap,
} from "lucide-react";

// Icons the admin can pick for homepage items, stored by name in the content JSON
export const contentIcons: Record<string, LucideIcon> = {
  star: Star,
  "shield-check": ShieldCheck,
  "badge-check": BadgeCheck,
  award: Award,
  zap: Zap,
  gauge: Gauge,
  mountain: Mountain,
  wrench: Wrench,
  trees: Trees,
  siren: Siren,
  waves: Waves,
  factory: Factory,
  flame: Flame,
  droplets: Droplets,
  truck: Truck,
  clock: Clock,
  "flask-conical": FlaskConical,
  "package-check": PackageCheck,
  feather: Feather,
};

export const getContentIcon = (name: string): LucideIcon => contentIcons[name] || Star;

// Product spec icons are picked from the spec label, so admins only type label + value
const specIconRules: [RegExp, LucideIcon][] = [
  [/berat|weight/i, Weight],
  [/debit|flow/i, Droplets],
  [/pressure|tekanan/i, Gauge],
  [/reach|jangkauan|jarak/i, Crosshair],
  [/engine|power|mesin/i, Zap],
  [/fuel|bahan bakar/i, Fuel],
];

export const getSpecIcon = (label: string): LucideIcon =>
  specIconRules.find(([pattern]) => pattern.test(label))?.[1] || Ruler;
