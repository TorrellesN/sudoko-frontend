import React, { useContext, useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../../../application/store/useAppStore';
import { PlayerCell } from '../../../../domain';
import { getPlayerStyle, getCellStyles } from '../../../styles/sudokuCardStyles';
import { ThemeContext } from '../../../../application/context/themeContext';
import Countdown from './Countdown';
import { motion, AnimatePresence } from 'framer-motion';




interface SudokuBoardProps {
  onCellClick: (row: number, col: number, free: boolean) => void,
}


export default function PvpSudokuBoard({ onCellClick }: SudokuBoardProps) {
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const currentSudoku = useAppStore(state => state.current);
  const { theme } = useContext(ThemeContext)

  const handleCellClick = (event: React.MouseEvent, row: number, col: number, cell: PlayerCell) => {
    event.stopPropagation();
    if (boardRef.current && boardRef.current.contains(event.target as Node)) {
      if (cell) {
        setSelectedNumber(cell.value);
        onCellClick(row, col, false);
      } else {
        setSelectedNumber(null);
        onCellClick(row, col, true);
      }
      setSelectedCell({ row, col });
    } else {
      onCellClick(1, 1, false);
    }
  };

  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boardRef.current && !boardRef.current.contains(event.target as Node)) {
        event.stopPropagation();
        setSelectedCell(null);
        setSelectedNumber(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div ref={boardRef} className="flex flex-col items-center w-full max-w-md mx-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <AnimatePresence mode="wait">
        {!isLoading ? (
          <motion.div
            key="sudoku-board"
            className="grid grid-cols-9 w-full aspect-square border-3 border-[var(--border-color)] rounded-sm overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {currentSudoku.map((row, rowIndex) => (
              <React.Fragment key={`row-${rowIndex}`}>
                {row.map((cell, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className='flex items-center justify-center h-full w-full transition-colors duration-200 cursor-pointer font-semibold text-2xl text-[var(--board-text)]'
                    style={{ ...getPlayerStyle(cell?.rol, theme, false), ...getCellStyles(rowIndex, colIndex, cell, selectedCell, selectedNumber) }}
                    onClick={(e) => handleCellClick(e, rowIndex, colIndex, cell)}
                    data-row={rowIndex}
                    data-col={colIndex}
                  >
                    {cell ? (
                      <motion.div
                        key={`cell-value-${cell.value}-${rowIndex}-${colIndex}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.4,
                          scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                        }}
                      >
                        {cell.value}
                      </motion.div>
                    ) : ''}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="countdown-container"
            className="w-full aspect-square"
          >
            <Countdown setIsLoading={setIsLoading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
