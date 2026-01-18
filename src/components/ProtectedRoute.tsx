import { Navigate, useLocation, type To } from 'react-router-dom';
import { ReactElement } from 'react';

interface ProtectedRouteProps {
  children: ReactElement;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps): ReactElement => {
  const isAuthenticated = false;

  const location = useLocation();

  if (onlyUnAuth && isAuthenticated) {
    const from: To = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
