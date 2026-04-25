'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

type ShapeKind = 'circle' | 'square'

type ShapeSpec = {
  id: string
  kind: ShapeKind
  size: number
  top: number
  left: number
  duration: number
  delay: number
  x1: number
  y1: number
  x2: number
  y2: number
  opacity: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function generateShapes(count: number): ShapeSpec[] {
  return Array.from({ length: count }).map((_, index) => {
    const kind: ShapeKind = Math.random() > 0.5 ? 'circle' : 'square'
    const size = Math.round(randomBetween(120, 260))

    return {
      id: `shape-${index}`,
      kind,
      size,
      top: randomBetween(6, 84),
      left: randomBetween(4, 92),
      duration: randomBetween(9, 16),
      delay: randomBetween(0, 2.2),
      x1: randomBetween(-120, 120),
      y1: randomBetween(-90, 90),
      x2: randomBetween(-120, 120),
      y2: randomBetween(-90, 90),
      opacity: randomBetween(0.55, 0.82)
    }
  })
}

export default function Shapes_background({ className }: { className?: string }) {
  const shapes = React.useMemo(() => {
    const count = Math.round(clamp(randomBetween(4, 6), 4, 6))
    return generateShapes(count)
  }, [])

  return (
    <div className={className} aria-hidden="true">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          initial={{ x: 0, y: 0, rotate: randomBetween(-8, 8) }}
          animate={{
            x: [0, shape.x1, shape.x2, 0],
            y: [0, shape.y1, shape.y2, 0],
            rotate: [0, randomBetween(-18, 18), randomBetween(-18, 18), 0]
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            position: 'absolute',
            top: `${shape.top}%`,
            left: `${shape.left}%`,
            width: shape.size,
            height: shape.size,
            borderRadius: shape.kind === 'circle' ? 9999 : 4,
            background:
              'linear-gradient(135deg, rgba(16,185,129,0.65) 0%, rgba(45,212,191,0.48) 50%, rgba(34,197,94,0.55) 100%)',
            border: '1px solid rgba(16,185,129,0.55)',
            opacity: shape.opacity,
            filter: 'blur(0px)',
            boxShadow: '0 28px 90px rgba(16, 185, 129, 0.45)',
            mixBlendMode: 'multiply'
          }}
        />
      ))}
    </div>
  )
}
