import { useSelector } from '../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../components/ui/preloader/preloader';
import { selectUser, selectIsAuthChecked } from '../services/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  // Пока идёт проверка авторизации — показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Для неавторизованных пользователей: если требуется только неавторизованный доступ, а пользователь авторизован
  if (onlyUnAuth && user) {
    const fromPath = (location.state as { from?: string })?.from || '/';
    return <Navigate to={fromPath} replace />;
  }

  // Для авторизованных пользователей: если требуется авторизация, но пользователь не авторизован
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }

  // Если все проверки пройдены — отдаём дочерние компоненты
  return children;
};
