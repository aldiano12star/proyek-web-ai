// Row shapes for the InsForge PostgreSQL tables. Keep in sync with db/01_schema.sql.

export interface Division {
  id: string;
  name: string;
  description: string;
  sub_description: string;
  icon_name: string; // lucide-react icon name, e.g. "Camera"
  color_palette: string; // comma-separated hex colors
  display_order: number;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  display_order: number;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  display_order: number;
  created_at: string;
}

export interface GalleryPhoto {
  id: string;
  image_url: string;
  storage_path: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export interface SiteContent {
  key: string;
  value: string;
  updated_at: string;
}

// Convenience: a key/value map of site_content for easy lookup in components.
export type SiteContentMap = Record<string, string>;
