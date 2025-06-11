import { Navigate, Outlet } from "react-router-dom";

interface AuthRoutesProps {
    isAuth: boolean;
    redirectTo?: string;
  }
  
  export default function AuthRoutes({ isAuth, redirectTo = "/home" }: AuthRoutesProps) {
    if (!isAuth) {
      return <Navigate to={redirectTo} replace />;
    }
  
    return <Outlet />;
  }