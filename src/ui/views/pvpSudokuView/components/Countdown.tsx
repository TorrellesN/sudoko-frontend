import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

type CountdownProps = {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    /*     sudokuId: SudokuPVP['id'];
        difficulty: SudokuPVP['difficulty']; */
}

export default function Countdown({ setIsLoading, /* sudokuId, difficulty */ }: CountdownProps) {
    const [countdown, setCountdown] = useState(3);
    const [isPulsing, setIsPulsing] = useState(false);

    const onCountdown = () => {
        // En lugar de cambiar isLoading inmediatamente, agregamos un retraso para el fade out
        setTimeout(() => {
            setIsLoading(false);
        }, 600); // Esperamos 600ms para que se complete la animación de fade out
    }

    const handleCountdown = () => {
        let count = countdown;
        const interval = setInterval(() => {
            if (count > 0) {
                setCountdown(count);
                // Activa la pulsación cada vez que el número cambia
                setIsPulsing(true);
                setTimeout(() => setIsPulsing(false), 300);
                count--;
            } else {
                clearInterval(interval);
                onCountdown();
            }
        }, 1000);

        return interval;
    }

    useEffect(() => {
        const interval = handleCountdown();

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            className="relative overflow-hidden w-full aspect-square rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]  lg:w-[700px] lg:h-[700px]
                rounded-full  border-100 border-[var(--primary-color)]/80  bg-[var(--primary-color)]/20
                blur-[30px] opacity-70 transition-transform duration-1000 
                ${isPulsing ? 'scale-110' : 'scale-90'}`}
            ></div>

            <div className='flex justify-center items-center flex-col gap-4 w-full aspect-square relative z-10'>
                <h2 className='text-xl font-bold text-center text-[var(--primary-text)] mb-2'>¡Todos listos!</h2>
                <h2 className="text-[var(--secondary-text)] text-lg">El sudoku va a comenzar en...</h2>
                <div className='flex justify-center items-center mt-6'>
                    <div className='flex justify-center items-center mt-6'>
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                                opacity: 1,
                                scale: isPulsing ? 1.25 : 1,
                                textShadow: isPulsing
                                    ? "0 0 15px rgba(255,255,255,0.8)"
                                    : "0 0 8px rgba(255,255,255,0.3)"
                            }}
                            transition={{
                                scale: { duration: 0.3 },
                                textShadow: { duration: 0.3 }
                            }}
                            className="text-9xl font-bold text-[var(--secondary-text)]"
                        >
                            {countdown > 0 ? countdown : '¡Ya!'}
                        </motion.h1>
                    </div>

                    
                </div>
            </div>
        </motion.div>
    )
}
