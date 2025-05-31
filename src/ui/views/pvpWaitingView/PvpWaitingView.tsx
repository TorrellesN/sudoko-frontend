import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SocketContext } from "../../../application/context/socketContext";
import { ThemeContext } from "../../../application/context/themeContext";
import { useAppStore } from "../../../application/store/useAppStore";
import { diffOptions, Player, SocketCResponse } from "../../../domain";
import QuitGameModal from "../../components/sharedComponents/quitGameModal/QuitGameModal";
import { useQuitGameModal } from "../../components/sharedComponents/quitGameModal/useQuitGameModal";
import { getPlayerStyle, getRolBgBase } from "../../styles/sudokuCardStyles";



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
  const {theme} = useContext(ThemeContext);



  const handleQuit = () => {
    socket.emit('quit-pvp-waiting', id, (response: SocketCResponse) => {
      console.log('response', response)
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
      /* toast.error(`${username} se ha desconectado`); */
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
        <h1 className="text-5xl font-bold pt-22 pb-12">Sala de espera</h1>

        <section className=' container mx-auto px-6 sm:px-18 py-8 flex flex-col gap-6 max-w-xl opaque-card '>
          <div className="flex flex-col sm:flex-row justify-between">
            <h5 className='pb-4'>Sudoku · <span className="text-[var(--primary-color)]">Multijugador</span></h5>
            <h5 className='pb-4'>Dificultad · <span className="text-[var(--primary-color)]">{diffOptions[difficulty]}</span></h5>
          </div>
          <div className="flex flex-col pt-2 items-center">
            <h3 className='pb-4'>Esperando oponentes...</h3>

            <div className="grid grid-cols-2 gap-4 w-full">

              <div
                className="p-6 rounded-xl shadow-md flex items-center justify-center"
                style={{...getPlayerStyle(rol, theme, true)}}
              >
                <div className="flex flex-col items-center gap-2 pt-1">
                  <div 
                  className="px-4 py-1 rounded-full h-[4rem] w-[4rem]"
                  style={{...getRolBgBase(rol)}}
                  >.</div>
                  <h5 className="text-md">
                    {user.username}
                  </h5>
                  <p className="text text-sm font-medium pt-1">{ready ? 'Listo!' : 'Esperando...'}</p>
                </div>
              </div>

              {players && players.map((player, index) => (
                <div
                key={index}
                className="p-6 rounded-xl shadow-md flex items-center justify-center"
                style={{...getPlayerStyle(player.rol, theme, true)}}
              >
                <div className="flex flex-col items-center gap-2 pt-1">
                  <div 
                  className="px-4 py-1 rounded-full h-[4rem] w-[4rem]"
                  style={{...getRolBgBase(player.rol)}}
                  >.</div>
                  <h5 className="text-md">
                    {player.username}
                  </h5>
                  <p className="text text-sm font-medium pt-1">{player.ready ? 'Listo!' : 'Esperando...'}</p>
                </div>
              </div>
              ))}

            </div>

          </div>
        </section>
        
        <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-4">
          <button
            className="btn-md bg-blue-gradient"
            onClick={open}
          >
            Abandonar
          </button>
          <QuitGameModal isOpenModal={isOpenModal} close={close} handleQuit={handleQuit} />
          <button
            className="btn-md-light bg-red-gradient "
            onClick={handleSetReady}
          >
            {ready ? 'Esperar a jugadores' : 'Listo para jugar'}
          </button>
        </div>

      </div>



     
    </>
  );
}
