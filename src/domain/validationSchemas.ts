import { z } from 'zod'

export const UserRegisterDataSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener más de 3 caracteres").max(20, "El nombre de usuario no puede tener más de 20 caracteres"),
  email: z.string().min(1, "Campo requerido").email("Email no válido"),
  pwd: z.string()
    .min(8, "Debe tener mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
  pwdRep: z.string()
}).refine(data => data.pwd === data.pwdRep, {
  message: "Las contraseñas no coinciden",
  path: ["pwdRep"]
})


export const UserLoginDataSchema = z.object({
  email: z.string().min(1, "Campo requerido"),
  pwd: z.string().min(1, "Campo requerido")
})

export const UserLoginDataWRememberSchema = UserLoginDataSchema.extend({
  rememberme: z.boolean(),
});

export const UserSchema = z.object({
  username: z.string(),
  email: z.string(),
  profileImg: z.string()

})

export const UserLogedSchema = z.object({
  user: UserSchema,
  token: z.string()
})

export const EditUserSchema = z.object({
  profileImg: z.string(),
  username: z.string().min(3, "El nombre de usuario debe tener más de 3 caracteres").max(20, "El nombre de usuario no puede tener más de 20 caracteres"),
  pwd: z.string().optional().or(z.literal('')),
  newPwd: z.string().optional().or(z.literal('')),
  newPwdRep: z.string().optional().or(z.literal(''))
}).refine(
  (data) => {
    if (data.newPwd && data.newPwd.length > 0) {
      return data.newPwd === data.newPwdRep;
    }
    return true;
  },
  {
    message: "Las contraseñas no coinciden",
    path: ["newPwdRep"]
  }
).refine(
  (data) => {
    if (data.newPwd && data.newPwd.length > 0) {
      return data.newPwd.length >= 8;
    }
    return true;
  },
  {
    message: "La nueva contraseña debe tener mínimo 8 caracteres",
    path: ["newPwd"]
  }
).refine(
  (data) => {
    if (data.newPwd && data.newPwd.length > 0) {
      return !!data.pwd && data.pwd.length > 0;
    }
    return true;
  },
  {
    message: "Debe proporcionar su contraseña actual para cambiarla",
    path: ["pwd"]
  }
)








