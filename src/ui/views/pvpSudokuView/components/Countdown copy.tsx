import React, { useEffect, useState } from 'react'
import { SudokuPVP } from '../../../../domain';
import { motion, useAnimation, useAnimationFrame } from 'framer-motion';

type CountdownProps = {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    sudokuId: SudokuPVP['id'];
    difficulty: SudokuPVP['difficulty'];
}

export default function Countdown({ setIsLoading, sudokuId, difficulty }: CountdownProps) {
    const [countdown, setCountdown] = useState(3);
    const [isPulsing, setIsPulsing] = useState(false);

    const onCountdown = () => {
        setIsLoading(false);
    }

    const handleCountdown = () => {
        let count = countdown;
        const interval = setInterval(() => {
            if (count > 0) {
                setCountdown(count);
                
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
        localStorage.setItem('sudokuRoomPvp', JSON.stringify({ sudokuId: sudokuId!, difficulty: difficulty! }));
        const interval = handleCountdown();
        
        return () => clearInterval(interval);
    }, []);

    // Creamos un controlador de animación personalizado para el efecto de ondas
    const circleControls = useAnimation();
    const [isAnimating, setIsAnimating] = useState(true);
    
    // Usamos useAnimationFrame para crear el efecto de onda en el borde con ciclos controlados
    useAnimationFrame((time) => {
        // Convertimos el tiempo a segundos para facilitar los cálculos
        const seconds = time / 1000;
        
        // Calculamos la posición en el ciclo de 1 segundo (0 a 1)
        const cyclePosition = seconds % 1.0;
        
        // Solo animamos durante 0.5 segundos y mantenemos un círculo perfecto el resto del tiempo
        if (cyclePosition < 0.5) {
            // Normalizar la posición dentro de la fase de animación (0 a 1)
            const animationProgress = cyclePosition / 0.5;
            
            // Usamos una curva de easing personalizada para una animación más orgánica
            // Esta función crea un efecto más suave al inicio y final de la animación
            // Empieza y termina exactamente en 0 para mantener el círculo perfecto
            const easeInOutQuad = animationProgress < 0.5 
                ? 2 * animationProgress * animationProgress 
                : -1 + (4 - 2 * animationProgress) * animationProgress;
            
            // Multiplicamos por Math.sin(π*progress) para suavizar aún más y garantizar inicio/fin en 0
            const waveProgress = Math.sin(animationProgress * Math.PI) * easeInOutQuad;
            
            // Calculamos las amplitudes basadas en el progreso para que sean 0 al inicio y al final
            const amplitude1 = 20 * waveProgress;
            const amplitude2 = 15 * waveProgress;
            const amplitude3 = 10 * waveProgress;
            
            // Definimos fases diferentes para cada onda para crear un efecto más orgánico y natural
            const phase1 = animationProgress * Math.PI * 2;
            const phase2 = animationProgress * Math.PI * 2 + Math.PI / 3; // Desplazamiento de 60°
            const phase3 = animationProgress * Math.PI * 2 - Math.PI / 4; // Desplazamiento de -45°
            
            // Creamos ondas que están sincronizadas con el ciclo de animación
            const wave1 = Math.sin(phase1) * amplitude1;
            const wave2 = Math.sin(phase2) * amplitude2;
            const wave3 = Math.sin(phase3) * amplitude3;
            
            // Combinamos las ondas para crear la forma final
            const baseRadius = 50;
            const topLeft = baseRadius + wave1 + wave3;
            const topRight = baseRadius + wave2 - wave3;
            const bottomRight = baseRadius - wave1 + wave2;
            const bottomLeft = baseRadius - wave2 - wave3;
            
            // Aplicamos la animación con una transición más fluida
            circleControls.start({
                borderRadius: `${topLeft}% ${topRight}% ${bottomRight}% ${bottomLeft}%`,
                transition: { duration: 0.015 } // Ligeramente más rápida para mayor fluidez
            });
            
            // Actualizamos el estado de animación
            if (!isAnimating) {
                setIsAnimating(true);
            }
        } else if (isAnimating) {
            // Cuando termina la animación, regresamos al círculo perfecto
            // con una transición suave para evitar saltos bruscos
            circleControls.start({
                borderRadius: '50%',
                transition: { duration: 0.08, ease: "easeOut" }
            });
            
            // Marcamos que la animación ha terminado
            setIsAnimating(false);
        }
    });

    return (
        <div className="relative overflow-hidden">
            {/* Fondo con círculo difuminado y animación de pulso - más grande y más visible */}
            <motion.div 
                animate={circleControls}
                initial={{ borderRadius: "50%" }}
                style={{
                    filter: isPulsing ? "blur(25px) brightness(1.15)" : "blur(30px) brightness(1)",
                    transition: "filter 0.3s ease-out"
                }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] lg:w-[700px] lg:h-[700px]
                border-[12px] border-[var(--primary-color)]
                opacity-70 transition-transform duration-300
                ${isPulsing ? 'scale-[1.1]' : 'scale-[0.9]'}`}
            ></motion.div>
            
            {/* Segundo círculo con diferente animación y color */}
            <motion.div 
                animate={{
                    borderRadius: ["50%", "67% 33% 70% 30%", "36% 64% 30% 70%", "50%"],
                    scale: isPulsing ? 1.2 : 0.95,
                    filter: isPulsing 
                        ? "blur(35px) brightness(1.2)" 
                        : "blur(40px) brightness(1)",
                }}
                transition={{
                    borderRadius: { 
                        duration: 0.5,
                        ease: [0.4, 0.0, 0.2, 1], // Custom ease function for smoother animation
                        repeat: Infinity, 
                        repeatType: "mirror",
                        repeatDelay: 0.5
                    },
                    scale: { duration: 0.3 },
                    filter: { duration: 0.3 }
                }}
                className={`absolute top-[55%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] lg:w-[450px] lg:h-[450px] 
                border-[8px] border-[var(--secondary-color)]
                opacity-60 transition-all duration-1000`}
            ></motion.div>
            
            <div className='flex justify-center items-center flex-col gap-4 h-screen relative z-10'>
                {/* Contenedor del texto con efecto de "glass" para mejorar legibilidad */}
                {/* <div className="bg-base-100/20 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/10 flex flex-col items-center"> */}
                    <h2 className='text-xl font-bold text-center text-[var(--primary-text)] mb-2'>¡Todos listos!</h2>
                    <h2 className="text-white/80 text-lg">El sudoku va a comenzar en...</h2>
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
                            className="text-9xl font-bold text-white"
                        >
                            {countdown > 0 ? countdown : '¡Ya!'}
                        </motion.h1>
                    </div>
                {/* </div> */}
            </div>
        </div>
    )
}
