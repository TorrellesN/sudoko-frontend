import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../../application/context/socketContext'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../../application/store/useAppStore';
import PveSudokuBoard from './PveSudokuBoard';
import SudokuInput from '../../components/sudokuCommonComponents/SudokuInput';
import { toast } from 'react-toastify';
import { diffOptions, SocketCResponse } from '../../../domain';
import { ThemeContext } from '../../../application/context/themeContext';
import UserSudokuCard from '../../components/sudokuCommonComponents/UserSudokuCard';
import { motion } from 'framer-motion';
import { blackDragon, whiteDragon } from '../../../assets/img';
import LoadingText from '../../components/sharedComponents/LoadingText';

export default function PveSudokuView() {

  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);
  const points = useAppStore((state) => state.points);
  const difficulty = useAppStore((state) => state.difficulty);
  const comboAcc = useAppStore((state) => state.comboAcc);
  const isCorrectNumber = useAppStore((state) => state.isCorrectNumber);
  const calculatePoints = useAppStore((state) => state.calculatePoints);
  const savePVEMove = useAppStore((state) => state.savePVEMove);
  const resetCombo = useAppStore((state) => state.resetCombo);
  const setStartedSudokuState = useAppStore((state) => state.setStartedSudokuState);
  const fillEmptyCells = useAppStore((state) => state.fillEmptyCells);
  const restartSudokuState = useAppStore((state) => state.restartSudokuState);
  const setFinishedStatePve = useAppStore((state) => state.setFinishedStatePve);

  const navigate = useNavigate();
  const { socket, online } = useContext(SocketContext);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const finishnow = searchParams.get('finishnow');
  const rol = useAppStore(state => state.rol);
  const { theme } = useContext(ThemeContext);

  const handleFinishNow = () => {
    if (finishnow && finishnow === 'true') {
      socket.emit('finish-now', "", (response: SocketCResponse) => {
        if (response.success) {
          fillEmptyCells();
        } else {
          console.error('No se ha podido completar');
        }
      });
    };
  }


  useEffect(() => {
    setIsLoading(true);
    // Intentar recuperar los datos de la partida desde localStorage o la BD
    const sudokuId = localStorage.getItem('sudokuRoomPve');
    if (sudokuId && online && !rol) {
      // Recuperar datos de la partida
      socket.emit('reconnect-to-pve-game', sudokuId, (response: SocketCResponse) => {
        if (response.success) {
          setStartedSudokuState(response.payload);
          handleFinishNow();
          setIsLoading(false);

        } else {
          console.error('Error al reconectar', response.payload);
          navigate('/pve/create');
        }
      });

    } else if (!sudokuId) {
      // Si no hay roomId en ls, redirigir a la página de creación de Sudoku
      navigate('/pve/create');

    } else if (sudokuId && rol) {
      setIsLoading(false);
    }

  }, [online]);


  const handleCellClick = (row: number, col: number, free: boolean) => {
    if (free) {
      setSelectedCell({ row, col });
    } else {
      setSelectedCell(null);
    }

  };


  const handleInputNumber = (number: number) => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      if (isCorrectNumber(number, row, col)) {

        const pointsForSaving = calculatePoints();
        socket.emit('save-pve-move', { row, col, value: number }, pointsForSaving, difficulty, (response: SocketCResponse) => {
          if (response.success) {
            savePVEMove({ row, col, value: number }, pointsForSaving);
          } else {
            toast.error(response.payload);
          }
          if (response.success && response.payload === 'finished') toast.success('¡Ganaste!')
        });

      } else {
        toast.error('Número incorrecto');
        socket.emit('reset-pve-combo', (response: SocketCResponse) => {
          if (response.success) {
            resetCombo();
          }
        });
      }

    }

  }


  useEffect(() => {
    socket.on('sudoku-finished', (data) => {
      setFinishedStatePve();
      navigate('/pve/win')
    })
    return (() => {
      socket.off('sudoku-finished')
    })
  }, []);


  const handleQuit = () => {
    socket.emit('quit-pve-game')
    restartSudokuState();
    navigate('/')
  }


  //TODO: tal vez en el futuro deba borrarse esto debido a que ws es inestable y se puede desconectar.
  //actualmente se ejecutan estos cambios en un useEffect para evitar errores de render
  if (!online && !isLoading) {
    toast.error('Hubo un error de conexión, inténtalo de nuevo en unos minutos.');
    return (<Navigate to="/pve/create" replace />);
  }
  if (isLoading) {
    return <LoadingText />;
  }
  if (!token) return (<p className="text-2xl font-light text-gray-500 mt-5">
    Necesitas autenticarte para poder jugar. <Link to={'/auth/login'}>Iniciar sesión</Link>
  </p>)

  return (
    <>
      <motion.div className="hidden md:block bg-dragon-parent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01]
        }}
      >
        <img src={theme === "light" ? blackDragon : whiteDragon} alt="dragon" className='bg-dragon-img' />
      </motion.div>

      <div className='container z-5 flex flex-col items-center justify-center mx-auto max-w-screen-lg h-auto'>

        <h2 className="hidden md:block text-3xl self-start font-bold pt-8 pb-15">Sudoku un jugador</h2>

        {/* Container */}
        <div className='h-4 w-full mb-3
            hidden md:flex justify-between items-center z-5
            '>
          {/* Decoración puntos */}
          <div className='flex items-center justify-center'>
            <div className='rounded-full h-3 w-3 bg-[var(--base-100)]'></div>
            <hr className='w-20 my-4 mx-4 text-[var(--base-100)]' />
            <p className='font-medium text-xs font-italic'>Nivel: <span className='text-[var(--primary-color)]'>{diffOptions[difficulty]}</span></p>
          </div>
          <div className='flex items-center justify-center'>
            <div className='rounded-full h-3 w-3 bg-[var(--base-100)]'></div>
          </div>
        </div>

        {/* Sección princ */}
        <section className=' container mx-auto px-0 sm:px-8 pt-0 md:pb-8 md:py-8 flex flex-col gap-6 max-w-full lg:max-w-[97%] min-h-100 sudoku-card select-none'>

          <div className="flex flex-col items-center my-auto gap-4 md:grid md:grid-cols-5 lg:grid-cols-7 md:items-center md:justify-center max-w-4xl">

            {/* Players */}

            <div className="flex flex-col gap-1 md:gap-2 w-full md:hidden max-w-md">

              {/* User Card - hasta md */}
              <div className='block md:hidden w-full'>
                <UserSudokuCard rol={rol} user={user} points={points} comboAcc={comboAcc} theme={theme} />
              </div>
              <div className='flex flex-row md:flex-col gap-1 md:gap-2 w-full' >
                {/* players */}
              </div>
            </div>


            <div className="w-full md:col-span-3 lg:col-span-4">
              <PveSudokuBoard onCellClick={handleCellClick} />
            </div>

            <div className="w-full h-full flex flex-col items-center justify-center rounded-xl md:col-span-2 lg:col-span-3 gap-3 max-w-md">

              {/* User Card - desde md */}
              <div className='hidden md:block w-full'>
                <UserSudokuCard rol={rol} user={user} points={points} comboAcc={comboAcc} theme={theme} />
              </div>

              <SudokuInput handleInputNumber={handleInputNumber} selectedCell={selectedCell} />
            </div>

          </div>
        </section>
        <div className='h-4 w-full mt-3
            hidden md:flex justify-between items-center z-5
            '>
          <div className='rounded-full h-3 w-3 bg-[var(--base-100)]'></div>
          <div className='rounded-full h-3 w-3 bg-[var(--base-100)]'></div>
        </div>
      </div>
    </>
  )
}



