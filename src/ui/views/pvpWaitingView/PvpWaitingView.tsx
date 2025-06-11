import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SocketContext } from "../../../application/context/socketContext";
import { ThemeContext } from "../../../application/context/themeContext";
import { useAppStore } from "../../../application/store/useAppStore";
import { diffOptions, Player, SocketCResponse } from "../../../domain";
import QuitGameModal from "../../components/sharedComponents/quitGameModal/QuitGameModal";
import { useQuitGameModal } from "../../components/sharedComponents/quitGameModal/useQuitGameModal";
import { getPlayerGradient, getPlayerStyle, getRolBgBase } from "../../styles/sudokuCardStyles";
import { profileImgs } from "../../../utilities/constants";
import RollingSquare from "../../components/sharedComponents/LoadingSquare";
import { motion } from "framer-motion";



export default function PvpWaitingView() {

  const { socket, online } = useContext(SocketContext);
  const navigate = useNavigate();
  const players = useAppStore(state => state.players);
  const user = useAppStore(state => state.user);
  const rol = useAppStore(state => state.rol);
  const difficulty = useAppStore(state => state.difficulty);
  const id = useAppStore(state => state.id);
  const addPLayer = useAppStore(state => state.addPLayer);
  const removePlayer = useAppStore(state => state.removePlayer);
  const restartSudokuState = useAppStore(state => state.restartSudokuState);
  const setReadyOrWaitingPlayer = useAppStore(state => state.setReadyOrWaitingPlayer);
  const areAllPlayersReady = useAppStore(state => state.areAllPlayersReady);
  const { open, close, isOpenModal } = useQuitGameModal();

  const [ready, setReady] = useState(false);
  const { theme } = useContext(ThemeContext);



  const handleQuit = () => {
    socket.emit('quit-pvp-waiting', id, (response: SocketCResponse) => {
      restartSudokuState();
      navigate('/')
    })
  }

  const handleSetReady = () => {
    if (ready) {
      socket.emit('set-waiting', id, user.username);
      setReady(false);
    }
    if (!ready) {
      const areAllReady = areAllPlayersReady();

      socket.emit('set-ready', user.username, areAllReady);
      setReady(true);
    }
  }

  useEffect(() => {
    localStorage.removeItem('sudokuRoomPvp');
    socket.on('player-joined', (player: Player) => {
      setReady(false);
      addPLayer(player);
    })

    socket.on('player-pvp-quit', ({ username }) => {
      setReady(false);
      removePlayer(username);
    })

    socket.on('player-ready', ({ username }) => {
      setReadyOrWaitingPlayer(username);
    })

    socket.on('player-waiting', ({ username }) => {
      setReadyOrWaitingPlayer(username);
    })

    socket.on('all-players-ready', (data) => {
      localStorage.setItem('sudokuRoomPvp', JSON.stringify({ sudokuId: id!, difficulty: difficulty! }));
      navigate('/pvp/sudoku');
    })

    return () => {
      socket.off('player-joined');
      socket.off('player-disconnected');
      socket.off('player-ready');
      socket.off('player-waiting');
      socket.off('all-players-ready');
    }
  }, [socket]);

  useEffect(() => {
    if (!online) {
      socket.off('player-joined');
      toast.error('Parece que tu conexión es inestable, vuelve a intentarlo más tarde');
      navigate('/pvp/create');
    }
  }, [online]);



  return (
    <>
      <div className='container flex flex-col items-center justify-center mx-auto max-w-screen-2xl'>
        <h1 className="view-title">Sala de espera</h1>

        <section className=' container mx-auto px-6 sm:px-18 py-8 flex flex-col gap-6 max-w-xl opaque-card '>
          <div className="flex flex-col sm:flex-row justify-between pb-4 gap-4">
            <h5 >Sudoku · <span className="text-[var(--primary-color)]">Multijugador</span></h5>
            <h5 >Dificultad · <span className="text-[var(--primary-color)]">{diffOptions[difficulty]}</span></h5>
          </div>
          <div className="flex flex-col pt-2 items-center">
            <div className="flex flex-row items-center justify-center w-full gap-4 pb-4">
              <div className="h-6 w-6">
                <RollingSquare theme={theme} />
              </div>
              <h3>Esperando oponentes...</h3>
            </div>

            <div className='flex flex-col py-5 min-h-50 gap-1 md:gap-2 w-full' >




              <div className='py-3 px-5 rounded-3xl flex flex-row items-center justify-start gap-6 w-full'
                style={{ ...getPlayerStyle(rol, theme, true) }}>

                <div
                  className="rounded-full h-[2.8rem] w-[2.8rem] aspect-square border-2 border-[var(--dark-color-border)]/80"
                  style={{ ...getRolBgBase(rol) }}
                >
                  <img src={profileImgs[user.profileImg]} alt="" className="h-[2.6rem] w-[2.6rem] aspect-square rounded-full opacity-80 " />
                </div>

                <div className='flex flex-col flex-1 items-start gap-1 text-md font-semibold'>
                  <h4>{user.username}</h4>
                  <p className="text text-sm font-medium pt-1">{ready ? '¡Listo!' : 'Esperando...'}</p>
                </div>
                <div className='w-2.5 h-13 my-2 rounded-full'
                  style={{ ...getPlayerGradient(rol) }}
                ></div>

              </div>


              {players && players.map((player, index) => (
                <div key={index} className='py-3 px-5 rounded-3xl flex flex-row items-center justify-start gap-6 w-full'
                  style={{ ...getPlayerStyle(player.rol, theme, true) }}>

                  <div
                    className="rounded-full h-[2.8rem] w-[2.8rem] aspect-square border-2 border-[var(--dark-color-border)]/80"
                    style={{ ...getRolBgBase(player.rol) }}
                  >
                    <img src={profileImgs[player.profileImg]} alt="" className="h-[2.6rem] w-[2.6rem] aspect-square rounded-full opacity-80 " />
                  </div>

                  <div className='flex flex-col flex-1 items-start gap-1 text-md font-semibold'>
                    <h4>{player.username}</h4>
                    <p className="text text-sm font-medium pt-1">{player.ready ? 'Listo!' : 'Esperando...'}</p>
                  </div>
                  <div className='w-2.5 h-13 my-2 rounded-full'
                    style={{ ...getPlayerGradient(player.rol) }}
                  ></div>

                </div>
              ))}

            </div>

          </div>
        </section>

        <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-4 w-full max-w-sm md:max-w-md">
          <motion.button
            type="submit"
            className="btn-sm bg-[var(--secondary-text)] flex flex-row gap-2 items-center justify-center w-full mb-2"
            onClick={handleSetReady}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-sm font-medium text-[var(--base-100)]">
              {ready ? 'Esperar a jugadores' : 'Listo para jugar'}
            </p>

          </motion.button>

          <motion.button
            type="submit"
            className="btn-sm bg-[var(--base-100)] flex flex-row gap-2 items-center justify-center w-full mb-2"
            onClick={open}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-sm font-medium">
              Abandonar
            </p>

          </motion.button>

          <QuitGameModal isOpenModal={isOpenModal} close={close} handleQuit={handleQuit} />

        </div>
      </div>
    </>
  );
}
