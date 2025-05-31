import { AnimatePresence, motion } from 'framer-motion';

type AnimatednumberProps = {
  value: number;
  className?: string;
};

export function AnimatedNumber({ value, className }: AnimatednumberProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.25 }}
        className={className}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}