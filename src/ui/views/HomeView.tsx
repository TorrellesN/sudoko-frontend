// filepath: /home/nuria/sudoko-frontend/src/ui/views/HomeView.tsx
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { SocketContext } from '../../application/context/socketContext'
import { useContext, useState } from 'react';
import { UserContext } from '../../application/context/userContext';
import { Button, CloseButton, PopoverButton } from '@headlessui/react';
import { motion } from 'framer-motion';
import { bgBlueGradient, bgRedLogo } from '../../assets/bgItems';

interface AuthRoutesProps {
  isAuth: boolean;
  redirectTo?: string;
}

export default function HomeView({ isAuth, redirectTo = "/" }: AuthRoutesProps) {

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/');
  }

/*   if (isAuth) {
    return <Navigate to={redirectTo} replace />;
  } */

  return (
    <>
      <motion.div className="bg-gradient-svg pointer-events-none"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1.5,
          delay: 0.5,
          type: "spring",
          damping: 25,
          stiffness: 100
        }}
      >
        <img src={bgBlueGradient} alt="landing background" className="bg-gradient-blue w-full h-full" />
      </motion.div>
      <motion.div className="bg-gradient-svg pointer-events-none"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.7,
          delay: 1.0,
          type: "spring",
          damping: 30
        }}
      >
        <img src={bgRedLogo} alt="landing background" className="bg-logo-blured w-full h-full" />
      </motion.div>

      <div className='container flex flex-col mx-auto max-w-screen-lg'>

        <section className="flex flex-col items-center md:items-start justify-center h-screen max-h-170 max-w-screen-lg">
          <div className='text-center md:pl-10 md:pt-30'>
            <motion.h2 
              className="text-6xl md:text-7xl font-black mb-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.7,
                type: "spring",
                stiffness: 80
              }}
            >
              EL <span className='bg-gradient-to-tr from-red-600 via-orange-500 to-yellow-500 text-transparent bg-clip-text'>SUDOKU</span>
            </motion.h2>
            <motion.h2 
              className="text-4xl md:text-3xl font-black mb-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                type: "spring",
                stiffness: 80
              }}
            >
              COMO <span className='italic'>NUNCA</span> ANTES
            </motion.h2>
            <motion.h2 
              className="text-6xl md:text-7xl font-black"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.5,
                type: "spring",
                stiffness: 80
              }}
            >
              VISTO
            </motion.h2>

            <motion.p 
              className='pt-10 md:pt-14 text-lg font-semibold max-w-md'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                  duration: 0.5,
                delay: 0.5,
                type: "spring",
                stiffness: 70
              }}
            >
              Reta a tus amigos o enfréntate a jugadores de todo el mundo en partidas rápidas, intensas y llenas de estrategia. 🧩
            </motion.p>
            <motion.p 
              className='pt-2 md:pt-2 text-lg font-semibold max-w-md pb-10 md:pb-14'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.5,
                type: "spring",
                stiffness: 70
              }}
            >
              Gana puntos, acumula combos, escala en el ranking y demuestra quién tiene la mente más ágil.
            </motion.p>

            <motion.button
              type="submit"
              className="btn-md bg-[var(--secondary-text)] w-xs"
              onClick={handleRedirect}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.5,
                type: "spring",
                stiffness: 90
              }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-md font-medium text-[var(--base-100)]">
                Entrar
              </p>
            </motion.button>
          </div>
        </section>
      </div>
    </>
  )
}
