import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { motion } from 'framer-motion'
import { diffOptions } from '../../../../domain'
import { useGameFinishView } from '../useGameFinishView';

export default function PveWinDetails() {
      const {
        comboAcc,
        points,
        completedTime,
        difficulty,
        formatTime,
        getTotalOfCompletedNumbers,
        theme,
        handleNavigate
      } = useGameFinishView();
      
  return (
    <div className='container flex flex-col items-center sm:items-end justify-start sm:justify-center mx-auto w-full max-w-screen-xl min-h-screen '>
        <div className=' container px-0.5 sm:px-6 md:px-18 py-12 gap-6 z-5 max-w-2xl'>
          <motion.section
            className="flex flex-col items-center rounded-2xl mx-auto relative z-10 bg-[var(--base-100)] shadow-lg p-6 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
              stiffness: 100
            }}
            style={{
              background: `linear-gradient(to bottom, 
              rgba(255,255,255,0) 0%, 
              ${theme === 'light' ? 'rgba(255,255,255,0.5)' : 'rgba(21, 28, 37, 0.5)'} 50%, 
              ${theme === 'light' ? 'rgba(255,255,255,1)' : 'rgba(21, 28, 37, 0.8)'} 100%)`,
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
            }}
            >

            <p className="self-start font-medium text-xl pb-8">Estadísticas</p>

            

            <div className="w-full max-w-80 grid grid-cols-3 justify-items-stretch rounded-lg overflow-hidden bg-blue-gradient text-[var(--dark-color)]"
            >
              <div className="flex flex-col items-start justify-center gap-2 p-4 pl-6 relative">
                <p className="text-xs italic">Puntos</p>
                <p className="text-4xl " style={{ fontWeight: 900 }}>{points}</p>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3/4 w-[1px] bg-[var(--base-100)]"></div>
              </div>
              <div className="flex flex-col items-start justify-center gap-2 p-4 pl-6 relative">
                <p className="text-xs italic">Combo</p>
                <p className="text-4xl font-extrabold">{comboAcc}</p>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3/4 w-[1px] bg-[var(--base-100)]"></div>
              </div>
              <div className="flex flex-col items-start justify-center gap-2 p-4 pl-6">
                <p className="text-xs italic">Casillas</p>
                <p className='text-4xl font-extrabold'>{getTotalOfCompletedNumbers()}</p>
              </div>
            </div>

            <div className="w-full max-w-80 flex flex-row items-center justify-between py-3 px-6 border-2 border-[var(--rol-1-base-color)] rounded-full">
              <p className="text-sm italic">Tiempo total:</p>
              <p className="text-sm font-bold italic text-[var(--primary-color)]">{formatTime(completedTime ?? new Date())}</p>
            </div>

            <div className='h-4 w-full max-w-80 px-4 flex justify-between items-center'>
              <p className='font-medium text-sm font-italic'>Nivel: <span className='text-[var(--primary-color)]'>{diffOptions[difficulty]}</span></p>
              {/* <p className='font-medium text-sm font-italic'>Jugadores: <span className='text-[var(--primary-color)]'>{players.length + 1}</span></p> */}
            </div>

            <motion.button
              className="btn-md bg-[var(--base-300)] flex flex-row gap-2 items-center justify-center mb-4 mt-8"
              onClick={handleNavigate}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-md text-[var(--secondary-text)]">Volver a inicio</p>
            </motion.button>
          </motion.section>
        </div >
      </div >
  )
}
