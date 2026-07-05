import { motion } from 'motion/react'

export default function GradientText({
  children,
  from = '#FF6B35',
  via = '#FFB59D',
  to = '#FF6B35',
  className = '',
  as = 'h1',
  style: extStyle,
}) {
  const Tag = motion.create(as)
  return (
    <Tag
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        ...extStyle,
        backgroundImage: `linear-gradient(135deg, ${from}, ${via}, ${to})`,
        backgroundSize: '200% 200%',
      }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </Tag>
  )
}
