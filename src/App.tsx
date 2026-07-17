import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  MessageCircle,
  Trash2,
  Bot,
  User,
  Sparkles,
  Loader2,
} from "lucide-react";
import { supabase } from "./supabaseClient";
import {
  defaultKnowledge,
  categoryColors,
  type KnowledgeEntry,
  type ChatMessage,
} from "./knowledge";

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 1),
  );
}

function findBestAnswer(query: string, kb: KnowledgeEntry[]): { answer: string; category: string } | null {
  const queryTokens = tokenize(query);
  if (queryTokens.size === 0) return null;

  let bestScore = 0;
  let bestEntry: KnowledgeEntry | null = null;

  for (const entry of kb) {
    const entryTokens = tokenize(entry.question + " " + entry.category);
    let score = 0;
    for (const token of queryTokens) {
      if (entryTokens.has(token)) score++;
    }
    // Normalize by query length to favor coverage
    const normalized = score / queryTokens.size;
    if (normalized > bestScore) {
      bestScore = normalized;
      bestEntry = entry;
    }
  }

  if (bestScore < 0.15) return null;
  return { answer: bestEntry!.answer, category: bestEntry!.category };
}

const SUGGESTED_PROMPTS = [
  "What is your return policy?",
  "How long does shipping take?",
  "How do I reset my password?",
  "What payment methods do you accept?",
];

const WELCOME_TEXT =
  "Hi there! I'm your customer service assistant. Ask me about shipping, returns, payments, your account, or anything else — I'm here to help!";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("id, role, text, created_at")
        .order("created_at", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("Failed to load chat history:", error.message);
        const welcome: ChatMessage = {
          id: "welcome",
          role: "bot",
          text: WELCOME_TEXT,
          timestamp: new Date().toISOString(),
        };
        setMessages([welcome]);
      } else if (!data || data.length === 0) {
        const welcome: ChatMessage = {
          id: "welcome",
          role: "bot",
          text: WELCOME_TEXT,
          timestamp: new Date().toISOString(),
        };
        setMessages([welcome]);
      } else {
        setMessages(
          data.map((row) => ({
            id: row.id,
            role: row.role as "user" | "bot",
            text: row.text,
            timestamp: row.created_at,
          })),
        );
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const persistMessage = useCallback(async (role: "user" | "bot", text: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({ role, text })
      .select("id, created_at")
      .maybeSingle();
    if (error || !data) {
      console.error("Failed to save message:", error?.message ?? "no data");
      return null;
    }
    return data.id;
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || typing) return;

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        text: trimmed,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setTyping(true);

      const persistedId = await persistMessage("user", trimmed);
      if (persistedId) {
        setMessages((prev) =>
          prev.map((m) => (m.id === userMsg.id ? { ...m, id: persistedId } : m)),
        );
      }

      const match = findBestAnswer(trimmed, defaultKnowledge as KnowledgeEntry[]);

      window.setTimeout(async () => {
        let botText: string;
        if (match) {
          botText = match.answer;
        } else {
          botText =
            "I'm not sure I have an exact answer for that. Try asking about shipping, returns, payments, your account, or contact our human support team at support@example.com / 1-800-555-0199.";
        }

        const botMsg: ChatMessage = {
          id: `b-${Date.now()}`,
          role: "bot",
          text: botText,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setTyping(false);

        const botPersistedId = await persistMessage("bot", botText);
        if (botPersistedId) {
          setMessages((prev) =>
            prev.map((m) => (m.id === botMsg.id ? { ...m, id: botPersistedId } : m)),
          );
        }
      }, 800);
    },
    [typing, persistMessage],
  );

  const clearChat = useCallback(async () => {
    const { error } = await supabase.from("chat_messages").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) {
      console.error("Failed to clear chat:", error.message);
      return;
    }
    const welcome: ChatMessage = {
      id: "welcome",
      role: "bot",
      text: WELCOME_TEXT,
      timestamp: new Date().toISOString(),
    };
    setMessages([welcome]);
  }, []);

  const showSuggestions = messages.length <= 1;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-6 sm:py-10">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <main className="relative z-10 flex h-[85vh] max-h-[760px] w-full max-w-2xl flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 rounded-t-3xl border border-b-0 border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 shadow-lg shadow-sky-500/25">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold text-white">Support Assistant</h1>
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              Online · Typically replies instantly
            </p>
          </div>
          <button
            onClick={clearChat}
            title="Clear conversation"
            className="rounded-full p-2 text-slate-400 transition-all duration-300 hover:bg-white/10 hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto border-x border-white/10 bg-white/5 px-4 py-6 backdrop-blur-xl sm:px-6"
        >
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
              <p className="text-sm text-slate-500">Loading conversation...</p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {typing && (
                <div className="flex items-end gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-500">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-white/10 bg-white/10 px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                  </div>
                </div>
              )}

              {showSuggestions && !typing && (
                <div className="pt-2">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Sparkles className="h-3.5 w-3.5" />
                    Suggested questions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => {
                          sendMessage(prompt);
                          inputRef.current?.focus();
                        }}
                        className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300 transition-all duration-300 hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-sky-200"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2 rounded-b-3xl border border-t-0 border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl sm:px-6"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-sky-400/50 focus:bg-white/10"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:brightness-110 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </main>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-slate-700"
            : "bg-gradient-to-br from-sky-500 to-emerald-500"
        }`}
      >
        {isUser ? <User className="h-4 w-4 text-slate-300" /> : <Bot className="h-4 w-4 text-white" />}
      </div>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-gradient-to-br from-sky-600 to-sky-700 text-white"
            : "rounded-bl-sm border border-white/10 bg-white/10 text-slate-100"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
