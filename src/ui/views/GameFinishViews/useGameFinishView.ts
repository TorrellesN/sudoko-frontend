import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../../application/context/themeContext';
import { useAppStore } from '../../../application/store/useAppStore';

export const useGameFinishView = () => {
  const comboAcc = useAppStore(state => state.comboAcc);
  const points = useAppStore(state => state.points);
  const completedTime = useAppStore(state => state.completedTime);
  const difficulty = useAppStore(state => state.difficulty);
  const players = useAppStore(state => state.players);

  const formatTime = (time: Date): string => {
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}m : ${formattedSeconds}s`;
  };
  const sudokoins = useAppStore(state => state.sudokoins);
  const getTotalOfCompletedNumbers = useAppStore(state => state.getTotalOfCompletedNumbers);
  const id = useAppStore(state => state.id);

  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();


  useEffect(() => {
    if (sudokoins) {
      setLoading(false);
    }
  }, [sudokoins]);


  const handleNavigate = () => {
    navigate('/home', { replace: true })
  }

  return {
    comboAcc,
    points,
    completedTime,
    difficulty,
    players,
    formatTime,
    sudokoins,
    getTotalOfCompletedNumbers,
    id,
    loading,
    showDetails,
    setShowDetails,
    theme,
    handleNavigate,
    navigate
  }
}
