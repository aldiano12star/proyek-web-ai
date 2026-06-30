// Achievements CMS (Hall of Fame / F05) — list, add, delete.
//
// Server Component. Reads through the cookie-bound admin client so the page is
// rendered with the live, authenticated view of the table. Mutations are
// delegated to the Server Actions in ./actions.ts. force-dynamic because the
// data is per-request and changes as the admin edits.

import { Trophy } from "lucide-react";
import { createInsForgeServerClient } from "@/lib/insforge-server";
import type { Achievement } from "@/lib/types";
import AddAchievementForm from "./AddAchievementForm";
import DeleteAchievementButton from "./DeleteAchievementButton";

export const dynamic = "force-dynamic";

async function getAchievementsAdmin(): Promise<Achievement[]> {
  const client = await createInsForgeServerClient();
  const { data, error } = await client.database
    .from("achievements")
    .select()
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[achievements] list failed:", error);
    return [];
  }
  return (data ?? []) as Achievement[];
}

export default async function AchievementsPage() {
  const achievements = await getAchievementsAdmin();

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-deadpool-red text-canvas-black">
          <Trophy size={24} strokeWidth={2.5} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight text-deadpool-white">
            Hall of Fame
          </h1>
          <p className="mt-1 font-mono text-sm text-deadpool-white/60">
            Kelola daftar prestasi yang tampil di marquee halaman depan
          </p>
        </div>
      </div>

      {/* Add form */}
      <div className="mb-8">
        <AddAchievementForm />
      </div>

      {/* List */}
      <div className="rounded-xl border border-slate-border bg-card-dark shadow-comic">
        <div className="flex items-center justify-between border-b border-slate-border px-6 py-4">
          <h2 className="font-display text-lg font-black uppercase tracking-wide text-deadpool-white">
            Daftar Prestasi
          </h2>
          <span className="rounded-full border border-deadpool-red/40 bg-deadpool-red/10 px-3 py-1 font-mono text-xs text-deadpool-red">
            {achievements.length} total
          </span>
        </div>

        {achievements.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-mono text-sm text-deadpool-white/40">
              {"// belum ada prestasi — tambahkan yang pertama di atas"}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-border">
            {achievements.map((a, i) => (
              <li
                key={a.id}
                className="flex items-center gap-4 px-6 py-4 transition hover:bg-deadpool-white/[0.02]"
              >
                <span className="font-display text-lg font-black text-deadpool-red/60 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="flex-1 text-deadpool-white">{a.title}</p>
                <DeleteAchievementButton id={a.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
