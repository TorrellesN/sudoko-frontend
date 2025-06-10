import { CSSProperties } from "react";
import { PlayerCell, RolNumber } from "../../domain";
import { RolColors } from "../../utilities/constants";

// Definir RolColors fuera del componente

export const getPlayerStyle = (rol: RolNumber | undefined, variant: "light" | "dark" | "system" = "light", isUser: boolean) => {
  if (!rol) return {};
  if (isUser) {
    return playerStyles[`rol${rol}`]
  }
  return variant === 'light' ? playerStyles[`rol${rol}`] : playerStyles[`number${rol}`];
}

export const getRolBgBase = (rol: RolNumber | undefined): CSSProperties => {
  if (!rol) return {};
  return {
    backgroundColor: `var(${RolColors[rol].base})`
  };
};

const generateStyles = () => {
  const styles: Record<string, CSSProperties> = {}

  for (let index = 1; index <= 4; index++) {
    const rol = index as RolNumber

    styles[`rol${rol}`] = {
      backgroundColor: `var(${RolColors[rol].bg})`,
      color: `var(${RolColors[rol].contrast})`
    }

    styles[`number${rol}`] = {
      backgroundColor: `var(--board-bg-players)`,
      color: `var(${RolColors[rol].base})`
    }
  }

  return styles
}

const playerStyles = generateStyles();


/* Sudoku cell styles */
const isInSameRowOrCol = (row: number, col: number, selectedCell: { row: number; col: number } | null): boolean => {
  if (!selectedCell) return false;
  return selectedCell.row === row || selectedCell.col === col;
};

const hasSameNumber = (cell: PlayerCell, selectedNumber: number | null): boolean => {
  if (!selectedNumber || !cell) return false;
  return cell.value === selectedNumber;
};


export const getCellStyles = (row: number, col: number, cell: PlayerCell, selectedCell: { row: number; col: number } | null, selectedNumber: number | null): CSSProperties => {
  const isSelected = selectedCell?.row === row && selectedCell?.col === col;
  const inSameRowOrCol = isInSameRowOrCol(row, col, selectedCell);
  const sameNumber = hasSameNumber(cell, selectedNumber);
  /* const selectable = isCellSelectable(cell); */



  const borderStyles = getCellBorderStyles(row, col);
  
  let backgroundStyles: CSSProperties = {};
  
  if (isSelected) {
    backgroundStyles = { backgroundColor: 'var(--board-selected)', color: 'var(--light-color)' };
  } else if (sameNumber) {
    backgroundStyles = { backgroundColor: 'var(--board-selected-numbers)' };
  } else if (inSameRowOrCol) {
    backgroundStyles = { backgroundColor: 'var(--board-selected-rowcol)' };
  } else if (cell && cell.rol === 0) {
    backgroundStyles = { backgroundColor: 'var(--base-300)', };
  }

  return { ...borderStyles, ...backgroundStyles };
};

const getCellBorderStyles = (row: number, col: number): CSSProperties => {
  const borderStyles: CSSProperties = {
    borderColor: 'var(--border-color)',
  };

  // Top border
  if (row === 0) {
    borderStyles.borderTopWidth = 0;
  } else if (row % 3 === 0) {
    borderStyles.borderTopWidth = '2px';
  } else {
    borderStyles.borderTopWidth = '0.5px';
  }

  // Bottom border
  if (row === 8) {
    borderStyles.borderBottomWidth = 0;
  } else {
    borderStyles.borderBottomWidth = '0.5px';
  }

  // Left border
  if (col === 0) {
    borderStyles.borderLeftWidth = 0;
  } else if (col % 3 === 0) {
    borderStyles.borderLeftWidth = '2px';
  } else {
    borderStyles.borderLeftWidth = '0.5px';
  }

  // Right border
  if (col === 8) {
    borderStyles.borderRightWidth = 0;
  } else {
    borderStyles.borderRightWidth = '0.5px';
  }

  // Border radius
  if (row === 0 && col === 0) {
    borderStyles.borderTopLeftRadius = '0.125rem';
  } else if (row === 0 && col === 8) {
    borderStyles.borderTopRightRadius = '0.125rem';
  } else if (row === 8 && col === 0) {
    borderStyles.borderBottomLeftRadius = '0.125rem';
  } else if (row === 8 && col === 8) {
    borderStyles.borderBottomRightRadius = '0.125rem';
  }

  return borderStyles;
};


/* Player gradients methods */
export const getPlayerGradient = (rol: RolNumber | undefined = 0) => {
  let bottomColor = 4;
  if (rol == 1) { bottomColor = 4; }
  else if (rol == 4) { bottomColor = 1; }
  else if (rol == 2) return {
    background: `linear-gradient(to bottom, var(--rol-${rol}-base-color), var(--border-color))`,
  };
  else { bottomColor = rol + 1; }
  return {
    background: `linear-gradient(to bottom, var(--rol-${rol}-base-color), var(--rol-${bottomColor}-base-color))`,
  };
}