const footerLinks = [
  {
    title: 'Plugin',
    links: [
      { label: 'GitHub', href: 'https://github.com/cmartinezs/claude-planning-with-ai' },
      { label: 'Instalación', href: '#instalacion' },
      { label: 'Comandos', href: '#comandos' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Documentación', href: 'https://github.com/cmartinezs/claude-planning-with-ai' },
      { label: 'Claude Code', href: 'https://docs.anthropic.com/en/docs/claude-code/overview' },
    ],
  },
  {
    title: 'Autor',
    links: [
      { label: 'cmartinezs', href: 'https://github.com/cmartinezs' },
      { label: 'Contacto', href: 'mailto:carlos.f.martinez.s@gmail.com' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-surface-700/50 bg-surface-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <span className="text-xl">📋</span>
              <span className="text-lg font-bold text-surface-50">
                Planning with AI
              </span>
            </a>
            <p className="text-sm text-surface-500 leading-relaxed max-w-xs">
              Plugin de planificación estructurada para Claude Code.
              Construye proyectos con orden y claridad.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-4">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-surface-500 hover:text-surface-300 transition-colors"
                      {...(link.href.startsWith('http') || link.href.startsWith('mailto')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-600">
            &copy; {new Date().getFullYear()} Planning with AI. Hecho con{' '}
            <span className="text-brand-400">♥</span> para la comunidad de Claude.
          </p>
          <p className="text-sm text-surface-600 font-mono">
            v{require('../package.json').version}
          </p>
        </div>
      </div>
    </footer>
  )
}
