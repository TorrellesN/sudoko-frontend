import { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../../../application/context/socketContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../../application/store/useAppStore';
import { toast } from 'react-toastify';
import { Difficulty, diffOptions, Player, RolNumber, SocketCResponse, SudokuPvpResolvedResponse } from '../../../domain';
import { getPlayerGradient, getPlayerStyle, getRolBgBase } from '../../styles/sudokuCardStyles';
import PvpSudokuBoard from './components/PvpSudokuBoard';
import SudokuInput from '../../components/sudokuCommonComponents/SudokuInput';
import { ThemeContext } from '../../../application/context/themeContext';
import FireComboIcon from '../../components/sudokuCommonComponents/FireComboIcon';
import UserSudokuCard from '../../components/sudokuCommonComponents/UserSudokuCard';
import { AnimatedNumber } from '../../components/sudokuCommonComponents/AnimatedNumber';

export default function PvpSudokuView() {

  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);
  const rol = useAppStore((state) => state.rol);
  const points = useAppStore((state) => state.points);
  const comboAcc = useAppStore((state) => state.comboAcc);
  const isCorrectNumber = useAppStore((state) => state.isCorrectNumber);
  const calculatePoints = useAppStore((state) => state.calculatePoints);
  const savePVPSelfMove = useAppStore((state) => state.savePVPSelfMove);
  const savePVPPlayerMove = useAppStore((state) => state.savePVPPlayerMove);
  const resetCombo = useAppStore((state) => state.resetCombo);
  const setStartedSudokuState = useAppStore((state) => state.setStartedSudokuState);
  const fillEmptyCells = useAppStore((state) => state.fillEmptyCells);
  const setFinishedStatePvp = useAppStore((state) => state.setFinishedStatePvp);
  const players = useAppStore((state) => state.players);
  const difficulty = useAppStore(state => state.difficulty);
  const resetOtherPlayersCombo = useAppStore(state => state.resetOtherPlayersCombo);
  const removePlayer = useAppStore(state => state.removePlayer);
  const navigate = useNavigate();
  const { socket, online } = useContext(SocketContext);
  const { theme } = useContext(ThemeContext);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [searchParams] = useSearchParams();
  const finishnow = searchParams.get('finishnow');

  const id = useAppStore(state => state.id);


  const [reconnected, setReconnected] = useState(false);
  const eventsRegistered = useRef(false);

  const handleFinishNow = (difficulty: Difficulty) => {
    if (finishnow && finishnow === 'true') {
      socket.emit('finish-now', difficulty, (response: SocketCResponse) => {
        console.log('response', response);
        if (response.success) {
          fillEmptyCells();
          /* dfgdfgdfgfg */
        } else {
          console.error('No se ha podido completar');
        }
      });
    };
  }

  //Lógica de ls, rescatar estado del sudoku, comprobar online, etc.
  useEffect(() => {

    //Solo para notificar desconexiones durante la partida
    if (!online && reconnected) {
      toast.warning('Es posible que la partida no se haya actualizado, recarga la página.');
      return;
    }
    if (reconnected) return;
    if (!online) return;

    const sudokuLSObj = localStorage.getItem('sudokuRoomPvp');

    //Para verificar si se intentó conectar
    const reconnectAttempted = localStorage.getItem('reconnectAttempted');

    if (!sudokuLSObj) {
      navigate('/pvp/create');
      return;
    }

    if (rol > 0 || reconnectAttempted === 'true') {
      // Si ya tenemos rol o si venimos de una reconexión
      setReconnected(true);
      localStorage.removeItem('reconnectAttempted');
      return;
    }

    localStorage.setItem('reconnectAttempted', 'true');

    socket.emit('reconnect-to-pvp-game', JSON.parse(sudokuLSObj), (response: SocketCResponse) => {
      console.error('response', response);
      if (response.success && 'current' in response.payload) {
        const players = [...response.payload.players];
        const playerIndex = players.findIndex((player: Player) => player.email === user?.email);

        if (playerIndex === -1) {
          toast.warning('No perteneces a este sudoku');
          localStorage.removeItem('sudokuRoomPvp');
          navigate('/pvp/create');
          return;
        }

        setStartedSudokuState(response.payload);
        handleFinishNow(response.payload.difficulty);
        setReconnected(true);

      } else if (!response.success && response.payload === 'finished') {
        toast.warning('Parece que el sudoku al que estás intentando reconectar ya ha terminado');
        localStorage.removeItem('sudokuRoomPvp');
        navigate('/pvp/create');
      }
      else {
        console.error('Error al reconectar: ', response.payload);
        toast.error(response.payload)
        navigate('/pvp/create');
      }

    });
  }, [online]);


  //Handler de los eventos
  useEffect(() => {
    if (eventsRegistered.current) return;

    function handlePlayerMove(data: { cellToInsert: { row: number, col: number, value: number, rol: RolNumber }, player: Player }) {
      console.log('player-pvp-move', data);
      const { cellToInsert, player } = data;
      if (rol !== player.rol) {
        savePVPPlayerMove(cellToInsert, player);
      }
    }

    function handleResetCombo({ email }: { email: string }) {
      resetOtherPlayersCombo(email);
    }

    function handlePlayerQuit({ username }: { username: string }) {
      toast.info(`${username} ha abandonado la partida`);
      removePlayer(username);
    }


    socket.on('player-pvp-move', handlePlayerMove);
    socket.on('player-reset-combo', handleResetCombo);
    socket.on('player-pvp-quit', handlePlayerQuit);
    socket.on('sudoku-pvp-finished', (data: { finishObj: SudokuPvpResolvedResponse }) => {
      setFinishedStatePvp(data.finishObj);
      navigate('/pvp/win');
    });

    eventsRegistered.current = true;

    return () => {
      socket.off('player-pvp-move', handlePlayerMove);
      socket.off('player-reset-combo', handleResetCombo);
      socket.off('player-pvp-quit', handlePlayerQuit);
      socket.off('sudoku-pvp-finished');
      eventsRegistered.current = false;

    };
  }, []);

  const handleCellClick = (row: number, col: number, free: boolean) => {
    if (free) {
      setSelectedCell({ row, col });
    } else {
      setSelectedCell(null);
    }
  };

  const handleInputNumber = (number: number) => {
    console.log(`Número ingresado: ${number} `, selectedCell);
    if (selectedCell) {
      const { row, col } = selectedCell;
      if (isCorrectNumber(number, row, col)) {
        const pointsForSaving = calculatePoints();
        socket.emit('save-pvp-move', { row, col, value: number, rol: rol }, pointsForSaving, difficulty, (response: SocketCResponse) => {
          if (response.success) {
            console.log('Movimiento guardado');
            savePVPSelfMove({ row, col, value: number }, pointsForSaving);
          } else {
            console.error(response.payload);
            toast.error(response.payload);
          }
          if (response.success && response.payload === 'finished') console.log('Sudoku terminado');
        });
      } else {
        toast.error('Número incorrecto');
        if (comboAcc > 0) {
          socket.emit('reset-pvp-combo', difficulty, (response: SocketCResponse) => {
            if (response.success) {
              resetCombo();
            }
          });
        }
      }
    }
  };


  if (!token) return (<p className="text-2xl font-light mt-5">
    Necesitas autenticarte para poder jugar. <Link to={'/auth/login'}>Iniciar sesión</Link>
  </p>);

  return (
    <>
     {/* <BackgroundCircle /> */}
      <div className='container flex flex-col items-center justify-center mx-auto max-w-screen-xl h-auto'>

        <h2 className="hidden md:block text-3xl self-start font-bold pt-8 pb-15">Sudoku multijugador</h2>

        {/* Container */}
        <div className='h-4 w-full mb-3
        hidden md:flex justify-between items-center 
        '>
          {/* Decoración puntos */}
          <div className='flex items-center justify-center'>
            <div className='rounded-full h-3 w-3 bg-[var(--base-100)]'></div>
            <hr className='w-20 my-4 mx-4 text-[var(--base-100)]' />
            <p className='font-medium text-xs font-italic'>Nivel: <span className='text-[var(--primary-color)]'>{diffOptions[difficulty]}</span></p>
          </div>
          <div className='flex items-center justify-center'>
            <p className='font-medium text-xs font-italic'>Jugadores: <span className='text-[var(--primary-color)]'>{players.length + 1}</span></p>
            <hr className='w-20 my-4 mx-4 text-[var(--base-100)]' />
            <div className='rounded-full h-3 w-3 bg-[var(--base-100)]'></div>
          </div>
        </div>
        
        {/* Sección princ */}
        <section className=' container mx-auto px-0 sm:px-8 pt-0 md:pb-4 md:py-8 flex flex-col gap-6 max-w-full lg:max-w-[97%] sudoku-card select-none'>

          <div className="flex flex-col items-center my-auto gap-4 md:grid md:grid-cols-6 lg:grid-cols-7 md:items-center md:justify-center">

            {/* Players */}

            <div className="flex flex-col gap-1 md:gap-2 w-full md:col-span-1 lg:col-span-2 max-w-md">

              {/* User Card - hasta md */}
              <div className='block md:hidden w-full'>
                <UserSudokuCard rol={rol} user={user} points={points} comboAcc={comboAcc} theme={theme} />
              </div>
              <div className='flex md:hidden flex-row w-full text-[var(--secondary-text)] gap-2 items-center' >
                <hr className='w-full '/>
                <div className='text-xs font-medium italic' >vs</div>
                <hr className='w-full '/>
              </div>
              <div className='flex flex-row md:flex-col gap-1 md:gap-2 w-full' >
                {players && players.map((player, index) => (
                  <div key={index} className='p-5 rounded-3xl flex flex-col md:flex-row items-center justify-start gap-6 lg:gap-8 w-full'
                    style={{ ...getPlayerStyle(player.rol, theme, true) }}>

                    <div
                      className="px-4 py-1 rounded-full h-[2.8rem] w-[2.8rem] hidden lg:block"
                      style={{ ...getRolBgBase(player.rol) }}
                    >.</div>
                    <div className='flex flex-col flex-1 items-start gap-2.5 text-md font-semibold'>
                      <h4>{player.username}</h4>
                      <div className='flex items-center gap-2 leading-none '>
                        {/* <p className='pt-0.5'>{player.points}</p> */}
                        <AnimatedNumber className='pt-0.5' value={player.points || 0} />
                        <FireComboIcon comboAcc={player.comboAcc || 0} />
                      </div>
                    </div>
                    <div className='hidden md:block lg:w-2.5 h-18 rounded-full'
                      style={{ ...getPlayerGradient(player.rol) }}
                    ></div>

                  </div>
                ))}
              </div>
            </div>


            <div className="w-full md:col-span-3">
              <PvpSudokuBoard onCellClick={handleCellClick} />
            </div>

            <div className="w-full h-full flex flex-col items-center justify-center rounded-xl md:col-span-2 gap-3 max-w-md">

              {/* User Card - desde md */}
              <div className='hidden md:block w-full'>
                <UserSudokuCard rol={rol} user={user} points={points} comboAcc={comboAcc} theme={theme} />
              </div>

              <SudokuInput handleInputNumber={handleInputNumber} selectedCell={selectedCell} />
            </div>

          </div>
        </section>
        <div className='h-4 w-full mb-3
        hidden md:flex justify-between items-center 
        '>
          <div className='rounded-full h-3 w-3 bg-[var(--base-100)]'></div>
          <div className='rounded-full h-3 w-3 bg-[var(--base-100)]'></div>
        </div>
      </div>



    </>
  );
}



