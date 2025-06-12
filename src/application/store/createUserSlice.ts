import { StateCreator } from "zustand";
import { EditUserData, User, UserLogedData } from "../../domain";
import { RolNumber } from "../../domain";

export type AuthStateType = {
  user: User,
  token: string | null,
  setLoginState: (userLoged: UserLogedData) => void,
  setNewProfile: (userData: {username: string, profileImg: string}) => void,
  logout: () => void,

}

const userInitialState = {
  username: '',
  email: '',
  profileImg: ''
}

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

  setNewProfile: (userData) => {
    const currentUser = get().user;
    const updatedUser: User = {
      ...currentUser,
      username: userData.username || currentUser.username,
      profileImg: userData.profileImg || currentUser.profileImg,
    }
    set({ user: updatedUser })
  }

})


