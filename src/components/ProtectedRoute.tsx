import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  isAuth: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({ isAuth, children }: ProtectedRouteProps) => {
  const location = useLocation();
  if (!isAuth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }
  return children;
};
