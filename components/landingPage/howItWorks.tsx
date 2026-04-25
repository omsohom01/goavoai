'use client'

import * as React from 'react'

type Step = {
  number: 1 | 2 | 3
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    number: 1,
    title: 'Create Event',
    description:
      'Spin up a polished event in seconds—set capacity, RSVP mode, and key details with a guided flow.'
  },
  {
    number: 2,
    title: 'Share Page',
    description:
      'Publish a clean public page and share a single link. Attendees register in one smooth, branded experience.'
  },
  {
    number: 3,
    title: 'Manage Attendees',
    description:
      'Track registrations, approve or remove attendees, and message everyone from a real-time dashboard.'
  }
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function useSectionScrollPx(sectionRef: React.RefObject<HTMLElement | null>) {
  const [scrollPx, setScrollPx] = React.useState(0)

  React.useEffect(() => {
    let frame: number | null = null

    const update = () => {
      frame = null
      const node = sectionRef.current
      if (!node) return

      const rect = node.getBoundingClientRect()
      const viewportH = window.innerHeight || 1
      const total = Math.max(1, rect.height - viewportH)
      const progressed = clamp(-rect.top, 0, total)
      setScrollPx(progressed)
    }

    const onScroll = () => {
      if (frame != null) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame != null) window.cancelAnimationFrame(frame)
    }
  }, [sectionRef])

  return scrollPx
}

function circleStyle(visibleProgress: number) {
  const opacity = clamp(visibleProgress, 0, 1)
  const scale = 0.8 + 0.2 * opacity
  return {
    opacity,
    transform: `scale(${scale})`
  } as React.CSSProperties
}

export function HowItWorks() {
  const sectionRef = React.useRef<HTMLElement | null>(null)
  const scrollPx = useSectionScrollPx(sectionRef)

  const stepHoldPx = 240
  const adjustedScrollPx = Math.max(0, scrollPx - stepHoldPx)

  const reveal2 = clamp((adjustedScrollPx - 220) / 160, 0, 1)
  const reveal3 = clamp((adjustedScrollPx - 460) / 160, 0, 1)
  const lineProgress = clamp(adjustedScrollPx / 760, 0, 1)

  const activeStep =
    adjustedScrollPx >= 460 ? 3 : adjustedScrollPx >= 220 ? 2 : 1

  return (
    <section id="demo" ref={sectionRef} className="relative w-full bg-transparent">
      {/* Background video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <video
          className="absolute top-1/2 left-1/2 block h-auto w-auto min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover object-center"
          style={{ filter: 'saturate(0.95) contrast(1.02)', opacity: 0.18 }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/fearure-bg.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(70% 55% at 50% 20%, rgba(16, 185, 129, 0.16) 0%, transparent 65%)',
            opacity: 0.9
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1420px] px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-rustic text-5xl sm:text-6xl tracking-tight text-emerald-600">
            How It Works
          </h2>
          <p className="font-clash mt-5 text-base sm:text-lg leading-relaxed text-slate-600">
            A simple 3-step flow—from creation to operations—designed for teams that want clarity and control.
          </p>
        </div>
      </div>

      {/* Desktop / tablet: scroll-driven sticky storytelling */}
      <div className="relative z-10 hidden md:block">
        <div className="relative mx-auto w-full max-w-[1420px] px-6 pb-20 sm:px-10 lg:px-12">
          {/* scroll runway */}
          <div className="relative h-[240vh] lg:h-[260vh]">
            <div className="sticky top-0 flex h-screen items-start pt-16 lg:pt-20">
              <div className="grid w-full grid-cols-12 gap-10 lg:gap-14">
                {/* Timeline */}
                <div className="col-span-5 lg:col-span-4">
                  <div className="relative mt-6 flex h-[420px] items-start justify-center pt-10 lg:pt-12">
                    <div className="relative w-[120px]">
                      {/* line behind circles */}
                      <div className="absolute left-1/2 top-[28px] -translate-x-1/2">
                        <div className="h-[320px] w-[2px] bg-emerald-200/60" />
                        <div
                          className="absolute left-0 top-0 w-[2px] bg-emerald-500/70 transition-[height] duration-200 ease-in-out"
                          style={{ height: `${lineProgress * 320}px` }}
                        />
                      </div>

                      {/* circle 1 */}
                      <div className="relative flex flex-col items-center">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-white/80 text-emerald-700 shadow-[0_18px_50px_rgba(16,185,129,0.18)] backdrop-blur"
                          style={circleStyle(1)}
                        >
                          <span className="font-clash text-lg font-medium">1</span>
                        </div>

                        <div className="mt-[86px] flex flex-col items-center gap-[86px]">
                          <div
                            className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-white/80 text-emerald-700 shadow-[0_18px_50px_rgba(16,185,129,0.14)] backdrop-blur transition-[opacity,transform] duration-500"
                            style={{
                              ...circleStyle(reveal2),
                              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
                            }}
                          >
                            <span className="font-clash text-lg font-medium">2</span>
                          </div>

                          <div
                            className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-white/80 text-emerald-700 shadow-[0_18px_50px_rgba(16,185,129,0.12)] backdrop-blur transition-[opacity,transform] duration-500"
                            style={{
                              ...circleStyle(reveal3),
                              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
                            }}
                          >
                            <span className="font-clash text-lg font-medium">3</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="col-span-7 lg:col-span-8">
                  <div className="relative mx-auto max-w-xl mt-28">
                    {STEPS.map((step) => {
                      const isActive = step.number === activeStep
                      return (
                        <div
                          key={step.number}
                          className="absolute left-0 top-0 w-full transition-[opacity,transform] duration-500"
                          style={{
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? 'translateY(0px)' : 'translateY(10px)',
                            pointerEvents: isActive ? 'auto' : 'none',
                            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
                          }}
                        >
                          <p className="font-clash text-sm font-medium tracking-[0.18em] text-emerald-700/70 uppercase">
                            Step {step.number}
                          </p>
                          <h3 className="font-rustic mt-3 text-4xl leading-tight text-slate-900">
                            {step.title}
                          </h3>
                          <p className="font-clash mt-5 text-lg leading-relaxed text-slate-600">
                            {step.description}
                          </p>

                          <div className="mt-10 h-px w-full bg-emerald-200/60" />
                          <p className="font-clash mt-6 text-sm leading-relaxed text-slate-500">
                            Scroll to continue — the timeline draws and the story advances as you move.
                          </p>
                        </div>
                      )
                    })}
                    <div className="h-[260px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[10vh]" />
        </div>
      </div>

      {/* Mobile: stacked, clear, no sticky friction */}
      <div className="relative z-10 md:hidden">
        <div className="mx-auto w-full max-w-[1420px] px-6 pb-24 sm:px-10">
          <div className="mt-8 space-y-8">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-emerald-100 bg-white/70 p-6 shadow-[0_18px_55px_rgba(10,24,36,0.08)] backdrop-blur"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 shadow-[0_14px_40px_rgba(16,185,129,0.14)]">
                    <span className="font-clash text-base font-medium">{step.number}</span>
                  </div>
                  <div>
                    <p className="font-clash text-xs font-medium tracking-[0.2em] uppercase text-emerald-700/70">
                      Step {step.number}
                    </p>
                    <h3 className="font-rustic text-2xl text-slate-900">{step.title}</h3>
                  </div>
                </div>
                <p className="font-clash mt-4 text-base leading-relaxed text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
