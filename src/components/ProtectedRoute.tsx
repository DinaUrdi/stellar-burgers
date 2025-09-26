import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  isAuth: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({ isAuth, children }: ProtectedRouteProps) => {
  if (!isAuth) {
    return <Navigate to='/login' replace />;
  }
  return children;
};
