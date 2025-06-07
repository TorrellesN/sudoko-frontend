import { ArrowLongRightIcon } from '@heroicons/react/20/solid'
import { motion } from 'framer-motion'
import { Dispatch, useContext } from 'react'
import { ThemeContext } from '../../../../application/context/themeContext';
import { useGameFinishView } from '../useGameFinishView';
import { useAppStore } from '../../../../application/store/useAppStore';

export default function WinTitle({ setShowDetails, win }: { setShowDetails: Dispatch<React.SetStateAction<boolean>>, win: boolean }) {
    const { theme } = useContext(ThemeContext);
    
    return (
        <div className='container flex flex-col items-center sm:items-end justify-center mx-auto w-full max-w-screen-xl min-h-screen '>

            <div className=' container px-0.5 sm:px-6 md:px-18 py-12 gap-6 z-5 max-w-2xl'>
                <motion.div
                    className="flex flex-col items-center rounded-xl mx-auto relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 1.2,
                        delay: 0.5,
                        ease: [0, 0.71, 0.2, 1.01]
                    }}
                    style={{
                        background: `linear-gradient(to bottom, 
              rgba(255,255,255,0) 0%, 
              ${theme === 'light' ? 'rgba(255,255,255,0.5)' : 'rgba(21, 28, 37,0.5)'} 50%, 
              ${theme === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(21, 28, 37,1)'} 100%)`,
                        backdropFilter: 'blur(2px)',
                        WebkitBackdropFilter: 'blur(2px)',
                    }} >
                    <motion.div
                        className="flex flex-col items-start h-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.5,
                            ease: "easeOut"
                        }}
                    >
                        <motion.h1
                            className="text-5xl font-bold pt-22 pb-3 italic"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.6
                            }}
                        >
                            ¡Has
                        </motion.h1>
                        {win
                            ? <motion.h1
                                className={`text-7xl font-black pt-1 pb-12 italic bg-gradient-to-tr from-red-600 via-orange-500 to-yellow-500 text-transparent bg-clip-text 
                    ${theme === 'light' ? 'drop-shadow-[0_0_10px_rgba(284,120,21,0.5)]' : 'drop-shadow-[0_0_10px_rgba(1,1,1,0.4)]'}`}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    duration: 0.7,
                                    delay: 1.0,
                                    type: "spring",
                                    stiffness: 100
                                }}
                            >
                                Ganado!
                            </motion.h1>
                            : <motion.h1
                                className={`text-7xl font-black pt-1 pb-12 italic bg-gradient-to-tr from-cyan-700 via-teal-600 to-teal-400 text-transparent bg-clip-text
                    ${theme === 'light' ? 'drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]' : 'drop-shadow-[0_0_10px_rgba(1,1,1,0.4)]'}`}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    duration: 0.7,
                                    delay: 1.0,
                                    type: "spring",
                                    stiffness: 100
                                }}
                            >
                                Perdido!
                            </motion.h1>
                        }

                    </motion.div>
                    <motion.button
                        className="btn-md bg-blue-gradient flex flex-row gap-2 items-center justify-center mb-8"
                        onClick={() => setShowDetails(true)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: 1.2,
                            type: "spring",
                            stiffness: 300
                        }}
                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Siguiente
                        <ArrowLongRightIcon className="h-6 w-6 text-[var(--color-dark)] mt-0.4" />
                    </motion.button>
                </motion.div>
            </div>
        </div>
    )
}
