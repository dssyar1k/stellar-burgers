import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getFeedOrders, getFeeds } from '../../services/feedSlice';
import { getLoading } from '../../services/burgerConstructorSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const loading = useSelector(getLoading);
  const orders: TOrder[] = useSelector(getFeedOrders);

  // Инициируем загрузку фида при монтировании компонента
  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  // Отображаем прелоадер, если идёт загрузка или нет заказов
  if (loading || orders.length === 0) {
    return <Preloader />;
  }

  // Основной рендер: передаём заказы и функцию обновления в UI-компонент
  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
