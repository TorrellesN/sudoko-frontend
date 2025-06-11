import { UserDetails, EditUserData, User } from "../../domain";
import { request } from "../../utilities/apiConfig/axios";

export async function getUserDetailsService(): Promise<UserDetails> {
  try {
    const data = await request<UserDetails>("get", '/users/');
    
    if (!data) {
      throw { status: 404, message: ""};
    }
    return data;

  } catch (error: any) {
    if (error.status === 401) {
      error.message = "No tienes autorización para acceder a estos datos.";
      throw error;
    } else if (error.status === 404) {
      error.message = "No se pudo obtener la información del usuario.";
      throw error;
    } else {
      throw error;
    }
  }
};

export async function editUserService(userData: EditUserData): Promise<User> {
  try {

    const data = await request<User>("put", '/users/',  userData );

     if (!data) {
      throw { status: 404, message: ""};
    }
    return data;

  } catch (error: any) {

    if (error.status === 401) {
      error.message = "No tienes autorización para acceder a estos datos.";
      throw error;
    }else if (error.status === 503) {
      error.message = "Es posible que no hayas introducido bien la contraseña, inténtalo de nuevo.";
      throw error;
    }
     else if (error.status === 404) {
      error.message = "No se pudo obtener la información del usuario.";
      throw error;
    } else {
      throw error;
    }
  }
};