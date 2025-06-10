import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { profileImgs } from '../../../../utilities/constants'
import { EditUserData, EditUserSchema } from '../../../../domain'
import { useAppStore } from '../../../../application/store/useAppStore'
import { EyeSlashIcon, EyeIcon, PencilSquareIcon } from '@heroicons/react/16/solid'
import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEditProfile } from '../../../../application/useCases/user.useCases'
import { toast } from 'react-toastify'

export default function EditProfile({ toggleEditProfile }: { toggleEditProfile: () => void }) {
  const user = useAppStore((state) => state.user);
  const { handleSaveProfile, isSaveLoading, saveError } = useEditProfile();
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [showNewPwd, setShowNewPwd] = useState<boolean>(false);
  const [showNewPwdRep, setShowNewPwdRep] = useState<boolean>(false);
  const [imgSelected, setImgSelected] = useState<string>('');
  const [editDataBool, setEditDataBool] = useState({
    username: false,
    pwd: false
  });

  const [defaultData] = useState<EditUserData>(() => {
    return {
      profileImg: user.profileImg || '',
      username: user.username || '',
      pwd: '',
      newPwd: '',
      newPwdRep: ''
    };
  });

  const toggleShowPwd = () => {
    setShowPwd(!showPwd);
  }
  const toggleShowNewPwdRep = () => {
    setShowNewPwdRep(!showNewPwdRep);
  }
  const toggleShowNewPwd = () => {
    setShowNewPwd(!showNewPwd);
  }

  const onUsernameBlur = () => {
    if (getValues("username") === "") {
      user.username && setValue("username", user.username);
    }
    setEditDataBool({ ...editDataBool, username: false });
  }

  const onSelectImg = (imgKey: string) => {
    setValue("profileImg", imgKey);
    setImgSelected(imgKey);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue
  } = useForm<EditUserData>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: defaultData
  })

  const onDiscard = () => {
    reset(defaultData);
    toggleEditProfile();
  }
  const onSubmit = async (formData: EditUserData) => {
    await handleSaveProfile(formData)

    if (saveError) {
      console.error("Error during update:", saveError);
      return;
    }
  };

  useEffect(() => {
    if (!isSaveLoading && saveError) (
      toast.error(saveError)
    )
  }, [isSaveLoading, saveError])

  useEffect(() => {console.log('errors ->', errors)}, [errors])


  return (
    <>



      <div className='flex flex-col items-center justify-center flex-1/2'>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-3 text-sm/6 w-full" noValidate>
          <div className='absolute bottom-0 right-6 space-x-2'>
            <motion.button
              className="btn-sm bg-[var(--secondary-text)] "
              onClick={onDiscard}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-xs font-medium text-[var(--base-100)]">
                Descartar cambios
              </p>
            </motion.button>
            <motion.button
              type="submit"
              className="bg-red-gradient btn-sm "
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-xs font-medium text-[var(--light-color)] ">
                Guardar
              </p>
            </motion.button>

          </div>



          <h5 className='pb-4'>Edita tu perfil</h5>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 ml-2">
              Correo electrónico
            </label>
            <p id="email" className="font-semibold text-[var(--primary-text)] ml-2" aria-label='Total played'>{user.email}</p>
          </div>

          {/* Username */}
          <div className='min-w-30 max-w-100'>
            <label htmlFor="email" className="block text-sm font-medium mb-1 ml-2">
              Nombre de usuario
            </label>

            {editDataBool.username
              ? <>
                <input
                  {...register("username")}
                  type="text"
                  id="username"
                  className={`w-full p-3 border ${errors.username ? 'border-[var(--danger-color)]' : 'border-[var(--base-200)]'} bg-[var(--base-300)] rounded-md
            focus:outline-none focus:ring-0 
            hover:outline-none hover:ring-0 
            focus:border-[var(--secondary-text)]`}
                  onBlur={onUsernameBlur}
                />
                <ErrorMessage
                  errors={errors}
                  name="username"
                  render={({ message }) => <p className="text-[var(--danger-color)] text-xs ml-2">{message}</p>}
                />
              </>
              :
              <button
                onClick={() => setEditDataBool({ ...editDataBool, username: true })}
              >
                <div className='flex flex-row items-end justify-start gap-2'>
                  <p id="email" className="font-semibold text-[var(--primary-text)] ml-2" aria-label='Username'>{getValues("username")}</p>

                  <PencilSquareIcon className="h-5 w-5 text-[var(--secondary-text)]" />
                </div>
              </button>

            }
          </div>

          {/* Password */}


          {editDataBool.pwd
            ?
            <>
              <div >
                <label htmlFor="pwd" className="block text-sm font-medium mb-1 ml-2">
                  Contraseña actual
                </label>
                <div className="relative min-w-30 max-w-100">
                  <input
                    {...register("pwd")}
                    type={showPwd ? 'text' : 'password'}
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
              </div>

              <div className="mb-6">
                <label htmlFor="newPwd" className="block text-sm font-medium mb-1 ml-2">
                  Nueva contraseña
                </label>
                <div className="relative min-w-30 max-w-100">
                  <input
                    {...register("newPwd")}
                    type={showNewPwd ? 'text' : 'password'}
                    id="newPwd"
                    className={`w-full p-3 border ${errors.newPwd ? 'border-[var(--danger-color)]' : 'border-[var(--base-200)]'} bg-[var(--base-300)] rounded-md
            focus:outline-none focus:ring-0 
            hover:outline-none hover:ring-0 
            focus:border-[var(--secondary-text)]`}
                  />
                  {showNewPwd
                    ? <EyeSlashIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[var(--secondary-text)] cursor-pointer" onClick={toggleShowNewPwd} />
                    : <EyeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[var(--secondary-text)] cursor-pointer" onClick={toggleShowNewPwd} />
                  }
                </div>
                <ErrorMessage
                  errors={errors}
                  name="newPwd"
                  render={({ message }) => <p className="text-[var(--danger-color)] text-xs ml-2">{message}</p>}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="newPwdRep" className="block text-sm font-medium mb-1 ml-2">
                  Repetir nueva contraseña
                </label>
                <div className="relative min-w-30 max-w-100">
                  <input
                    {...register("newPwdRep")}
                    type={showNewPwdRep ? 'text' : 'password'}
                    id="newPwdRep"
                    className={`w-full p-3 border ${errors.newPwdRep ? 'border-[var(--danger-color)]' : 'border-[var(--base-200)]'} bg-[var(--base-300)] rounded-md
            focus:outline-none focus:ring-0 
            hover:outline-none hover:ring-0 
            focus:border-[var(--secondary-text)]`}
                  />
                  {showNewPwdRep
                    ? <EyeSlashIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[var(--secondary-text)] cursor-pointer" onClick={toggleShowNewPwdRep} />
                    : <EyeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[var(--secondary-text)] cursor-pointer" onClick={toggleShowNewPwdRep} />
                  }
                </div>
                <ErrorMessage
                  errors={errors}
                  name="newPwd"
                  render={({ message }) => <p className="text-[var(--danger-color)] text-xs ml-2">{message}</p>}
                />
              </div>
            </>

            :
            <div>
              <label htmlFor="pwd" className="block text-sm font-medium mb-1 ml-2">
                Contraseña
              </label>
              <button
                onClick={() => setEditDataBool({ ...editDataBool, pwd: true })}
              >
                <div className='flex flex-row items-end justify-start gap-2'>
                  <p id="pwdChange" className="font-semibold text-[var(--primary-text)] ml-2" aria-label='Password'>••••••</p>

                  <PencilSquareIcon className="h-5 w-5 text-[var(--secondary-text)]" />
                </div>
              </button>
            </div>

          }
        </form>
      </div>


      <div className="hidden md:block w-px h-auto bg-[var(--base-100)] mx-4 shadow-[0_0_10px_2px_var(--shadow-color)]"></div>
      <div className="md:hidden block w-auto h-px bg-[var(--base-100)] mx-4 shadow-[0_0_10px_2px_var(--shadow-color)]"></div>



      <div className="flex flex-col items-center justify-center gap-3 pl-6 md:pl-0 w-full flex-1/2 pb-12 md:pb-5">
        <h5 className='pb-4 pt-5 md:pt-0'>Selecciona el icono que más te guste</h5>
        <div className='flex flex-row align-center justify-center gap-2 flex-wrap max-w-80'>
          {Object.entries(profileImgs).map(([key, imgSrc]) => {
            if (key === '') return null;
            return (
              <div
                key={key}
                className="rounded-full h-[3.8rem] w-[3.8rem] aspect-square bg-[var(--base-300)] hover:bg-[var(--base-100)]
                    cursor-pointer hover:scale-103 transition-all duration-200 ease-in-out"
                onClick={() => onSelectImg(key)}
              >
                <img
                  src={imgSrc}
                  alt={`Profile ${key}`}
                  className={`h-[3.8rem] w-[3.8rem] aspect-square rounded-full border-2 transition-colors ${imgSelected === key ? "border-2 border-[var(--secondary-text)] bg-[var(--base-100)] opacity-100"
                    : "opacity-80 border-[var(--dark-color-border)]/70"
                    }`}
                />
              </div>
            )
          }
          )}
        </div>

      </div>

    </>
  )
}
