import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import NavBar from "../components/layoutComponents/navBar/NavBar";

type AppLayoutProps = {
  expiredTokenProps: {
    isExpired: boolean;
    decodedToken: unknown;
  };
};

export default function AppLayout({expiredTokenProps}: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const {pathname} = location;
  const [isLightBg, setIsLightBg] = useState(false);
  const [isAlwaysLightBg, setIsAlwaysLightBg] = useState(false);

  const routesWithLightBg = ['/pve/sudoku', '/pvp/sudoku', '/pvp/win', '/pve/win'];
  const routesWithLightBgAllDisplays = ['/pvp/win', '/pve/win'];
  
  useEffect(() => {
    if(pathname.includes('sudoku')) {
      
      setIsLightBg(true);
    } else {
      setIsLightBg(false);
    }

    if(pathname.includes('win')) {
      setIsAlwaysLightBg(true);
    } else {
      console.log('aha')
      setIsAlwaysLightBg(false);
    }
    
  }, [location]);

  useEffect(() => {
    if (expiredTokenProps.isExpired && expiredTokenProps.decodedToken) {
      toast.warning('Tu sesión ha caducado, debes volver a logearte.')
      navigate('/auth/login')
    }
  }, [expiredTokenProps.isExpired])


  return (
    <div className={`min-h-screen flex flex-col ${isAlwaysLightBg ? 'bg-[var(--base-100)] transition-colors duration-200' : ''} ${isLightBg ? 'bg-[var(--base-100)] md:bg-transparent transition-colors duration-200' : ''} `}> {/* Si no va bien el footer: min-h-screen flex flex-col justify-between */}
      <NavBar isLightBg={isLightBg} isAlwaysLightBg={isAlwaysLightBg} />

      <main className="flex-1 w-full p-5 mx-auto" > {/* Removed max-w-screen-2xl to allow full width */}
      <div className="w-full mx-auto">
        <Outlet />
      </div>
      </main>
      <footer className="w-full py-5 shadow"> {/* fixed bottom-0 left-0 */}
      <p className="text-center">
        Sudo.ko · Todos los derechos reservados {new Date().getFullYear()}
      </p>
      </footer>
      <ToastContainer
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      hideProgressBar={true}
      />
    </div>
  );
}
