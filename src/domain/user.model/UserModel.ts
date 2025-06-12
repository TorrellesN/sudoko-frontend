import { z } from "zod";
import { EditUserSchema, UserLogedSchema, UserLoginDataWRememberSchema, UserRegisterDataSchema, UserSchema } from "../validationSchemas";

/* SCHEMA IMPLEMENTATION */
export type UserLoginData = z.infer<typeof UserLoginDataWRememberSchema>;
export type UserRegisterData = z.infer<typeof UserRegisterDataSchema>;
export type UserLogedData = z.infer<typeof UserLogedSchema>;
export type EditUserData = z.infer<typeof EditUserSchema>;

export type User = z.infer<typeof UserSchema>;

export interface UserDetails extends User {
    league ?: string,
    sudokoins ?: number,
    totalPlayed ?: number,
    totalWins ?: number,
    easyWins ?: number,
    mediumWins ?: number,
    hardWins ?: number
}

/* OTHER USER TYPES */

export type Player = Pick<User, 'username' | 'profileImg' | 'email'> & {rol: RolNumber, comboAcc?: number, points?: number, ready?: boolean};

export type RolNumber = 0 | 1 | 2 | 3 | 4;