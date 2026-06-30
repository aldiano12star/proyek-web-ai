"use client";

// Terminal Easter Egg — "Mode Peretas" (Phase 6).
//
// Hidden hacker overlay. Type the secret sequence "SABA" anywhere on the public
// page (outside form fields) to flip the Deadpool Bento UI into a jet-black,
// neon-green CLI. A small functional shell exposes `help`, `about`, and `exit`.
//
// Deliberately OFF-palette: the rest of the site is red/black, but the terminal
// is the classic phosphor-green-on-black look (#00FF00) to feel like a separate
// "system" you broke into. Font is JetBrains Mono via the `font-mono` token.

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// The keystroke sequence that opens the terminal (case-insensitive).
const TRIGGER = "saba";

const BANNER = [
  "  ____    _    ____    _    ",
  " / ___|  / \\  | __ )  / \\   ",
  " \\___ \\ / _ \\ |  _ \\ / _ \\  ",
  "  ___) / ___ \\| |_) / ___ \\ ",
  " |____/_/   \\_\\____/_/   \\_\\",
  "",
  "SabaOS v2.6 — Saba Cyber Community // SMA Negeri 1 Bantul",
  'Akses diberikan. Ketik "help" untuk daftar perintah.',
  "",
];

// Output for `about` — hacker-style lore since the club's founding in 2006.
const ABOUT = [
  "> booting historical record ...........[OK]",
  "",
  "  SAPA EXPLOIT — est. 2006",
  "  ------------------------------------------",
  "  2006 :: Beberapa siswa SMAN 1 Bantul nge-fork hobi jadi komunitas.",
  "          Misi: kuasai kode, design, dan audio-visual sebelum lulus.",
  "  20xx :: Lima divisi online — Photography, Design, Programming,",
  "          Technopreneurship, Cinematography. Semua node aktif.",
  "  now  :: Masih ngoprek, masih juara, masih nerima anak baru.",
  "",
  "  > status: ONLINE  |  newbies: WELCOME  |  exploit: ON",
  "",
];

type Line = { id: number; text: string };

export default function TerminalMode() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Rolling buffer of recent keystrokes, used to detect the TRIGGER sequence.
  const bufferRef = useRef("");
  // Monotonic id so React keys stay stable as lines stream in.
  const lineId = useRef(0);

  // ---- Global trigger listener -------------------------------------------
  // Watches keystrokes for "SABA". CRITICAL: ignore events originating from
  // text fields so typing in the SabaBot chat or any admin form never trips it.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (open) return; // already open — terminal owns the keyboard now

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Only single printable characters extend the sequence.
      if (e.key.length !== 1) return;

      bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(
        -TRIGGER.length,
      );

      if (bufferRef.current === TRIGGER) {
        bufferRef.current = "";
        boot();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // `open` is read inside the handler; re-bind when it flips so the early
    // return stays correct.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ---- Lifecycle side effects --------------------------------------------
  // Lock body scroll while the overlay is up; focus the prompt on open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Keep the newest line in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  // ---- Terminal helpers ---------------------------------------------------
  function print(text: string | string[]) {
    const arr = Array.isArray(text) ? text : [text];
    setLines((prev) => [
      ...prev,
      ...arr.map((t) => ({ id: lineId.current++, text: t })),
    ]);
  }

  function boot() {
    lineId.current = 0;
    setLines(BANNER.map((t) => ({ id: lineId.current++, text: t })));
    setInput("");
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setLines([]);
    setInput("");
  }

  function runCommand(raw: string) {
    const cmd = raw.trim().toLowerCase();
    // Echo the prompt + what the user typed.
    print(`guest@saba:~$ ${raw}`);

    switch (cmd) {
      case "":
        break;
      case "help":
        print([
          "Perintah yang tersedia:",
          "  help   — tampilkan daftar perintah ini",
          "  about  — riwayat singkat Sapa Exploit sejak 2006",
          "  exit   — tutup terminal, balik ke mode normal",
          "",
          "Tip: tekan Esc kapan aja buat keluar.",
        ]);
        break;
      case "about":
        print(ABOUT);
        break;
      case "exit":
        close();
        return;
      default:
        print(`saba: command not found: ${cmd} — coba "help".`);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    runCommand(input);
    setInput("");
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          // z-[100] sits above the SabaBot bubble (z-50). Green-on-black, mono.
          className="fixed inset-0 z-[100] bg-black font-mono text-[#00FF00]"
          role="dialog"
          aria-modal="true"
          aria-label="Terminal Mode Peretas"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex h-full flex-col p-4 text-sm leading-relaxed sm:p-6">
            {/* Scrollback */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto whitespace-pre-wrap break-words [text-shadow:0_0_6px_rgba(0,255,0,0.45)]"
            >
              {lines.map((line) => (
                <div key={line.id}>{line.text || " "}</div>
              ))}
            </div>

            {/* Prompt */}
            <form onSubmit={onSubmit} className="mt-2 flex items-center gap-2">
              <span className="shrink-0 [text-shadow:0_0_6px_rgba(0,255,0,0.45)]">
                guest@saba:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Input perintah terminal"
                className="flex-1 bg-transparent text-[#00FF00] caret-[#00FF00] outline-none [text-shadow:0_0_6px_rgba(0,255,0,0.45)]"
              />
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
