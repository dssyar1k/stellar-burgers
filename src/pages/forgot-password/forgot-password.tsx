import { FC, useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  // Состояние для хранения email и ошибок
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);

  // Хук для навигации по приложению
  const navigate = useNavigate();

  // Обработчик отправки формы восстановления пароля
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    // Отправляем запрос на восстановление пароля
    forgotPasswordApi({ email })
      .then(() => {
        localStorage.setItem('resetPassword', 'true');

        navigate('/reset-password', { replace: true });
      })
      .catch((err) => {
        setError(err);
      });
  };

  // Эффект для проверки наличия refreshToken при загрузке компонента
  useEffect(() => {
    if (localStorage.getItem('refreshToken')) {
      // Если refreshToken есть — перенаправляем на главную
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Рендер UI-компонента с передачей необходимых пропсов
  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
