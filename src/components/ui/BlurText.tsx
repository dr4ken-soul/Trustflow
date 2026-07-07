import { motion, type Variants } from 'framer-motion'

interface BlurTextProps {
  text: string
  delay?: number
  className?: string
  /** split by word or char */
  splitBy?: 'word' | 'char'
}

/**
 * BlurText
 * splits text into words and animates each with a blur in
 * respects the spec pattern initial blur 10px opacity 0 y 50
 * animates to blur 0 opacity 1 y 0 with a stagger
 */
export function BlurText({
  text,
  delay = 0,
  className,
  splitBy = 'word',
}: BlurTextProps) {
  const tokens = splitBy === 'word' ? text.split(' ') : text.split('')

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: delay,
      },
    },
  }

  const childVariants: Variants = {
    hidden: {
      filter: 'blur(10px)',
      opacity: 0,
      y: 50,
    },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
      style={{ display: 'inline-block' }}
    >
      {tokens.map((token, i) => (
        <motion.span
          key={i}
          variants={childVariants}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {token}
          {splitBy === 'word' && i < tokens.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.span>
  )
}

export default BlurText
