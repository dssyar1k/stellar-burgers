import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  getFeedOrders,
  getTotalOrders,
  getTotalToday
} from '../../services/feedSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Получаем данные из хранилища
  const orders: TOrder[] = useSelector(getFeedOrders);
  const total = useSelector(getTotalOrders);
  const totalToday = useSelector(getTotalToday);

  // Формируем объект с общей статистикой
  const feed = {
    total: total,
    totalToday: totalToday
  };

  // Получаем списки заказов по статусам
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  // Возвращаем UI-компонент с переданными данными
  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
