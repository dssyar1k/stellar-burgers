import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch } from '../../services/store';
import { useSelector } from 'react-redux';
import { getIsLoading, selectUser, updateUser } from '../../services/userSlice';
import { TUser } from '@utils-types';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  // Получаем dispatch для отправки действий в стор
  const dispatch = useDispatch();

  // Извлекаем данные пользователя и статус загрузки из Redux-хранилища
  const user = useSelector(selectUser) as TUser;
  const loading = useSelector(getIsLoading);

  // Состояние формы профиля с начальными значениями
  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  // Обновляем поля формы при изменении данных пользователя
  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  // Проверяем, были ли изменены поля формы
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  // Обработчик отправки обновлённых данных профиля
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password
      })
    );
  };

  // Обработчик отмены изменений — возвращает форму к исходным значениям
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  // Обработчик изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };
  if (loading) {
    return <Preloader />;
  }

  // Рендерим UI-компонент профиля с передачей всех необходимых пропсов
  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
