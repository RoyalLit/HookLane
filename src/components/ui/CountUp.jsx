import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useTransform } from 'motion/react'

export default function CountUp({
  to,
  from = 0,
  _duration = 2,
  delay = 0,
  className = '',
  as: Component = 'span',
  style: extStyle,
}) {
  const ref = useRef(null)
  const motionValue = useMotionValue(from)
  const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 })
  const rounded = useTransform(springValue, (v) => Math.round(v))

  useEffect(() => {
    const timer = setTimeout(() => {
      motionValue.set(to)
    }, delay * 1000)
    return () => clearTimeout(timer)
  }, [to, delay, motionValue])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      if (ref.current) ref.current.textContent = latest.toLocaleString()
    })
    return unsubscribe
  }, [rounded])

  return <Component ref={ref} className={className} style={extStyle}>{from.toLocaleString()}</Component>
}
