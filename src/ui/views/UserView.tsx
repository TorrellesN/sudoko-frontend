import { Link, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../application/store/useAppStore';

export default function HomeView() {

  const navigate = useNavigate();
  const user = useAppStore(state => state.user)



  return (
    <div className='container flex flex-col items-center justify-center mx-auto max-w-screen-2xl'>
      <h1 className="text-5xl font-bold pt-22 pb-12">Bienvenido, {user.username || ''}</h1>

      <div className=' container mx-auto px-6 md:px-18 py-12 flex flex-col gap-6 max-w-md  glass-card'>
        <h5 className='pb-4'>Qué te apetece hoy?</h5>
        <button
          className="btn-xl bg-blue-gradient"
          onClick={() => navigate('/pve/create')}
        >
          Un jugador
        </button>

        <button
          className="btn-xl-light bg-red-gradient "
          onClick={() => navigate('/pvp/create')}
        >
          Multijugador
        </button>
        <p className='text-md font-medium secondary-text text-center mt-[-1rem]'>Recuerda que sólo consigues sudokoins en el modo multijugador.</p>
        <h5 className='pt-14 text-center secondary-text'>
          Quieres saber más sobre nosotros?
          <br />
          <Link
            className="primary-color-text font-bold hover:underline transition-all"
            to='/home'
          >Haz click aquí</Link>
        </h5>
      </div>

    </div>
  )
}
