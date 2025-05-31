import { request } from "../../utilities/apiConfig/axios";
import { UserLoginData, UserLogedData, UserLogedSchema, UserRegisterData } from "../../domain";


type errorApi = {
  status: number,
  message: string
}

export async function loginService(user: UserLoginData): Promise<UserLogedData> {
  try {

    const data = await request("post", '/users/login', { email: user.email, pwd: user.pwd });
    console.log('desde peticion service', data);
    const result = UserLogedSchema.safeParse(data)

    if (result.success) {
      const userLoged = result.data as UserLogedData;

      return userLoged;
    
    } else {
      throw { status: 404 }
    }

  } catch (error: any) {

    if (error.status === 401) {
      console.log('desde servic: ', error.message)
      error.message = "El usuario o la contraseña son incorrectos.";
      throw error;
    } else if (error.status === 404) {
      console.log('desde service: ', error.message)

      throw error;
    } else {
      console.log('desd: ', error.message)
      throw error;

    }
  }
};

export async function registerService(user: UserRegisterData): Promise<UserLoginData> {
  try {
    const {username, email, pwd} = user;

    const data: { message: string } = await request("post", '/users/register', {username, email, pwd});
    console.log('desde peticion service', {data});
    if (data.message === 'ok') {
      return {email, pwd, rememberme: false};
    } else {
      throw { status: 404 , message: "Algo raro pasa aquí"}
    }

  } catch (error: any) {

    if (error.status === 401) {
      console.log('desde servic: ', error.message)
      error.message = "Los datos parecen ser incorrectos, inténtalo de nuevo más adelante.";
      throw error;
    } else if (error.status === 409) {
      console.log('desde service: ', error.message)
      error.message = "Ya existe un usuario con estas credenciales, prueba a introducir otro nombre de usuario o contraseña.";
      throw error;
    } else {
      console.log('desde: ', error.message)
      throw error;

    }
  }
};