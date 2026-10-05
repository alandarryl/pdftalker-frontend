// app/page.js
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Element de fond lumineux */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-500/20 via-indigo-500/10 to-transparent blur-3xl" />

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
          ✨ Nouvelle version IA disponible
        </span>
        <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl text-neutral-900 dark:text-white">
          Transformez vos PDF en <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            conversations interactives
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          Uploadez vos documents volumineux et posez des questions instantanées. Choisissez entre le Cloud (Gemini) pour la vitesse ou le Local (Ollama) pour une confidentialité totale.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/app"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 active:scale-95 transition-all"
          >
            Commencer gratuitement
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              ⚡
            </div>
            <h3 className="mt-6 font-bold text-lg">Indexation Rapide</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Découpage intelligent en extraits clés pour une restitution précise des contextes en quelques secondes.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
              🔒
            </div>
            <h3 className="mt-6 font-bold text-lg">Mode Local & Cloud</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Basculez librement entre Gemini Cloud ou vos modèles locaux Ollama pour garder vos données privées.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400">
              📌
            </div>
            <h3 className="mt-6 font-bold text-lg">Citations des Sources</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Chaque réponse est accompagnée des numéros de pages exacts et des extraits originaux du PDF.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}