// Programs CMS (Proker / F04) — edit the descriptions of the 10 fixed programs.
//
// Server Component. Reads through the cookie-bound admin client so the page
// renders the live, authenticated view of the table. The programs are seeded
// once and never added/removed here — each row gets an EditProgramForm whose
// Save delegates to updateProgramAction in ./actions.ts. force-dynamic because
// the copy changes as the admin edits.

import { Briefcase } from "lucide-react";
import { createInsForgeServerClient } from "@/lib/insforge-server";
import type { Program } from "@/lib/types";
import EditProgramForm from "./EditProgramForm";

export const dynamic = "force-dynamic";

async function getProgramsAdmin(): Promise<Program[]> {
  const client = await createInsForgeServerClient();
  const { data, error } = await client.database
    .from("programs")
    .select()
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[programs] list failed:", error);
    return [];
  }
  return (data ?? []) as Program[];
}

export default async function ProgramsPage() {
  const programs = await getProgramsAdmin();

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-deadpool-red text-canvas-black">
          <Briefcase size={24} strokeWidth={2.5} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight text-deadpool-white">
            Program Kerja
          </h1>
          <p className="mt-1 font-mono text-sm text-deadpool-white/60">
            Edit deskripsi 10 program kerja yang tampil di halaman depan
          </p>
        </div>
      </div>

      {programs.length === 0 ? (
        <div className="rounded-xl border border-slate-border bg-card-dark px-6 py-12 text-center shadow-comic">
          <p className="font-mono text-sm text-deadpool-white/40">
            {"// belum ada program — jalankan seed db/03_seed.sql di InsForge"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {programs.map((program, i) => (
            <EditProgramForm key={program.id} program={program} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
