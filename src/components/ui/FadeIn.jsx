import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

export default function FadeIn({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.7,
  once = false,
  distance = 60,
  block = false,
  scale = false,
  style,
}) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const entryEnd = delay ? Math.min(0.18 + delay * 0.05, 0.35) : 0.18

  if (once) {
    const opacity = useTransform(scrollYProgress, [0, entryEnd], [0, 1])

    const y = useTransform(
      scrollYProgress,
      [0, entryEnd],
      direction === 'up' ? [distance, 0] : direction === 'down' ? [-distance, 0] : [0, 0]
    )

    const x = useTransform(
      scrollYProgress,
      [0, entryEnd],
      direction === 'left' ? [distance, 0] : direction === 'right' ? [-distance, 0] : [0, 0]
    )

    const s = useTransform(scrollYProgress, [0, entryEnd], scale ? [0.85, 1] : [1, 1])

    return (
      <motion.div
        ref={ref}
        className={className}
        style={{ ...(block ? { display: 'block' } : undefined), ...style, opacity, y, x, scale: s }}
      >
        {children}
      </motion.div>
    )
  }

  const opacity = useTransform(scrollYProgress, [0, entryEnd, 0.82, 1], [0, 1, 1, 0])

  const y = useTransform(
    scrollYProgress,
    [0, entryEnd, 1],
    direction === 'up' ? [distance, 0, 0] : direction === 'down' ? [-distance, 0, 0] : [0, 0, 0]
  )

  const x = useTransform(
    scrollYProgress,
    [0, entryEnd, 1],
    direction === 'left' ? [distance, 0, 0] : direction === 'right' ? [-distance, 0, 0] : [0, 0, 0]
  )

  const s = useTransform(scrollYProgress, [0, entryEnd, 1], scale ? [0.85, 1, 1] : [1, 1, 1])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...(block ? { display: 'block' } : undefined), ...style, opacity, y, x, scale: s }}
    >
      {children}
    </motion.div>
  )
}
