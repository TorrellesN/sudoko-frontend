import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavMenu from './NavMenu'
import NavItems from './NavItems';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import { useQuitGameModal } from '../../sharedComponents/quitGameModal/useQuitGameModal';
import QuitGameModal from '../../sharedComponents/quitGameModal/QuitGameModal';
import { useAppStore } from '../../../../application/store/useAppStore';
import { Socket } from 'socket.io-client';
import { SocketContext } from '../../../../application/context/socketContext';
import { diffOptions, SocketCResponse } from '../../../../domain';

export default function NavBar({ isLightBg }: { isLightBg: boolean }) {
    const { open, close, isOpenModal } = useQuitGameModal();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isGameRoute, setIsGameRoute] = useState(false);
    const [isPvpSudoku, setIsPvpSudoku] = useState(false);
    const restartSudokuState = useAppStore(state => state.restartSudokuState);
    const difficulty = useAppStore(state => state.difficulty);
    const players = useAppStore(state => state.players);
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        const checkRoute = () => {
            const path = window.location.pathname;
            setIsGameRoute(path.startsWith('/pvp/sudoku') || path.startsWith('/pve/sudoku'));
        };
        checkRoute();
        window.addEventListener('popstate', checkRoute);

        return () => {
            window.removeEventListener('popstate', checkRoute);
        };
    }, []);

    useEffect(() => {
        const path = window.location.pathname;
        setIsGameRoute(path.startsWith('/pvp/sudoku') || path.startsWith('/pve/sudoku'));
        setIsPvpSudoku(path.startsWith('/pvp/sudoku'));
    }, [navigate]);


    const authOptions: Record<string, () => void> = {
        'Perfil': () => {
            navigate('/profile')
        },
        'Ir a inicio': () => {
            navigate('/home')
        }
    }

    const generalOptions: Record<string, () => void> = {
        'Sobre nosotros': () => {
            navigate('/home')
        },
        'Login': () => {
            navigate('/auth/login')
        },
    }

    const gameOptions: Record<string, () => void> = {

        'Ir a inicio': () => {
            navigate('/home')
        },
        'Abandonar': () => {
            open();
        }
    }

    const handleQuit = () => {
        if (players.length < 1) {
            console.log('Abandonando juego PVE');
            socket.emit('quit-pve-game');
        } else {
            console.log('Abandonando juego PVP');
            socket.emit('quit-pvp-game', difficulty, (response: SocketCResponse) => {
                if (response.success) {
                    console.log('Juego abandonado correctamente');
                    /* restartSudokuState();
                    navigate('/') */
                }

            });
        }

    }

    return (
        <header className={`${isLightBg ? 'bg-[var(--base-100)] transition-colors duration-200 ' : 'bg-[var(--base-200)] '} md:bg-[var(--base-200)] py-3 sm:py-5 px-4 select-none`}>
            <div className="max-w-screen-2xl mx-auto flex flex-row justify-between items-center">
                <div>
                    <Link to={'/'} >
                        <Logo />
                    </Link>
                </div>
                {isPvpSudoku ? <p className='sm:hidden xs:block font-medium text-md font-italic'>Nivel: <span className='text-[var(--primary-color)]'>{diffOptions[difficulty]}</span></p> : ('')}

                {/* {isSmallScreen && ( */}
                <div className="hidden sm:flex items-center space-x-8">
                    {!token ? (
                        <NavItems options={generalOptions} />
                    ) : token && !isGameRoute ? (
                        <NavItems options={authOptions} />
                    ) : (
                        <NavItems options={gameOptions} />
                    )}
                    <ThemeToggle />
                </div>
                {/* )} */}

                <div className="sm:hidden xs:flex items-center space-x-4 space-y-2">
                    {!token ? (
                        <NavMenu options={generalOptions} />
                    ) : token && !isGameRoute ? (
                        <NavMenu options={authOptions} />
                    ) : (
                        <NavMenu options={gameOptions} />
                    )}

                </div>
                <QuitGameModal isOpenModal={isOpenModal} close={close} handleQuit={handleQuit} />
            </div>
        </header>
    )
}
