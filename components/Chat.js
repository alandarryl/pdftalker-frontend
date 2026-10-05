"use client";

import { useEffect, useRef, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Chat({ docId }) {
  const [messages, setMessages] = useState([]); // { role, text, sources, error }
  const [question, setQuestion] = useState("");
  const [llm, setLlm] = useState("gemini");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Modifie le dernier message (celui de l'assistant, en cours d'écriture)
  function updateLast(fn) {
    setMessages((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = fn(copy[copy.length - 1]);
      return copy;
    });
  }

  // Un bloc SSE ressemble à : "event: token\ndata: \"texte\""
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
      const res = await fetch(`${API}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_id: docId, question: q, chat_provider: llm }),
      });

      if (!res.ok) {
        let detail = `Erreur ${res.status}`;
        try {
          const body = await res.json();
          if (body.detail) detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
        } catch {}
        throw new Error(detail);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop(); // le dernier bloc est peut-être incomplet
        for (const block of blocks) handleBlock(block);
      }
    } catch (err) {
      updateLast((m) => ({ ...m, error: err.message }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">3. Poser une question</h2>
        <select
          value={llm}
          onChange={(e) => setLlm(e.target.value)}
          disabled={loading}
          className="rounded-lg border border-neutral-300 bg-transparent px-2 py-1 text-sm dark:border-neutral-700"
        >
          <option value="gemini">Réponse : Gemini</option>
          <option value="ollama">Réponse : Local (Ollama)</option>
        </select>
      </div>

      <div className="mt-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-neutral-500">
            Exemples : « De quoi parle ce document ? », « Que se passe-t-il au chapitre 3 ? »
          </p>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl bg-blue-600 px-4 py-2 text-sm text-white">{m.text}</p>
            </div>
          ) : (
            <div key={i} className="max-w-[95%]">
              <p className="whitespace-pre-wrap rounded-2xl bg-neutral-100 px-4 py-2 text-sm dark:bg-neutral-900">
                {m.text || (!m.error && loading && i === messages.length - 1 ? "…" : "")}
              </p>
              {m.error && <p className="mt-2 break-words text-sm text-red-600">{m.error}</p>}
              {m.sources?.length > 0 && (
                <details className="mt-2 text-xs text-neutral-500">
                  <summary className="cursor-pointer">
                    Sources : pages {[...new Set(m.sources.map((s) => s.page))].join(", ")}
                  </summary>
                  <ul className="mt-2 space-y-2">
                    {m.sources.map((s, k) => (
                      <li key={k} className="rounded-lg border border-neutral-200 p-2 dark:border-neutral-800">
                        <span className="font-medium">Page {s.page}</span> : {s.extract}…
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="mt-4 flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ta question…"
          maxLength={2000}
          className="flex-1 rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-neutral-700"
        />
        <button
          type="submit"
          disabled={!question.trim() || loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          Envoyer
        </button>
      </form>
    </section>
  );
}