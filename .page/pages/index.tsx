import { useState, useCallback, useEffect } from 'react'
import Head from 'next/head'
import SplashScreen from '@/components/SplashScreen'
import Header from '@/components/Header'
import Installation from '@/components/Installation'
import Hero from '@/components/Hero'
import WhatItDoes from '@/components/WhatItDoes'
import Lifecycle from '@/components/Lifecycle'
import Commands from '@/components/Commands'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

const siteUrl = 'https://cmartinezs.github.io/claude-planning-with-ai'
const siteName = 'Planning with AI — Plugin de planificación para Claude Code'
const description =
  'Plugin de planificación estructurada para Claude Code. Ciclo de vida completo: idea, expansión, ejecución, finalización y archivo. Gestión de backlog, épicas y scopes.'

export default function Home() {
  const [splashDone, setSplashDone] = useState(false)
  const handleDismiss = useCallback(() => setSplashDone(true), [])

  useEffect(() => {
    if (splashDone) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [splashDone])

  return (
    <>
      <Head>
        <title>{siteName}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={siteName} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="Planning with AI" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteName} />
        <meta name="twitter:description" content={description} />

        <link rel="canonical" href={siteUrl} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Planning with AI',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Linux, macOS, Windows',
              description: description,
              author: {
                '@type': 'Person',
                name: 'cmartinezs',
                email: 'carlos.f.martinez.s@gmail.com',
                url: 'https://cmartinezs.github.io',
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
      </Head>

      {!splashDone && <SplashScreen onDismiss={handleDismiss} />}

      <Header />
      <main>
        <Hero />
        <Installation />
        <WhatItDoes />
        <Lifecycle />
        <Commands />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
