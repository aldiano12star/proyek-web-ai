// Maps the `icon_name` stored on each division row to a concrete lucide-react
// icon component. Importing the icons explicitly (rather than dynamically by
// string) keeps the client bundle small and stays type-safe. Unknown names
// fall back to a neutral icon so a bad/edited value never crashes the page.

import {
  type LucideIcon,
  Camera,
  Palette,
  Code2,
  TrendingUp,
  Film,
  Sparkles,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Camera,
  Palette,
  Code2,
  TrendingUp,
  Film,
};

export function divisionIcon(name: string): LucideIcon {
  return ICONS[name] ?? Sparkles;
}
