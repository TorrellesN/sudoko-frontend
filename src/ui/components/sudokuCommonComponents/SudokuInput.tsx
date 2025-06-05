import { useEffect } from "react";

type sudokuInputProps = {
    handleInputNumber: (number: number) => void,
    selectedCell: { row: number; col: number } | null
}

export default function SudokuInput({ handleInputNumber, selectedCell }: sudokuInputProps) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Obtenemos el valor de la tecla presionada
            const key = event.key
            // Validamos que sea un número del 1 al 9
            if (/^[1-9]$/.test(key) && selectedCell !== null) {
                handleInputNumber(Number(key))
                console.log(key, selectedCell)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleInputNumber, selectedCell])

    return (
        <div className="h-full w-full flex items-center justify-center pb-8 pt-4 md:pt-8">
            <div className="flex gap-1 w-full max-w-xs sm:max-w-sm md:max-w-70 h-40">
                <div className="grid grid-cols-3 gap-1 flex-1">
                    {numbers.map((number) => (
                        <button
                            key={number}
                            className={`w-full h-full flex items-center justify-center rounded-lg border-2 
                               bg-[var(--base-300)] text-[var(--secondary-text)] text-xl font-bold border-none 
                               hover:bg-[var(--base-200)] hover:text-[var(--primary-text)] transition-colors cursor-pointer
                               active:bg-[var(--base-100)] active:scale-95 active:text-[var(--primary-text)]
                               shadow-inner
                               `}
                            onClick={() => handleInputNumber(number)}
                        >
                            {number}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col justify-between rounded-lg w-16 sm:w-16 md:w-12 lg:w-16 bg-[var(--base-200)]">
                    {/* Function buttons can go here */}
                    <button className="p-2  text-gray-700">
                        1
                    </button>
                    <button className="p-2  text-gray-700 ">
                        2
                    </button>
                    <button className="p-2  text-gray-700">
                        3
                    </button>
                </div>
            </div >
        </div>
    )
}
