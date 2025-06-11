import { StateCreator } from "zustand";
import { Difficulty, PlayerSudokuBoard, SudokuBoardSolved, SudokuStatus, Player, initialPVESudoku, SudokuPVE, SudokuPVP, CellToInsert, pointsPerCell, RolNumber, initialPVPSudoku, SudokuPvpResolvedResponse } from "../../domain/";

export type SudokuStateType = {
  id?: string,
  current: PlayerSudokuBoard,
  solved: SudokuBoardSolved,
  status: SudokuStatus,
  completedTime?: Date,
  players: Player[]
  difficulty: Difficulty,
  comboAcc: number,
  points: number,
  rol: RolNumber,
  sudokoins: number,
  win: boolean,
  setInnitialSudokuState: (sudoku: SudokuPVE | SudokuPVP) => void,
  setStartedSudokuState: (sudoku: SudokuPVE | SudokuPVP) => void,
  setSelfPlayer: (player: Player) => void,
  restartSudokuState: () => void,
  calculatePoints: () => number,
  isCorrectNumber: (number: number, row: number, col: number) => boolean,
  savePVEMove: (cellToInsert: CellToInsert, calculatedPoints: number) => void,
  savePVPSelfMove: (cellToInsert: CellToInsert, calculatedPoints: number) => void,
  savePVPPlayerMove: (cellToInsert: CellToInsert, player: Player) => void,
  resetCombo: () => void,
  fillEmptyCells: () => void,
  setFinishedStatePve: () => void,
  setFinishedStatePvp: (finishObj: SudokuPvpResolvedResponse) => void,
  addPLayer: (player: Player) => void,
  removePlayer: (username: string) => void,
  setReadyOrWaitingPlayer: (username: string) => void,
  areAllPlayersReady: () => boolean,
  resetOtherPlayersCombo: (email: string) => void,
  getTotalOfCompletedNumbers: () => number
}




export const createSudokuSlice: StateCreator<SudokuStateType> = (set, get, api) => ({
  id: initialPVESudoku.id,
  current: initialPVESudoku.current,
  solved: initialPVESudoku.solved,
  status: initialPVESudoku.status,
  players: initialPVPSudoku.players,
  difficulty: initialPVESudoku.difficulty,
  comboAcc: 0,
  points: 0,
  rol: 0,
  completedTime: undefined,
  sudokoins: 0,
  win: false,



  setInnitialSudokuState: (sudoku: SudokuPVE | SudokuPVP) => {

    if ('players' in sudoku && sudoku.players.length > 0) {
      sudoku.players.forEach((player: Player) => { player.ready = false });
    }

    set({
      id: sudoku.id,
      current: sudoku.current,
      solved: sudoku.solved,
      status: 'started',
      players: 'players' in sudoku ? sudoku.players : [],
      difficulty: sudoku.difficulty,
      comboAcc: 0,
      points: 0,
      completedTime: undefined,
      sudokoins: 0,
      win: false,
    })
    if (!('players' in sudoku)) {
      localStorage.setItem('sudokuRoomPve', sudoku.id!)
      set({ rol: 1 });
    }
  },

  setStartedSudokuState: (sudoku: SudokuPVE | SudokuPVP) => {
    let players: Player[] = []
    const { user } = api.getState() as any;
    if ('players' in sudoku) {
      players = sudoku.players.filter((player: Player) => player.email !== user.email);
    }

    set({
      id: sudoku.id,
      current: sudoku.current,
      solved: sudoku.solved,
      status: 'started',
      players: players,
      difficulty: sudoku.difficulty,
    })

    //TODO: por el momento usar api para recoger algo del otro slice, más tarde implementar bien zustand

    if (!('players' in sudoku) && 'player' in sudoku) {
      set({
        comboAcc: sudoku.player?.comboAcc && sudoku.player?.comboAcc > 10 ? 10 : sudoku.player?.comboAcc || 0,
        points: sudoku.player?.points || 0,
        rol: 1
      })
      localStorage.setItem('sudokuRoomPve', sudoku.id!)

    } else if ('players' in sudoku) {
      const player = sudoku.players.find((player: Player) => player.email === user.email)
      get().setSelfPlayer(player!);
    }
  },


  restartSudokuState: () => {
    const sudokuLSObj = localStorage.getItem('sudokuRoomPvp') ? JSON.parse(localStorage.getItem('sudokuRoomPvp')!) : null;
    const sudokuPve = localStorage.getItem('sudokuRoomPve');
    set({
      id: '',
      current: initialPVESudoku.current,
      solved: initialPVESudoku.solved,
      status: 'started',
      players: [],
      difficulty: initialPVESudoku.difficulty,
      comboAcc: 0,
      points: 0,
      rol:0
    });

    if (sudokuLSObj) {
      localStorage.removeItem('sudokuRoomPvp');
    } else if (sudokuPve) {
      localStorage.removeItem('sudokuRoomPve');
    }

  },


  setSelfPlayer: (player: Player) => {

    set({
      comboAcc: player?.comboAcc && player?.comboAcc > 10 ? 10 : player?.comboAcc || 0,
      points: player?.points || 0,
      rol: player.rol,
    })
  },

  addPLayer: (player: Player) => {
    const { players } = get();
    player.ready = false;
    const newPlayers = [...players, player];
    newPlayers.forEach((p) => { p.ready = false });
    set({ players: newPlayers })
  },


  removePlayer: (username: string) => {
    const { players } = get();
    const newPlayers = players.filter((p) => p.username !== username);
    newPlayers.forEach((p) => { p.ready = false });
    set({ players: newPlayers })
  },


  setReadyOrWaitingPlayer: (username: string) => {
    const { players } = get();
    const newPlayers = players.map((p) => {
      if (p.username === username) {
        return { ...p, ready: !p.ready };
      }
      return p;
    });
    set({ players: newPlayers });
  },


  areAllPlayersReady: () => {
    const { players } = get();
    let allReady = false;
    if (players.length >= 1) {
      allReady = players.every((player) => player.ready === true);
    }
    return allReady;
  },




  calculatePoints: () => {
    const { comboAcc, points } = get();
    if (comboAcc >= 10) {
      return points + pointsPerCell + (10 * 2);
    }
    return points + pointsPerCell + (comboAcc * 2);
  },


  isCorrectNumber: (number: number, row: number, col: number) => {

    if (number === get().solved[row][col]) {
      return true;
    } else {
      return false;
    }
  },


  resetCombo: () => {
    set({ comboAcc: 0 })
  },


  resetOtherPlayersCombo: (email: string) => {
    const { players } = get();
    const newPlayers = players.map((p) => {
      if (p.email === email) {
        return { ...p, comboAcc: 0 };
      }
      return p;
    });
    console.log('newPlayers', newPlayers)
    set({ players: newPlayers });
  },


  savePVEMove: (cellToInsert: CellToInsert, calculatedPoints: number) => {
    const { current } = get();
    const { row, col, value } = cellToInsert;
    const newCurrent = [...current];
    newCurrent[row][col] = { value, rol: 1 };

    set((state) => ({
      ...state,
      current: newCurrent,
      points: calculatedPoints,
      comboAcc: state.comboAcc >= 10 ? 10 : state.comboAcc + 1
    }))

  },


  savePVPSelfMove: (cellToInsert: CellToInsert, calculatedPoints: number) => {
    const { current, rol } = get();
    const { row, col, value } = cellToInsert;
    const newCurrent = [...current];
    newCurrent[row][col] = { value, rol: rol || 1 };

    set((state) => ({
      ...state,
      current: newCurrent,
      points: calculatedPoints,
      comboAcc: state.comboAcc >= 10 ? 10 : state.comboAcc + 1
    }))

  },


  savePVPPlayerMove: (cellToInsert: CellToInsert, player: Player) => {
    const { current, players } = get();
    const { row, col, value } = cellToInsert;
    const newCurrent = [...current];
    newCurrent[row][col] = { value, rol: player.rol };

    const newPlayers = [...players];
    const playerIndex = newPlayers.findIndex((p) => p.email === player.email);
    newPlayers[playerIndex].comboAcc = player.comboAcc;
    newPlayers[playerIndex].points = player.points;

    set((state) => ({
      ...state,
      current: newCurrent,
      players: newPlayers,
    }))

  },


  fillEmptyCells: () => {
    const rol = 0;

    const { current, solved } = get();
    const newCurrent = current;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (current[row][col] === null) {
          newCurrent[row][col] = { rol: rol, value: solved[row][col] };

        }
      }
    }

    newCurrent[0][0] = null;
    set({
      current: newCurrent
    })
  },


  setFinishedStatePve: () => {
    localStorage.removeItem('sudokuRoomPve');
    set({ status: 'finished' })
    //TODO: poner el sudoku a 0 cuando cambien de la pantalla de finalizado. Mandar borrar sudoku a backend
  },

  setFinishedStatePvp: (finishObj) => {
    localStorage.removeItem('sudokuRoomPvp');
    const { rol } = get()
    const playerStats = finishObj.playersSudokoins.find((obj) => obj.rol === rol) || { sudokoins: 0, win: false };
    set({
      current: finishObj.sudokuSolved,
      status: 'finished',
      completedTime: finishObj.createdAt ? new Date(Number(finishObj.createdAt) - Date.now()) : new Date(),
      sudokoins: playerStats.sudokoins,
      win: playerStats.win,
    })
    //TODO: poner el sudoku a 0 cuando cambien de la pantalla de finalizado. Mandar borrar sudoku a backend
  },

  getTotalOfCompletedNumbers: () => {
    const { current, rol } = get();
    let total = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (current[row][col]?.rol === rol) {
          total++;
        }
      }
  }
    return total;
  },

})
