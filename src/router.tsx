import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { SocketProvider } from "./application/context/socketContext";
import { useInitializeAuth } from "./application/hooks/useInitializeAuth";
import AuthRoutes from "./routes/AuthRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import AppLayout from "./ui/layouts/AppLayout";
import PveCreateSudokuView from "./ui/views/pveCreateSudokuView/PveCreateSudokuView";
import HomeView from "./ui/views/HomeView";
import LoginView from "./ui/views/loginView/LoginView";
import PveSudokuView from "./ui/views/pveSudokuView/PveSudokuView";
import RegisterView from "./ui/views/registerView/RegisterView";
import UserView from "./ui/views/UserView";
import PveGameWinView from "./ui/views/GameFinishViews/PveGameWinView";
import { useAppStore } from "./application/store/useAppStore";
import PvpCreateSudokuView from "./ui/views/pvpCreateSudokuView/PvpCreateSudokuView";
import PvpWaitingView from "./ui/views/pvpWaitingView/PvpWaitingView";
import PvpSudokuView from "./ui/views/pvpSudokuView/PvpSudokuView";
import PvpGameFinishView from "./ui/views/GameFinishViews/PvpGameFinishView";
import { ThemeProvider } from "./application/context/themeContext";
import { ViewTransition } from "./ui/layouts/ViewTransition";
import UserDetailsView from "./ui/views/userDetailsView/UserDetailsView";
import LoadingText from "./ui/components/sharedComponents/LoadingText";

const AppRoutes = () => {
    const location = useLocation();
    const { isInitialized, decodedToken, isExpired } = useInitializeAuth();
    const token = useAppStore(state => state.token);
    const isAuth = Boolean(token);

    if (!isInitialized) {
        return <LoadingText />;
    }

    return (
        <Routes location={location} key={location.pathname}>
            <Route element={<AppLayout expiredTokenProps={{ isExpired, decodedToken }} />}>
                <Route element={<PublicRoutes isAuth={isAuth} redirectTo="/" />}>
                    <Route path="/auth/login" element={<ViewTransition><LoginView /></ViewTransition>} />
                    <Route path="/auth/register" element={<ViewTransition><RegisterView /></ViewTransition>} />
                </Route>

                <Route element={<AuthRoutes isAuth={isAuth} redirectTo="/auth/login" />}>
                    <Route element={<ViewTransition><UserView /></ViewTransition>} path="/" />
                    <Route path="/pve/create" element={<ViewTransition><PveCreateSudokuView /></ViewTransition>} />
                    <Route path="/pve/sudoku" element={<ViewTransition><PveSudokuView /></ViewTransition>} />
                    <Route path="/pve/win" element={<ViewTransition><PveGameWinView /></ViewTransition>} />

                    <Route path="/pvp/create" element={<ViewTransition><PvpCreateSudokuView /></ViewTransition>} />
                    <Route path="/pvp/waiting" element={<ViewTransition><PvpWaitingView /></ViewTransition>} />
                    <Route path="/pvp/sudoku" element={<ViewTransition><PvpSudokuView /></ViewTransition>} />
                    <Route path="/pvp/win" element={<ViewTransition><PvpGameFinishView /></ViewTransition>} />

                    <Route path="/profile" element={<ViewTransition><UserDetailsView /></ViewTransition>} />
                </Route>

                {/* ruta pública por defecto */}
                <Route path="/home" element={<ViewTransition><HomeView isAuth={isAuth} redirectTo="/" /></ViewTransition>} index />

                <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
        </Routes>
    );
};

export default function RouterApp() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <SocketProvider>
                    <AppRoutes />
                </SocketProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}
