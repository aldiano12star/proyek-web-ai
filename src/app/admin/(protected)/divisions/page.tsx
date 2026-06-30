// Divisions CMS (F03) — edit the 5 fixed divisions.
//
// Server Component. Reads through the cookie-bound admin client so the page
// renders the live, authenticated view of the table. The divisions are seeded
// once and never added/removed here — each row gets an EditDivisionForm whose
// Save delegates to updateDivisionAction in ./actions.ts. force-dynamic because
// the copy changes as the admin edits.

import { Boxes } from "lucide-react";
import { createInsForgeServerClient } from "@/lib/insforge-server";
import type { Division } from "@/lib/types";
import EditDivisionForm from "./EditDivisionForm";

export const dynamic = "force-dynamic";

async function getDivisionsAdmin(): Promise<Division[]> {
  const client = await createInsForgeServerClient();
  const { data, error } = await client.database
    .from("divisions")
    .select()
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[divisions] list failed:", error);
    return [];
  }
  return (data ?? []) as Division[];
}

export default async function DivisionsPage() {
  const divisions = await getDivisionsAdmin();

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-deadpool-red text-canvas-black">
          <Boxes size={24} strokeWidth={2.5} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight text-deadpool-white">
            Divisi
          </h1>
          <p className="mt-1 font-mono text-sm text-deadpool-white/60">
            Edit deskripsi & palet warna 5 divisi yang tampil di halaman depan
          </p>
        </div>
      </div>

      {divisions.length === 0 ? (
        <div className="rounded-xl border border-slate-border bg-card-dark px-6 py-12 text-center shadow-comic">
          <p className="font-mono text-sm text-deadpool-white/40">
            {"// belum ada divisi — jalankan seed db/03_seed.sql di InsForge"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {divisions.map((division, i) => (
            <EditDivisionForm key={division.id} division={division} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
