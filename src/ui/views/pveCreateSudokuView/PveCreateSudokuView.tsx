import { Fragment, useContext, useMemo, useState } from "react"
import { SocketContext } from "../../../application/context/socketContext"
import { Field, Label, Listbox, Radio, RadioGroup } from "@headlessui/react"
import { Link, useNavigate } from "react-router-dom"
import { diffDetails, Difficulty, diffOptions, SocketCResponse } from "../../../domain";
import { useAppStore } from "../../../application/store/useAppStore";
import { toast } from "react-toastify";
import clsx from "clsx";
import { ArrowLongRightIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import GreenAnimatedBtn from "../../components/sharedComponents/buttons/GreenAnimatedBtn";
import RedAnimatedBtn from "../../components/sharedComponents/buttons/RedAnimatedBtn";
import CreateSudokuOptCard from "../../components/sudokuCommonComponents/CreateSudokuOptCard";

export default function PveCreateSudokuView() {

  const navigate = useNavigate();
  const [difSelected, setDifSelected] = useState<string>("easy");
  const [isLoading, setIsLoading] = useState(false);
  const difficulty = useMemo<Difficulty>(() => (Object.entries(diffOptions).find(([, val]) => val === difSelected)?.[0]) as Difficulty, [difSelected])
  const setInnitialSudokuState = useAppStore(state => state.setInnitialSudokuState);
  const setStartedSudokuState = useAppStore(state => state.setStartedSudokuState);
  const { socket, online } = useContext(SocketContext);
  const [lastGameId, setLastGameId] = useState<string | null>(
    localStorage.getItem('sudokuRoomPve')
      ? localStorage.getItem('sudokuRoomPve') : null
  )


  const handleSudokuCreate = () => {
    if (difficulty) {

      socket.emit('request-sudoku-pve', difficulty, (response: SocketCResponse) => {
        if (response.success) {
          console.log('Sudoku recibido')
          setInnitialSudokuState(response.payload);
          navigate(`/pve/sudoku`)
        } else {
          console.error('Error al crear el sudoku')
        }
      });
    } else {
      toast.error('Debes seleccionar una dificultad');
    }

  }

  const handleLastGame = () => {
    setIsLoading(true);
    const sudokuId = lastGameId;
    if (sudokuId && online) {
      socket.emit('reconnect-to-pve-game', sudokuId, (response: SocketCResponse) => {
        if (response.success) {
          setStartedSudokuState(response.payload);
          setIsLoading(false);
          navigate(`/pve/sudoku`);
        } else {
          console.error('Error al reconectar', response.payload);
          setIsLoading(false);
        }
      });
    } else if (!lastGameId) {
      toast.error('No hay ninguna partida en curso');
      setIsLoading(false);
    }
  }


  if (isLoading) {
    return <div>Cargando partida...</div>;
  }
  
  return (
    <>
      <div className='container flex flex-col items-center justify-center mx-auto max-w-screen-2xl'>
        <h1 className="text-5xl font-bold pt-22 pb-12">Modo un jugador</h1>

        <CreateSudokuOptCard difSelected={difSelected} setDifSelected={setDifSelected} handleSudokuCreate={handleSudokuCreate} handleLastGame={handleLastGame} disabled={!!lastGameId}/>

      </div>
    </>
  )
}


