import Head from 'next/head'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslation } from '@/locales'

const siteUrl = 'https://cmartinezs.github.io/claude-planning-with-ai/commands'

export default function CommandsPage() {
  const t = useTranslation()
  const commandCount = t.commandsPage.categories.reduce(
    (total, category) => total + category.commands.length,
    0,
  )

  return (
    <>
      <Head>
        <title>{t.commandsPage.meta.title}</title>
        <meta
          name="description"
          content={t.commandsPage.meta.description}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={siteUrl} />
      </Head>

      <Header />
      <main className="min-h-screen bg-surface">
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-brand-300 transition-colors mb-8"
              >
                <span aria-hidden="true">←</span>
                {t.commandsPage.back}
              </Link>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400 mb-4">
                {t.commandsPage.eyebrow}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold text-surface-50 text-balance">
                {commandCount} {t.commandsPage.title}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-surface-400 leading-relaxed max-w-3xl">
                {t.commandsPage.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/tutorials" className="btn-primary">
                  {t.commandsPage.tutorialsLink}
                </Link>
                <a
                  href="https://github.com/cmartinezs/claude-planning-with-ai/tree/master/skills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  {t.commandsPage.sourceLink}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-24 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="glass-card p-5">
                  <h2 className="text-sm font-semibold text-surface-200 uppercase tracking-wider mb-4">
                    {t.commandsPage.categoriesLabel}
                  </h2>
                  <nav className="space-y-2">
                    {t.commandsPage.categories.map((category) => (
                      <a
                        key={category.title}
                        href={`#${slugify(category.title)}`}
                        className="block rounded-lg px-3 py-2 text-sm text-surface-400 hover:bg-surface-700/60 hover:text-surface-100 transition-colors"
                      >
                        {category.title}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>

              <div className="space-y-10">
                {t.commandsPage.categories.map((category) => (
                  <section
                    key={category.title}
                    id={slugify(category.title)}
                    className="scroll-mt-28"
                  >
                    <div className="mb-5">
                      <h2 className="text-2xl md:text-3xl font-bold text-surface-50">
                        {category.title}
                      </h2>
                      <p className="mt-2 text-surface-400 leading-relaxed">
                        {category.description}
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {category.commands.map((command) => (
                        <article key={command.name} className="glass-card-hover p-5 md:p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                              <h3 className="font-mono text-xl font-semibold text-brand-300">
                                {command.name}
                              </h3>
                              <p className="mt-2 text-surface-300 leading-relaxed">
                                {command.description}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-full border border-surface-600 bg-surface-900/70 px-3 py-1 text-xs text-surface-500">
                              {command.source.replace('skills/', '')}
                            </span>
                          </div>

                          <div className="code-block mt-5 p-4">
                            <code className="text-sm text-brand-300">{command.usage}</code>
                          </div>

                          <ul className="mt-5 grid gap-2 md:grid-cols-3">
                            {command.details.map((detail) => (
                              <li
                                key={detail}
                                className="rounded-xl border border-surface-700/70 bg-surface-900/40 p-3 text-sm text-surface-400 leading-relaxed"
                              >
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
