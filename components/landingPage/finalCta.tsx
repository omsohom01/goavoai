'use client'

import * as React from 'react'
import Link from 'next/link'
import * as THREE from 'three'

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

export default function FinalCta() {
  const observerOptions = React.useMemo<IntersectionObserverInit>(
    () => ({ threshold: 0.25 }),
    []
  )
  const { ref, inView } = useInView<HTMLElement>(observerOptions)
  const bgHostRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!inView) return
    const host = bgHostRef.current
    if (!host) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    renderer.setClearColor(0x000000, 0)
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120)
    camera.position.set(-1.6, 1.05, 7.2)
    camera.lookAt(0.9, 0.35, 0)

    const ambient = new THREE.AmbientLight(0xffffff, 0.65)
    scene.add(ambient)
    const key = new THREE.DirectionalLight(0xffffff, 0.85)
    key.position.set(4, 3, 6)
    scene.add(key)

    const group = new THREE.Group()
    scene.add(group)

    const accentColor = 0x28ff7d
    const globeRadius = 1.7

    const globeGeometry = new THREE.SphereGeometry(globeRadius, 32, 18)
    const globeWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(globeGeometry),
      new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0.85 })
    )
    globeWire.position.set(2.4, 1.05, -0.2)
    globeWire.rotation.set(0.12, -0.38, 0.02)
    group.add(globeWire)

    const globeInner = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius * 0.985, 36, 24),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.03,
        roughness: 0.9,
        metalness: 0.0,
        emissive: 0x0ea5a4,
        emissiveIntensity: 0.25
      })
    )
    globeInner.position.copy(globeWire.position)
    globeInner.rotation.copy(globeWire.rotation)
    group.add(globeInner)

    const gridSize = 18
    const gridDivisions = 18
    const grid = new THREE.GridHelper(gridSize, gridDivisions, accentColor, accentColor)
    ;(grid.material as THREE.Material).transparent = true
    ;(grid.material as THREE.Material).opacity = 0.38
    grid.rotation.x = Math.PI / 2
    grid.position.set(0.6, -0.85, 0.25)
    group.add(grid)

    const gridPoints = new THREE.Points(
      new THREE.BufferGeometry(),
      new THREE.PointsMaterial({
        color: accentColor,
        size: 0.03,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6
      })
    )
    const pointPositions: number[] = []
    const step = gridSize / gridDivisions
    for (let x = -gridSize / 2; x <= gridSize / 2; x += step) {
      for (let z = -gridSize / 2; z <= gridSize / 2; z += step) {
        if (Math.random() > 0.13) continue
        pointPositions.push(x + 0.6, -0.85, z + 0.25)
      }
    }
    gridPoints.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(pointPositions, 3)
    )
    group.add(gridPoints)

    let mouseX = 0
    let mouseY = 0
    const onPointerMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      const x = (e.clientX - rect.left) / Math.max(1, rect.width)
      const y = (e.clientY - rect.top) / Math.max(1, rect.height)
      mouseX = (x - 0.5) * 2
      mouseY = (y - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    const setSize = () => {
      const rect = host.getBoundingClientRect()
      const w = Math.max(1, Math.floor(rect.width))
      const h = Math.max(1, Math.floor(rect.height))
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }

    const resizeObserver = new ResizeObserver(setSize)
    resizeObserver.observe(host)
    setSize()

    let raf = 0
    const clock = new THREE.Clock()
    const tick = () => {
      raf = window.requestAnimationFrame(tick)
      const t = clock.getElapsedTime()

      const targetYaw = mouseX * 0.22
      const targetPitch = -mouseY * 0.1
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetYaw, 0.05)
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetPitch, 0.05)

      globeWire.rotation.y += 0.0022
      globeInner.rotation.y += 0.002
      grid.position.y = -0.85 + Math.sin(t * 0.7) * 0.03

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      window.cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      renderer.dispose()
      globeGeometry.dispose()
      ;(globeWire.material as THREE.Material).dispose()
      ;(grid.material as THREE.Material).dispose()
      gridPoints.geometry.dispose()
      ;(gridPoints.material as THREE.Material).dispose()
      ;(globeInner.material as THREE.Material).dispose()
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement)
    }
  }, [inView])

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-transparent"
      aria-label="Final call to action"
    >
      <div ref={bgHostRef} aria-hidden="true" className="absolute inset-0">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 60% at 70% 35%, rgba(40,255,125,0.18) 0%, transparent 58%), radial-gradient(65% 55% at 20% 70%, rgba(14,165,164,0.14) 0%, transparent 58%)'
          }}
        />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full blur-[110px]"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--brand) 28%, transparent) 0%, transparent 70%)',
            opacity: 0.7
          }}
        />
        <div
          className="absolute -bottom-52 -left-52 h-[34rem] w-[34rem] rounded-full blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, rgba(16,185,129,0.16) 0%, transparent 70%)',
            opacity: 0.75
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.02))]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-12 lg:py-28">
        <div className="flex min-h-[22rem] max-w-2xl flex-col justify-center">
          <div
            className={[
              'transition-all duration-700 ease-out',
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            ].join(' ')}
          >
            <h2 className="font-clash text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Start creating events with Evexa
            </h2>
          </div>

          <div
            className={[
              'mt-5 max-w-xl transition-all duration-700 ease-out',
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            ].join(' ')}
            style={{ transitionDelay: '110ms' }}
          >
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Launch in minutes with clean workflows, precise control, and a seamless experience
              from invite to check-in.
            </p>
          </div>

          <div
            className={[
              'mt-8 flex flex-col gap-3 sm:flex-row sm:items-center transition-all duration-700 ease-out',
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            ].join(' ')}
            style={{ transitionDelay: '220ms' }}
          >
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-4 text-sm font-medium text-background shadow-sm transition duration-300 will-change-transform hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                Get Started
              </span>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="h-4 w-4 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              href="/#demo"
              className="inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-medium text-foreground/80 ring-1 ring-border/70 backdrop-blur-sm transition duration-300 hover:text-foreground hover:ring-border hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
