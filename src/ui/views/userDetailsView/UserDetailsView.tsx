import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { bgBlueGradient } from '../../../assets/bgItems';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../../application/context/themeContext';
import { profileImgs } from '../../../utilities/constants';
import { getRolBgBase } from '../../styles/sudokuCardStyles';
import { Link } from 'react-router-dom';
import ShowUserDetails from './_components/ShowUserDetails';
import EditProfile from './_components/EditProfile';
import { useGetUserDetails } from '../../../application/useCases/user.useCases';

export default function UserDetailsView() {
  const { userDetails, isDetailLoading, error, refetch } = useGetUserDetails();
  const { theme } = useContext(ThemeContext);
  const [editProfile, setEditProfile] = useState<boolean>(false);

  const toggleEditProfile = () => {
    setEditProfile(!editProfile);
  }

  useEffect(() => {
    if (!isDetailLoading && error) {
      toast.error(error);
    }
  }, [error, isDetailLoading])

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
        <img src={bgBlueGradient} alt="dragon" className={` bg-gradient-svg ${theme === 'light' ? 'bg-medium-op' : 'bg-less-op'} w-full h-full`} />
      </motion.div>
      <div className='container flex flex-col items-center justify-center mx-auto max-w-screen-2xl'>
        <h1 className="view-title">{editProfile ? 'Editar perfil' : 'Perfil'}</h1>

        {/* Container */}
        <div className=' container mx-auto px-6 md:px-18 py-12 flex flex-col md:flex-row gap-6 max-w-5xl glass-card'>
        {editProfile
        ? <EditProfile toggleEditProfile={toggleEditProfile} />
        : <ShowUserDetails userDetails={userDetails} toggleEditProfile={toggleEditProfile} />
        }
        </div>

      </div>
    </>
  )
}
