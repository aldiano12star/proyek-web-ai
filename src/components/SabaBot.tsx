"use client";

// SabaBot floating chat widget (Phase 5).
//
// Bottom-right bubble that expands into a chat panel. Stateless on the client's
// side of persistence: the running transcript lives in component state and is
// POSTed to /api/chat, which injects the persona and returns one reply. Framer
// Motion drives the open/close + message-entry animations. Deadpool theme
// (red/black) to match the rest of the site.

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Bot } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content:
    "Yo! Gue SabaBot — asisten IT-nya Sapa Exploit. Mau nanya soal coding, design, atau audio-visual? Tembak aja, gue nggak gigit… biasanya.",
};

export default function SabaBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the latest message in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Focus the input when the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Drop the canned greeting; only send real turns to the model.
        body: JSON.stringify({ messages: next.slice(1) }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        throw new Error(data.error ?? "Gagal mengambil balasan.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply! },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="flex h-[30rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-border bg-card-dark shadow-comic"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-border bg-canvas-black px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-deadpool-red text-canvas-black">
                <Bot size={20} strokeWidth={2.5} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-black tracking-tight text-deadpool-white">
                  SabaBot
                </p>
                <p className="font-mono text-[11px] uppercase tracking-widest text-deadpool-white/40">
                  IT mentor • online
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup chat"
                className="rounded-lg p-1.5 text-deadpool-white/50 transition hover:bg-deadpool-white/5 hover:text-deadpool-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-deadpool-red text-canvas-black"
                        : "rounded-bl-sm border border-slate-border bg-canvas-black text-deadpool-white"
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-slate-border bg-canvas-black px-3.5 py-3">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-deadpool-white/60"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: d * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-deadpool-red/40 bg-deadpool-red/10 px-3 py-2 text-xs text-deadpool-white"
                >
                  {error}
                </p>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-slate-border bg-canvas-black p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  maxLength={4000}
                  placeholder="Tanya SabaBot…"
                  className="flex-1 rounded-lg border border-slate-border bg-card-dark px-3.5 py-2.5 text-sm text-deadpool-white outline-none transition placeholder:text-deadpool-white/30 focus:border-deadpool-red"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  aria-label="Kirim pesan"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-deadpool-red text-canvas-black transition hover:-translate-y-0.5 hover:shadow-comic disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  <Send size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle bubble */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Tutup SabaBot" : "Buka SabaBot"}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-canvas-black bg-deadpool-red text-canvas-black shadow-comic"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? (
              <X size={24} strokeWidth={2.5} />
            ) : (
              <MessageCircle size={24} strokeWidth={2.5} />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
