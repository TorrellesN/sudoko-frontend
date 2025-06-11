import { motion } from 'framer-motion'

export default function gradientExample() {
  return (
    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500">
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl opacity-75"
        style={{
          background: 'linear-gradient(to bottom right, #ec4899, #8b5cf6, #3b82f6)',
          zIndex: -1,
        }}
        animate={{
          filter: [
            'drop-shadow(0 0 20px #ec4899) drop-shadow(0 0 40px #8b5cf6) drop-shadow(0 0 60px #3b82f6)',
            'drop-shadow(0 0 30px #ec4899) drop-shadow(0 0 50px #8b5cf6) drop-shadow(0 0 70px #3b82f6)',
            'drop-shadow(0 0 20px #ec4899) drop-shadow(0 0 40px #8b5cf6) drop-shadow(0 0 60px #3b82f6)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  )
}
