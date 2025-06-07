import { RadioGroup, Radio } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/16/solid'
import React from 'react'
import { diffOptions, diffDetails, Difficulty } from '../../../domain'
import GreenAnimatedBtn from '../sharedComponents/buttons/GreenAnimatedBtn'
import RedAnimatedBtn from '../sharedComponents/buttons/RedAnimatedBtn'
import clsx from "clsx"
import NavigateBackBtn from './NavigateBackBtn'


type CreateSudokuProps = {
  difSelected: string,
  setDifSelected: React.Dispatch<React.SetStateAction<string>>,
  handleSudokuCreate: () => void,
  handleLastGame: () => void,
  disabled: boolean
}

export default function CreateSudokuOptCard({ difSelected, setDifSelected, handleSudokuCreate, handleLastGame, disabled }: CreateSudokuProps) {
  return (
    <div className=' container mx-auto px-6 md:px-18 py-12 flex flex-col md:flex-row gap-6 max-w-5xl glass-card'>
      <div>
        <NavigateBackBtn />
        <h5 className='pb-4 pt-5 md:pt-0'>Elige una dificultad para tu partida:</h5>
        <RadioGroup value={difSelected} onChange={setDifSelected} aria-label="Elegir dificultad">
          {Object.entries(diffOptions).map(([key, option]) => (
            <Radio
              key={option}
              value={option}
              className="group relative flex cursor-pointer rounded-lg bg-[var(--base-100)]/50 px-5 py-4 my-1 shadow-sm transition hover:bg-[var(--base-100)] focus:not-data-focus:outline-none data-checked:bg-[var(--base-100)] data-focus:outline data-focus:outline-white"
            >
              <div className="flex w-full items-center justify-between">
                <div className="text-sm/6">
                  <p className="font-semibold text-[var(--secondary-text)]" aria-label={option}>{option}</p>
                  <div className="flex gap-2 text-[var(--secondary-text)]/50">
                    <div>{diffDetails.get(key as Difficulty)?.[0]}</div>
                    <div aria-hidden="true">&middot;</div>
                    <div>{diffDetails.get(key as Difficulty)?.[1]}</div>
                  </div>
                </div>
                <CheckCircleIcon className={clsx(
                  "size-6 fill-[var(--primary-color)] transition",
                  "opacity-0 group-data-checked:opacity-100",
                  "absolute right-4 top-6 -translate-y-1/2 transform transition-transform"
                )} />
              </div>
            </Radio>
          ))}
        </RadioGroup>

        <RedAnimatedBtn onClick={handleSudokuCreate} text={"Nueva partida"} />

      </div>

      <div className="hidden md:block w-px h-auto bg-[var(--base-100)] mx-4 shadow-[0_0_10px_2px_var(--shadow-color)]"></div>
      <div className="md:hidden block w-auto h-px bg-[var(--base-100)] mx-4 shadow-[0_0_10px_2px_var(--shadow-color)]"></div>

      <div className="flex flex-col items-center justify-center">
        <h5 className='pb-4 text-center secondary-text'>
          Si quieres volver donde te quedaste la última vez:
        </h5>

        <GreenAnimatedBtn onClick={handleLastGame} text={"Volver a la partida"} />
      </div>

    </div>
  )
}
