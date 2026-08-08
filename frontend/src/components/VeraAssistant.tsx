"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";

import { ApiError, api } from "@/lib/api";
import { getToken } from "@/lib/auth";

type ChatRole = "user" | "assistant";

type ChatTurn = {
  id: string;
  role: ChatRole;
  content: string;
};

const WELCOME =
  "How can I help you? Ask me anything about VERA — emergencies, blood, shelters, donations, and more. I’ll keep it simple.";

function VeraMascot({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <ellipse cx="32" cy="58" rx="16" ry="3" fill="#0f172a" opacity="0.12" />
      <rect x="14" y="18" width="36" height="32" rx="12" fill="#dc2626" />
      <rect x="18" y="22" width="28" height="20" rx="8" fill="#fff7ed" />
      <circle cx="26" cy="32" r="3.5" fill="#0f172a" />
      <circle cx="38" cy="32" r="3.5" fill="#0f172a" />
      <circle cx="24.8" cy="30.8" r="1.1" fill="#ffffff" />
      <circle cx="36.8" cy="30.8" r="1.1" fill="#ffffff" />
      <path
        d="M26 38c2 2.4 10 2.4 12 0"
        stroke="#b91c1c"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="28" y="8" width="8" height="8" rx="2" fill="#f97316" />
      <rect x="30.5" y="4" width="3" height="5" rx="1.5" fill="#fb923c" />
      <circle cx="32" cy="3.5" r="2.2" fill="#fecaca" />
      <rect x="8" y="28" width="6" height="12" rx="3" fill="#b91c1c" />
      <rect x="50" y="28" width="6" height="12" rx="3" fill="#b91c1c" />
      <text
        x="32"
        y="48"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="7"
        fontWeight="700"
        fontFamily="var(--font-geist-sans), sans-serif"
      >
        V
      </text>
    </svg>
  );
}

export default function VeraAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([
    { id: "welcome", role: "assistant", content: WELCOME },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages, sending]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userTurn: ChatTurn = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };
    const assistantId = `a-${Date.now()}`;
    const history = [...messages, userTurn]
      .filter((m) => m.id !== "welcome")
      .slice(0, -1)
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userTurn, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setSending(true);

    let gotText = false;
    try {
      await api.assistantChatStream(
        {
          message: text,
          history,
          page_path: pathname,
        },
        (delta) => {
          gotText = true;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + delta } : m,
            ),
          );
        },
      );
      if (!gotText) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "I couldn’t generate a reply. Please try again." }
              : m,
          ),
        );
      }
    } catch (error) {
      const detail =
        error instanceof ApiError
          ? error.message
          : "Something went wrong talking to VERA Bot.";
      const hint =
        !getToken() && detail.toLowerCase().includes("credentials")
          ? " Sign in if your session expired."
          : "";
      const message = `${detail}${hint}`;
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: message } : m)),
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <section
          className="pointer-events-auto flex h-[min(32rem,70vh)] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10"
          aria-label="VERA Bot chat"
        >
          <header className="flex items-center gap-3 border-b border-red-100 bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 text-white">
            <div className="rounded-full bg-white/15 p-1">
              <VeraMascot className="h-10 w-10" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">VERA Bot</p>
              <p className="truncate text-xs text-red-50">Emergency response helper</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-white/90 hover:bg-white/15"
              aria-label="Close chat"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-3">
            {messages.map((message) => {
              const isStreamingPlaceholder =
                sending && message.role === "assistant" && message.content === "";
              return (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "rounded-br-md bg-red-600 text-white"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                    }`}
                  >
                    {isStreamingPlaceholder ? (
                      <span className="text-slate-500">Thinking…</span>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about emergencies, blood, shelters…"
                disabled={sending}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-red-500/30 placeholder:text-slate-400 focus:border-red-300 focus:ring-2 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="pointer-events-auto group relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg shadow-slate-900/15 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        aria-label={open ? "Close VERA Bot" : "Open VERA Bot"}
        aria-expanded={open}
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-red-400/30 [animation-duration:2.4s]" />
        <VeraMascot className="relative h-12 w-12 transition group-hover:scale-105" />
      </button>
    </div>
  );
}
