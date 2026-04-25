'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'

function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = React.useRef<T | null>(null)
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node || inView) return

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
          break
        }
      }
    }, options)

    observer.observe(node)
    return () => observer.disconnect()
  }, [inView, options])

  return { ref, inView } as const
}

type FooterGroup = {
  title: string
  links: { label: string; href: string }[]
}

const GROUPS: FooterGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'How It Works', href: '/#demo' },
      { label: 'Templates', href: '/#templates' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/#about' },
      { label: 'Contact', href: '/#contact' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: '/#docs' },
      { label: 'Help', href: '/#help' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms', href: '/terms' }
    ]
  }
]

const SOCIAL = [
  { label: 'Twitter', href: 'https://x.com', Icon: FaTwitter },
  { label: 'GitHub', href: 'https://github.com', Icon: FaGithub },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: FaLinkedin }
] as const

export default function Footer() {
  const observerOptions = React.useMemo<IntersectionObserverInit>(
    () => ({ threshold: 0.18 }),
    []
  )
  const { ref, inView } = useInView<HTMLElement>(observerOptions)

  return (
    <footer
      ref={ref}
      className="relative isolate overflow-hidden bg-transparent"
      aria-label="Footer"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-52 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--brand) 18%, transparent) 0%, transparent 70%)',
            opacity: 0.75
          }}
        />
        <div
          className="absolute -bottom-72 -right-72 h-[40rem] w-[40rem] rounded-full blur-[130px]"
          style={{
            background:
              'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)',
            opacity: 0.8
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.02))]" />
      </div>

      <div
        className={[
          'relative mx-auto w-full max-w-[1400px] px-6 pt-20 sm:px-10 lg:px-12',
          'transition-all duration-700 ease-out',
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        ].join(' ')}
      >
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 hover:opacity-90">
              <span className="relative h-9 w-9 overflow-hidden rounded-xl invert">
                <Image src="/logo.png" alt="Evexa logo" fill sizes="36px" className="object-contain" />
              </span>
              <span className="font-rustic text-sm font-bold uppercase tracking-[0.22em] text-foreground">
                Evexa
              </span>
            </Link>

            <p className="mt-5 max-w-sm font-clash text-sm leading-relaxed text-muted-foreground">
              A modern, seamless way to plan, launch, and run eventsâ€”with the control teams need
              and the experience attendees love.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-3">
            {GROUPS.map((group) => (
              <div key={group.title}>
                <p className="font-clash text-sm font-semibold tracking-wide text-foreground/85">
                  {group.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-clash text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1 lg:justify-self-end">
            <p className="font-clash text-sm font-semibold tracking-wide text-foreground/85">
              Social
            </p>
            <div className="mt-4 flex items-center gap-3">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="group inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-border/70 backdrop-blur-sm transition duration-200 hover:ring-border hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Icon className="h-4 w-4 text-foreground/75 transition-colors duration-200 group-hover:text-foreground" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-foreground/10" aria-hidden="true" />

        <div className="relative pb-12 pt-10">
          <div
            className={[
              'absolute bottom-0 left-0 right-0 select-none overflow-hidden',
              'transition-all duration-900 ease-out',
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            ].join(' ')}
            style={{ transitionDelay: '120ms' }}
            aria-hidden="true"
          >
            <p
              className="font-rustic text-[4.6rem] leading-none tracking-tight text-foreground sm:text-[6.5rem] lg:text-[10rem]"
              style={{ opacity: 0.12 }}
            >
              Evexa
            </p>
          </div>

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="font-clash text-xs tracking-wide text-muted-foreground">
              © {new Date().getFullYear()} Evexa. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="font-clash text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="font-clash text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Terms
              </Link>
              <span className="hidden h-4 w-px bg-foreground/10 sm:inline" aria-hidden="true" />
              <span className="inline-flex items-center gap-2">
                <span className="relative h-6 w-6 overflow-hidden rounded-lg invert">
                  <Image
                    src="/logo.png"
                    alt=""
                    fill
                    sizes="24px"
                    className="object-contain"
                    aria-hidden="true"
                  />
                </span>
                <span className="font-clash text-xs text-foreground/75">Evexa</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

