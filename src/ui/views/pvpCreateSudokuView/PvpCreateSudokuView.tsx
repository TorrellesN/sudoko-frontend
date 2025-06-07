import { useContext, useMemo, useState } from "react";
import { SocketContext } from "../../../application/context/socketContext";
import { Listbox } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { Difficulty, diffOptions, SocketCResponse } from "../../../domain";
import { useAppStore } from "../../../application/store/useAppStore";
import { toast } from "react-toastify";
import CreateSudokuOptCard from "../../components/sudokuCommonComponents/CreateSudokuOptCard";

export default function PvpCreateSudokuView() {

  const navigate = useNavigate();
  const [difSelected, setDifSelected] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const difficulty = useMemo<Difficulty>(() => (Object.entries(diffOptions).find(([, val]) => val === difSelected)?.[0]) as Difficulty, [difSelected])
  const setInnitialSudokuState = useAppStore(state => state.setInnitialSudokuState);
  const setSelfPlayer = useAppStore(state => state.setSelfPlayer);
  const { socket } = useContext(SocketContext);
  const [lastGameObj, setLastGameObj] = useState<Object | null>(
    localStorage.getItem('sudokuRoomPvp')
      ? JSON.parse(localStorage.getItem('sudokuRoomPvp')!) : null
  )


  const handleSudokuCreate = () => {
    if (difficulty) {
      setIsLoading(true);

      socket.emit('request-sudoku-pvp', difficulty, (response: SocketCResponse) => {
        if (response.success) {
          console.log(response.payload)
          setInnitialSudokuState(response.payload.sudoku);
          setSelfPlayer(response.payload.player);
          setIsLoading(false);
          navigate(`/pvp/waiting`)
        } else {
          console.error('Error al crear el sudoku')
          toast.error(response.payload);
          setIsLoading(false);
        }
      });
    } else {
      toast.error('Debes seleccionar una dificultad');
    }
  }

  const handleLastGame = () => {
    if (!lastGameObj) {
      toast.error('No hay ninguna partida en curso');
      return;
    }
    navigate('/pvp/sudoku');
  }


  if (isLoading) {
    return <div>Cargando partida...</div>;
  }

  return (
    <>
      <>
        <div className='container flex flex-col items-center justify-center mx-auto max-w-screen-2xl'>
          <h1 className="view-title">Modo multijugador</h1>

          <CreateSudokuOptCard difSelected={difSelected} setDifSelected={setDifSelected} handleSudokuCreate={handleSudokuCreate} handleLastGame={handleLastGame} disabled={!!lastGameObj} />

        </div>
      </>
    </>
  )
}