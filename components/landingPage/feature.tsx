
'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import ScrollStack, { ScrollStackItem } from '../ScrollStack'
import Shapes_background from '../Shapes_background'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const features = [
  {
    title: 'Effortless Event Creation',
    description:
      'Create and launch events in seconds with a streamlined workflow. Start from scratch or use smart templates to quickly define your event, set capacity, and go live with confidence.',
    lottiePath: '/Animations/Event_creation.json'
  },
  {
    title: 'Smart RSVP System',
    description:
      'Control how attendees join your events with flexible RSVP modes. Accept registrations instantly or review and approve participants manually while keeping capacity perfectly managed.',
    lottiePath: '/Animations/attendee-flow.json'
  },
  {
    title: 'Real-Time Event Dashboard',
    description:
      'Stay in complete control with a unified dashboard. Track registrations, manage attendees, and update event status in real time with a clean, intuitive interface.',
    lottiePath: '/Animations/dashboard-live.json'
  },
  {
    title: 'Shareable Public Event Pages',
    description:
      'Every event gets a dedicated public page with a seamless registration experience. Share your event instantly and keep attendees informed with live status updates.',
    lottiePath: '/Animations/page-share-visitor.json'
  },
  {
    title: 'Automated Email Notifications',
    description:
      'Keep everyone in sync with smart notifications. From registration confirmations to approvals and updates, Evexa ensures timely and reliable communication.',
    lottiePath: '/Animations/Email-notification.json'
  },
  {
    title: 'Intelligent Capacity Control',
    description:
      'Avoid overbooking with built-in capacity rules. Automatically manage limits, block registrations when full, and free up space when attendees are removed.',
    lottiePath: '/Animations/lock-animation.json'
  }
]

interface FeatureLottieProps {
  path: string
}

const FeatureLottie: React.FC<FeatureLottieProps> = ({ path }) => {
  const [animationData, setAnimationData] = useState<object | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadAnimation = async () => {
      if (!path) {
        setAnimationData(null)
        return
      }

      try {
        const response = await fetch(path)
        if (!response.ok) {
          throw new Error(`Failed to load lottie: ${response.status}`)
        }
        const json = await response.json()
        if (isMounted) {
          setAnimationData(json)
        }
      } catch {
        if (isMounted) {
          setAnimationData(null)
        }
      }
    }

    loadAnimation()

    return () => {
      isMounted = false
    }
  }, [path])

  useEffect(() => {
    const node = containerRef.current
    if (!node || hasStarted || !path) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasStarted(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.35 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasStarted, path, animationData])

  return (
    <div ref={containerRef} className="feature-card-lottie-slot" aria-hidden={!path}>
      {hasStarted && animationData ? (
        <Lottie animationData={animationData} loop={false} autoplay />
      ) : null}
    </div>
  )
}

export const Feature = () => {
  const [useWindowScroll, setUseWindowScroll] = React.useState(true)

  useEffect(() => {
    const smallMql = window.matchMedia('(max-width: 640px)')
    const mediumMql = window.matchMedia('(max-width: 900px)')
    const updateMode = () => {
      if (smallMql.matches) {
        setUseWindowScroll(true)
        return
      }

      if (mediumMql.matches) {
        setUseWindowScroll(false)
        return
      }

      setUseWindowScroll(true)
    }

    updateMode()
    smallMql.addEventListener('change', updateMode)
    mediumMql.addEventListener('change', updateMode)
    return () => {
      smallMql.removeEventListener('change', updateMode)
      mediumMql.removeEventListener('change', updateMode)
    }
  }, [])

  return (
    <section className="feature-section">
      <div className="feature-video-bg" aria-hidden="true">
        <video
          className="feature-video-bg__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/fearure-bg.mp4" type="video/mp4" />
        </video>
      </div>
      {/* <Shapes_background className="feature-shapes-bg" /> */}
      <div className="feature-section-inner">
        <div className="feature-header mt-3">
          <h2 className="feature-title">Features</h2>
          <p className="feature-description">
            Everything you need to create, manage, and scale modern events with confidence.
          </p>
        </div>
        <ScrollStack
          className="feature-scroll-stack"
          useWindowScroll={useWindowScroll}
          stackPosition="18%"
          scaleEndPosition="12%"
          itemDistance={92}
          endSpacer={90}
        >
          {features.map((feature, index) => (
            <ScrollStackItem key={feature.title} itemClassName="feature-card">
              <div className="feature-card-grid">
                <div className="feature-card-content">
                  <p className="feature-card-index">0{index + 1}</p>
                  <h3 className="feature-card-title">{feature.title}</h3>
                  <p className="feature-card-description">{feature.description}</p>
                </div>
                <div className="feature-card-divider" aria-hidden="true" />
                <div className="feature-card-media">
                  <FeatureLottie path={feature.lottiePath} />
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  )
}
