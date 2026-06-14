import Head from 'next/head'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslation } from '@/locales'

const siteUrl = 'https://cmartinezs.github.io/claude-planning-with-ai/tutorials'

export default function TutorialsPage() {
  const t = useTranslation()

  return (
    <>
      <Head>
        <title>{t.tutorialsPage.meta.title}</title>
        <meta
          name="description"
          content={t.tutorialsPage.meta.description}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={siteUrl} />
      </Head>

      <Header />
      <main className="min-h-screen bg-surface">
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-brand-300 transition-colors mb-8"
              >
                <span aria-hidden="true">←</span>
                {t.tutorialsPage.back}
              </Link>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500 mb-4">
                {t.tutorialsPage.eyebrow}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold text-surface-50 text-balance">
                {t.tutorialsPage.title}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-surface-400 leading-relaxed max-w-3xl">
                {t.tutorialsPage.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/commands" className="btn-primary">
                  {t.tutorialsPage.commandsLink}
                </Link>
                <a
                  href="https://github.com/cmartinezs/claude-planning-with-ai/tree/master/planning-template/TUTORIAL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  {t.tutorialsPage.sourceLink}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-24 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {t.tutorialsPage.tutorials.map((tutorial) => (
                <article key={tutorial.id} className="glass-card-hover p-6 flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-semibold text-surface-50 leading-tight">
                      {tutorial.title}
                    </h2>
                    <span className="shrink-0 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono text-cyan-500">
                      {tutorial.id}
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                        {t.tutorialsPage.whenLabel}
                      </h3>
                      <p className="mt-1 text-sm text-surface-300 leading-relaxed">
                        {tutorial.when}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                        {t.tutorialsPage.outcomeLabel}
                      </h3>
                      <p className="mt-1 text-sm text-surface-300 leading-relaxed">
                        {tutorial.outcome}
                      </p>
                    </div>
                  </div>

                  <ol className="mt-5 space-y-2">
                    {tutorial.steps.map((step, index) => (
                      <li key={step} className="flex gap-3 text-sm text-surface-400 leading-relaxed">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-surface-600 bg-surface-900 font-mono text-xs text-brand-300">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {tutorial.commands.map((command) => (
                      <code
                        key={command}
                        className="rounded-md border border-surface-700 bg-surface-900/70 px-2 py-1 text-xs text-brand-300"
                      >
                        {command}
                      </code>
                    ))}
                  </div>

                  <a
                    href={`https://github.com/cmartinezs/claude-planning-with-ai/blob/master/${tutorial.source}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex text-sm text-surface-500 hover:text-surface-300 transition-colors"
                  >
                    {tutorial.source}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
