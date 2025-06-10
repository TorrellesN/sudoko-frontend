import { motion } from 'framer-motion'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { profileImgs } from '../../../../utilities/constants'
import { getRolBgBase } from '../../../styles/sudokuCardStyles'
import { UserDetails } from '../../../../domain'
import { useAppStore } from '../../../../application/store/useAppStore'

export default function ShowUserDetails({ userDetails, toggleEditProfile }: { userDetails: UserDetails, toggleEditProfile: () => void }) {
  const logout = useAppStore((state) => state.logout);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/home', { replace: true });
  }
  return (
    <>
      <motion.button
        type="submit"
        className="btn-sm bg-[var(--secondary-text)] absolute bottom-3 right-3 "
        onClick={handleLogout}
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.95 }}
      >
        <p className="text-xs font-medium text-[var(--base-100)]">
          Cerrar sesión
        </p>

      </motion.button>

      <div className='flex flex-col items-center justify-center gap-8 md:w-2/3'>
        <div className='flex flex-col items-center justify-center gap-1'>
          <div
            className="mb-2 rounded-full h-[4.8rem] w-[4.8rem] aspect-square border-2 border-[var(--dark-color-border)]/70"
            style={{ ...getRolBgBase(1) }}
          >
            <img src={profileImgs[userDetails.profileImg]} alt="" className="h-[4.6rem] w-[4.6rem] aspect-square rounded-full opacity-80" />
          </div>

          <h5 className=''>{userDetails.username}</h5>
          <p className='text-sm'>{userDetails.email}</p>
        </div>

        <div className='space-y-2 w-full flex flex-col items-center '>
          <div className="w-full max-w-80 flex flex-row items-center justify-between py-2.5 px-6 border-2 border-[var(--rol-1-base-color)] rounded-full">
            <div>
              <p className="text-sm italic">Tier:</p>
            </div>
            <p className="text-sm font-bold italic text-[var(--primary-color)]">{userDetails.league}</p>
          </div>
          <div className='h-4 w-full max-w-80 px-4 flex justify-center items-center'>
            <p className='font-medium text-sm font-italic'>Sudokoins obtenidos: <span className='text-[var(--primary-color)]'>{userDetails.sudokoins}</span></p>
          </div>
        </div>


        <button
          className=" font-bold hover:underline transition-all text-[var(--secondary-text)] text-sm align-self-end pt-4"
          onClick={toggleEditProfile}
        >Editar perfil</button>

        {/* <RedAnimatedBtn onClick={handleSudokuCreate} text={"Nueva partida"} /> */}

      </div>


      <div className="hidden md:block w-px h-auto bg-[var(--base-100)] mx-4 shadow-[0_0_10px_2px_var(--shadow-color)]"></div>
      <div className="md:hidden block w-auto h-px bg-[var(--base-100)] mx-4 shadow-[0_0_10px_2px_var(--shadow-color)]"></div>


      <div className="flex flex-col items-start justify-start md:w-1/3 gap-3 pl-6 md:pl-0">
        <h5 className='pb-4 pt-5 md:pt-0'>Estadísticas</h5>
        <div className="text-sm/6">
          <p className="font-semibold text-[var(--secondary-text)]" aria-label='Total played'>Total de partidas jugadas</p>
          <p className="font-semibold text-[var(--primary-text)]" aria-label='Total played'>{userDetails.totalPlayed}</p>
        </div>
        <div className="text-sm/6">
          <p className="font-semibold text-[var(--secondary-text)]" aria-label='Total wins'>Total de partidas ganadas</p>
          <p className="font-semibold text-[var(--primary-text)]" aria-label='Total wins'>{userDetails.totalWins}</p>
        </div>
        <div className="text-sm/6">
          <p className="font-semibold text-[var(--secondary-text)]" aria-label='Difficulty wins'>Partidas ganadas en cada dificultad</p>
          <p className="font-semibold text-[var(--primary-text)]" aria-label='Easy wins'>{`Modo fácil · ${userDetails.hardWins}`}</p>
          <p className="font-semibold text-[var(--primary-text)]" aria-label='Medium wins'>{`Modo medio · ${userDetails.hardWins}`}</p>
          <p className="font-semibold text-[var(--primary-text)]" aria-label='Hard wins'>{`Modo difícil · ${userDetails.hardWins}`}</p>
        </div>
      </div>
    </>
  )
}
