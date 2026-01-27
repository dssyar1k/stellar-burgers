import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { TLoginData } from '@api';
import { useDispatch } from '../../services/store';
import { getIsLoading, loginUser, selectUser } from '../../services/userSlice';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const Login: FC = () => {
  // Состояние для управления полями формы входа
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(getIsLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Обработчик отправки формы авторизации
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Формирование данных для отправки на сервер
    const userLoginData: TLoginData = {
      email: email,
      password: password
    };

    // Отправка действия для авторизации пользователя
    dispatch(loginUser(userLoginData));
  };

  if (user && !isLoading) {
    return <Navigate to={'/'} />;
  }

  // Рендеринг UI-компонента с передачей всех необходимых пропсов
  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
