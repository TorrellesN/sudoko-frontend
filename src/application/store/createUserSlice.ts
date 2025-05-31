import { StateCreator } from "zustand";
import { User, UserLogedData } from "../../domain";
import { RolNumber } from "../../domain";

export type AuthStateType = {
  user: User,
  token: string | null,
  setLoginState: (userLoged: UserLogedData) => void,
  logout: () => void,

}

const userInitialState = {
  username: '',
  email: '',
  profileImg: ''
}

/* const updateToken = (callbackReEvaluate: (token: string) => void, newToken: string) => {
  callbackReEvaluate(newToken); // actualiza las props decodedToken y isExpired
} */
//SLICE USER
export const createUserSlice: StateCreator<AuthStateType> = (set, get, api) => ({
  user: userInitialState,
  token: null,

  setLoginState: (userLoged: UserLogedData) => {
    set({
      token: userLoged.token,
      user: userLoged.user
    })
    localStorage.setItem('token', userLoged.token)
  },


  logout: () => {
    set(({
      token: '',
      user: userInitialState
    }))
    localStorage.removeItem('token')
  },

})


