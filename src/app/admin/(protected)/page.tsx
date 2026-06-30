// Admin dashboard home — welcome summary with quick stats from the database.

import { getSessionUser } from "@/lib/insforge-server";
import { insforge } from "@/lib/insforge";
import { Zap, Trophy, Briefcase, ImageIcon } from "lucide-react";

async function getDashboardStats() {
  const [achievementsRes, programsRes, galleryRes] = await Promise.all([
    insforge.database.from("achievements").select("id", { count: "exact" }),
    insforge.database.from("programs").select("id", { count: "exact" }),
    insforge.database.from("gallery").select("id", { count: "exact" }),
  ]);

  return {
    achievements: achievementsRes.count ?? 0,
    programs: programsRes.count ?? 0,
    photos: galleryRes.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  const stats = await getDashboardStats();

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-8 border-l-4 border-deadpool-red bg-card-dark p-6 shadow-comic">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-deadpool-red text-canvas-black">
            <Zap size={24} strokeWidth={2.5} />
          </span>
          <div>
            <h1 className="font-display text-3xl font-black tracking-tight text-deadpool-white">
              Welcome, Admin
            </h1>
            <p className="mt-1 font-mono text-sm text-deadpool-white/60">
              {user?.email ?? "Signed in"}
            </p>
          </div>
        </div>

        <p className="mt-4 text-deadpool-white/80">
          Kelola konten dinamis Sapa Exploit dari sini. Gunakan sidebar untuk
          menambah prestasi, mengedit program kerja, atau mengunggah foto
          kebersamaan baru.
        </p>
      </div>

      {/* Stats grid — Bento-style cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Trophy}
          label="Achievements"
          count={stats.achievements}
          color="red"
        />
        <StatCard
          icon={Briefcase}
          label="Programs"
          count={stats.programs}
          color="white"
        />
        <StatCard
          icon={ImageIcon}
          label="Gallery Photos"
          count={stats.photos}
          color="red"
        />
      </div>

      {/* Quick action hint */}
      <div className="mt-8 rounded-lg border border-slate-border bg-canvas-black p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-deadpool-white/40">
          {"//"} Quick Start
        </p>
        <p className="mt-2 text-sm text-deadpool-white/70">
          Pilih menu di sidebar kiri untuk mulai mengelola konten. Semua
          perubahan langsung tersinkronisasi dengan halaman publik.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  count,
  color,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
  color: "red" | "white";
}) {
  const colorClasses =
    color === "red"
      ? "border-deadpool-red bg-deadpool-red/10 text-deadpool-red"
      : "border-deadpool-white bg-deadpool-white/10 text-deadpool-white";

  return (
    <div className="rounded-xl border border-slate-border bg-card-dark p-6 shadow-comic transition hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-deadpool-white/50">
            {label}
          </p>
          <p className="mt-2 font-display text-4xl font-black text-deadpool-white">
            {count}
          </p>
        </div>
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-lg border ${colorClasses}`}
        >
          <Icon size={28} strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
}
