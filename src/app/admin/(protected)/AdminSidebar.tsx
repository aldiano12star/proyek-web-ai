"use client";

// Sidebar navigation for the admin CMS. Client Component because it needs
// usePathname to highlight the active route and manages the sign-out action.

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Boxes,
  Trophy,
  Briefcase,
  ImageIcon,
  LogOut,
} from "lucide-react";
import { signOutAction } from "../actions";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/content",
    label: "General Content",
    icon: FileText,
  },
  {
    href: "/admin/divisions",
    label: "Divisions",
    icon: Boxes,
  },
  {
    href: "/admin/achievements",
    label: "Achievements",
    icon: Trophy,
  },
  {
    href: "/admin/programs",
    label: "Programs",
    icon: Briefcase,
  },
  {
    href: "/admin/gallery",
    label: "Gallery",
    icon: ImageIcon,
  },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-dvh w-64 flex-col border-r border-slate-border bg-card-dark">
      {/* Header branding */}
      <div className="border-b border-slate-border p-6">
        <h1 className="font-display text-2xl font-black tracking-tight text-deadpool-red">
          SAPA EXPLOIT
        </h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-deadpool-white/40">
          Admin CMS
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition ${
                isActive
                  ? "bg-deadpool-red text-canvas-black"
                  : "text-deadpool-white/70 hover:bg-deadpool-white/5 hover:text-deadpool-white"
              }`}
            >
              <Icon size={18} strokeWidth={2.5} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer: user info + sign out */}
      <div className="border-t border-slate-border p-4">
        <div className="mb-3 rounded-lg border border-slate-border bg-canvas-black px-3 py-2">
          <p className="truncate font-mono text-xs text-deadpool-white/60">
            {userEmail}
          </p>
        </div>

        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg border border-deadpool-red/50 bg-deadpool-red/10 px-4 py-2.5 font-medium text-deadpool-red transition hover:border-deadpool-red hover:bg-deadpool-red hover:text-canvas-black"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
