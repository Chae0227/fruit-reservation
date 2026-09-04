'use client'

import { motion } from 'framer-motion'

const EASE = [0.32, 0.72, 0, 1] as const

export function MotionReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function MotionStagger({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function MotionItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SpringPop({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      className={className}
    >
      {children}
    </motion.button>
  )
}
