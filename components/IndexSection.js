// components/IndexSection.js
"use client";

export default function IndexSection({ doc, provider, setProvider, onIndex, status, percent }) {
  const isRunning = status?.state === "running";

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">2</span>
        Préparation du document
      </h2>

      <div className="mt-3 rounded-lg bg-neutral-100 p-3 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
        <p className="font-semibold text-neutral-800 dark:text-neutral-100 truncate">{doc.filename}</p>
        <p className="mt-1">{doc.page_count} pages • {doc.chunk_count} morceaux de texte</p>
        {doc.warning && <p className="mt-1 text-amber-600 font-medium">{doc.warning}</p>}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {[
          ["gemini", "Cloud (Gemini)", "Rapide (~2 min)"],
          ["ollama", "Local (Ollama)", "Privé (~10 min)"],
        ].map(([val, label, hint]) => (
          <button
            key={val}
            type="button"
            disabled={isRunning}
            onClick={() => setProvider(val)}
            className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
              provider === val
                ? "border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/30"
                : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
            }`}
          >
            <span className="text-xs font-semibold">{label}</span>
            <span className="text-[10px] text-neutral-500 mt-0.5">{hint}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onIndex}
        disabled={isRunning}
        className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-500 disabled:opacity-40 transition-all"
      >
        {isRunning ? "Indexation en cours..." : "Lancer l'indexation"}
      </button>

      {isRunning && (
        <div className="mt-4 space-y-1.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${percent}%` }} />
          </div>
          <p className="text-right text-xs text-neutral-500">
            {status.done} / {status.total} morceaux ({percent}%)
          </p>
        </div>
      )}

      {status?.state === "error" && (
        <p className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-400">
          Échec : {status.error}
        </p>
      )}
    </div>
  );
}