import { SudokuPVP } from "./sudoku.model/Sudoku";
import { Player, RolNumber } from "./user.model/UserModel";

export type SocketCResponse = {success: boolean, payload: any}
export const pointsPerCell = 5;

export type SudokuPvpResolvedResponse = {
    sudokuSolved: SudokuPVP['current']
    players: Player[];
    playersSudokoins: { rol: RolNumber, sudokoins: number, win: boolean }[];
    createdAt?: Date,
}