// components/UploadSection.js
"use client";

import { useState } from "react";

export default function UploadSection({ onUpload, busy }) {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) onUpload(file);
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">1</span>
        Charger un fichier PDF
      </h2>

      <form onSubmit={handleSubmit} className="mt-4">
        <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50/50 p-4 text-center hover:bg-neutral-100/50 dark:border-neutral-700 dark:bg-neutral-950/50 dark:hover:bg-neutral-900 transition-all">
          <svg className="h-8 w-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="mt-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {file ? file.name : "Cliquez ou glissez-déposez un PDF ici"}
          </span>
          <span className="text-xs text-neutral-400 mt-1">PDF uniquement</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
        </label>

        <button
          type="submit"
          disabled={!file || busy}
          className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-500 disabled:opacity-40 transition-all"
        >
          {busy ? "Téléversement en cours..." : "Envoyer le document"}
        </button>
      </form>
    </div>
  );
}