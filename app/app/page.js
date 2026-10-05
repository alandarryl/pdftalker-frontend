// app/app/page.js
"use client";

import { useState, useEffect } from "react";
import UploadSection from "@/components/UploadSection";
import IndexSection from "@/components/IndexSection";
import ChatSection from "@/components/ChatSection";
import { uploadDocument, startIndexation, getStatus } from "@/lib/api";

export default function WorkspacePage() {
  const [doc, setDoc] = useState(null);
  const [provider, setProvider] = useState("gemini");
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file) => {
    setBusy(true);
    setError("");
    setDoc(null);
    setStatus(null);
    try {
      const data = await uploadDocument(file);
      setDoc(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleIndex = async () => {
    setError("");
    try {
      const res = await startIndexation(doc.id, provider);
      setStatus(res);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!doc || status?.state !== "running") return;
    const timer = setInterval(async () => {
      try {
        const res = await getStatus(doc.id);
        setStatus(res);
      } catch (err) {
        setError(err.message);
      }
    }, 1500);
    return () => clearInterval(timer);
  }, [doc, status?.state]);

  const percent = status?.total ? Math.round((status.done / status.total) * 100) : 0;

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Colonne Gauche : Config & Upload */}
        <div className="space-y-6 lg:col-span-4">
          <UploadSection onUpload={handleUpload} busy={busy} />
          {doc && (
            <IndexSection
              doc={doc}
              provider={provider}
              setProvider={setProvider}
              onIndex={handleIndex}
              status={status}
              percent={percent}
            />
          )}
        </div>

        {/* Colonne Droite : Workspace Chat */}
        <div className="lg:col-span-8">
          {status?.state === "done" ? (
            <ChatSection docId={doc.id} />
          ) : (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white/50 text-center dark:border-neutral-800 dark:bg-neutral-900/20">
              <div className="rounded-full bg-neutral-100 p-4 dark:bg-neutral-800">
                📄
              </div>
              <p className="mt-3 font-medium text-neutral-600 dark:text-neutral-400">
                Chargez et indexez un document PDF pour débloquer le Chat.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}