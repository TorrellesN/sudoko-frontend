import { useContext, useEffect, useState } from "react"
import { useAppStore } from "../../../application/store/useAppStore";
import { ThemeContext } from "../../../application/context/themeContext";
import { ArrowLongRightIcon } from "@heroicons/react/20/solid";

export default function PvpGameFinishView() {
  const win = useAppStore(state => state.win);
  const completedTime = useAppStore(state => state.completedTime);
  const sudokoins = useAppStore(state => state.sudokoins);
  const getTotalOfCompletedNumbers = useAppStore(state => state.getTotalOfCompletedNumbers);

  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (sudokoins) {
      setLoading(false);
    }
  }, [sudokoins]);
  if (loading) {
    return (
      <div>
        <h1>Cargando...</h1>
      </div>
    )
  }
  return (
    <>
      <div className='container flex flex-col items-center justify-center mx-auto max-w-screen-2xl'>
        

        <div className=' container mx-auto px-6 md:px-18 py-12 flex flex-col gap-6 max-w-md'>
          <div className="flex flex-col items-start">
          <h1 className="text-5xl font-bold pt-22 pb-3 italic">¡Has</h1>
          {win
            ? <h1 className={`text-7xl font-black pt-1 pb-12 italic bg-gradient-to-tr from-red-600 via-orange-500 to-yellow-500 text-transparent bg-clip-text ${theme === 'light' ? 'drop-shadow-[0_0_10px_rgba(284,120,21,0.5)]' : 'drop-shadow-[0_0_10px_rgba(1,1,1,0.4)]'}`}>Ganado!</h1>
            : <h1 className={`text-7xl font-black pt-1 pb-12 italic bg-gradient-to-tr from-cyan-700 via-teal-600 to-teal-400 text-transparent bg-clip-text ${theme === 'light' ? 'drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]' : 'drop-shadow-[0_0_10px_rgba(1,1,1,0.4)]'}`}>Perdido!</h1>
          }

        </div>


          <button
            className="btn-md bg-blue-gradient flex flex-row gap-2 items-center justify-center"
            onClick={() => []}
          >
            Siguiente
            <ArrowLongRightIcon className="h-6 w-6 text-[var(--color-dark)] mt-0.4" />
          </button>
        </div>

      </div>
      {/* <div>
      <h1>{win ? 'Victoria!': 'Derrota'}</h1>
      <h3>Has ganado: {sudokoins} sudokoins</h3>
      <p>Completado en: {String(completedTime)}</p>
      <p>Casillas completadas: {getTotalOfCompletedNumbers()}</p>
    </div> */}

    </>
  )
}
