// components/ChatSection.js
"use client";

import { useEffect, useRef, useState } from "react";
import { streamChat } from "@/lib/api";

export default function ChatSection({ docId }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [llm, setLlm] = useState("gemini");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function updateLast(fn) {
    setMessages((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = fn(copy[copy.length - 1]);
      return copy;
    });
  }

  function handleBlock(block) {
    let event = "message";
    let data = "";
    for (const line of block.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) data += line.slice(5).trim();
    }
    if (!data) return;
    let payload;
    try {
      payload = JSON.parse(data);
    } catch {
      return;
    }
    if (event === "sources") updateLast((m) => ({ ...m, sources: payload }));
    else if (event === "token") updateLast((m) => ({ ...m, text: m.text + payload }));
    else if (event === "error") updateLast((m) => ({ ...m, error: String(payload) }));
  }

  async function send(e) {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;

    setQuestion("");
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: q },
      { role: "assistant", text: "", sources: [], error: "" },
    ]);

    try {
      await streamChat({
        docId,
        question: q,
        chatProvider: llm,
        onBlock: handleBlock,
      });
    } catch (err) {
      updateLast((m) => ({ ...m, error: err.message }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header Chat */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
          💬 Converser avec le document
        </h3>
        <select
          value={llm}
          onChange={(e) => setLlm(e.target.value)}
          disabled={loading}
          className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="gemini">Modèle : Gemini</option>
          <option value="ollama">Modèle : Local (Ollama)</option>
        </select>
      </div>

      {/* Zone de Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[350px] max-h-[500px]">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-neutral-400 py-10">
            <p className="text-sm">Posez n'importe quelle question sur le contenu de votre PDF.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button onClick={() => setQuestion("De quoi parle ce document ?")} className="rounded-full border border-neutral-200 px-3 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800">
                "De quoi parle ce document ?"
              </button>
              <button onClick={() => setQuestion("Résume les points clés.")} className="rounded-full border border-neutral-200 px-3 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800">
                "Résume les points clés."
              </button>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 rounded-bl-none"
              }`}
            >
              {m.text || (!m.error && loading && i === messages.length - 1 ? "Génération en cours..." : "")}
            </div>

            {m.error && <p className="mt-1 text-xs text-red-500">{m.error}</p>}

            {/* Sources Citations */}
            {m.sources?.length > 0 && (
              <details className="mt-2 text-xs text-neutral-500 max-w-[80%]">
                <summary className="cursor-pointer font-medium hover:text-neutral-700 dark:hover:text-neutral-300">
                  📍 Sources (pages {[...new Set(m.sources.map((s) => s.page))].join(", ")})
                </summary>
                <div className="mt-2 space-y-1.5">
                  {m.sources.map((s, k) => (
                    <div key={k} className="rounded-lg border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-950">
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">Page {s.page}</span> : {s.extract}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Chat */}
      <form onSubmit={send} className="border-t border-neutral-200 p-4 dark:border-neutral-800 flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Posez votre question..."
          disabled={loading}
          className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800/50 dark:focus:border-blue-500 transition-all"
        />
        <button
          type="submit"
          disabled={!question.trim() || loading}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40 transition-all"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}