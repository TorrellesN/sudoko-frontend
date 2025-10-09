import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UserLoginData, UserLoginDataWRememberSchema } from "../../../domain/";
import { useLogin } from "../../../application/useCases/auth.useCases";
import { useAppStore } from "../../../application/store/useAppStore";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";


export function LoginForm() {

  const [showPwd, setShowPwd] = useState<boolean>(false);
  const { handleLogin, isAuthLoading, authError } = useLogin();
  const token = useAppStore((state) => state.token);

  const toggleShowPwd = () => {
    setShowPwd(!showPwd);
  }

  const [defaultData] = useState<UserLoginData>(() => {
    const remembermeData = localStorage.getItem('userLogin');
    if (remembermeData) {
      const remembermeOb = JSON.parse(remembermeData);
      return {
        email: remembermeOb.email,
        pwd: remembermeOb.pwd,
        rememberme: true
      };
    }
    return {
      email: '',
      pwd: '',
      rememberme: false
    };
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UserLoginData>({
    resolver: zodResolver(UserLoginDataWRememberSchema),
    defaultValues: defaultData
  })

  const onSubmit = async (formData: UserLoginData) => {
    await handleLogin(formData)

    if (authError) {
      console.error("Error during login:", authError);
      return;
    }

    reset();
  };

  useEffect(() => {
    if (!isAuthLoading && token) {
      toast.success('Has iniciado sesión')
    }
    if (!isAuthLoading && authError) (
      toast.error(authError)
    )
  }, [isAuthLoading, authError])



  return (

    <section className="flex flex-col items-center md:items-start justify-center h-screen max-h-140 md:max-h-170 max-w-screen-lg">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:pl-10">
        Iniciar sesión
      </h2>
      <div className="w-full max-w-md my-4 p-8 middle-opaque-card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-3" noValidate>


          {/* email */}
          <div className="">
            <label htmlFor="email" className="block text-sm font-medium mb-1 ml-2">
              Correo electrónico
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className={`w-full p-3 border ${errors.email ? 'border-[var(--danger-color)]' : 'border-[var(--base-200)]'} bg-[var(--base-300)] rounded-md
            focus:outline-none focus:ring-0 
            hover:outline-none hover:ring-0 
            focus:border-[var(--secondary-text)]`}
            />
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => <p className="text-[var(--danger-color)] text-xs ml-2">{message}</p>}
            />
          </div>



          {/* Contraseña */}
          <div className="">
            <label htmlFor="pwd" className="block text-sm font-medium mb-1 ml-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                {...register("pwd")}
                type={showPwd ? "text" : "password"}
                id="pwd"
                className={`w-full p-3 border ${errors.pwd ? 'border-[var(--danger-color)]' : 'border-[var(--base-200)]'} bg-[var(--base-300)] rounded-md
            focus:outline-none focus:ring-0 
            hover:outline-none hover:ring-0 
            focus:border-[var(--secondary-text)]`}
              />
              {showPwd
                ? <EyeSlashIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[var(--secondary-text)] cursor-pointer" onClick={toggleShowPwd} />
                : <EyeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[var(--secondary-text)] cursor-pointer" onClick={toggleShowPwd} />
              }
              </div>
            <ErrorMessage
              errors={errors}
              name="pwd"
              render={({ message }) => <p className="text-[var(--danger-color)] text-xs ml-2">{message}</p>}
            />
            
            {/* Remember */}
            <div className='flex flex-row items-center pt-2 pb-4'>
              <input
                type="checkbox"
                id="rememberme"
                className='mb-1 mr-2 accent-[var(--primary-text)] bg-[var(--base-100]'
                {...register("rememberme")}
              />
              <label htmlFor="rememberme" className="block text-sm font-medium mb-1">
                Recuérdame
              </label>
            </div>
          </div>

          {/* Botón de envío */}
          <motion.button
            type="submit"
            className="btn-md bg-[var(--secondary-text)] flex flex-row gap-2 items-center justify-center w-full mb-2"
            onClick={() => []}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-md font-medium text-[var(--base-100)]">

              {isAuthLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--primary-text)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : 'Iniciar sesión'}
            </p>

          </motion.button>
        </form>

        <div className='flex flex-row w-full text-[var(--secondary-text)] gap-2 items-center py-3' >
          <hr className='w-full ' />
          <div className='text-sm font-medium' >o</div>
          <hr className='w-full ' />
        </div>
        <div className="text-center w-full ">
          <Link
            className=" font-bold hover:underline transition-all text-[var(--secondary-text)]"
            to='/auth/register'
          >Regístrate aquí</Link>
        </div>

      </div>
    </section>


  );
}


