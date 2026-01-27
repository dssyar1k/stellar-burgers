import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { useSelector } from 'react-redux';
import { getFeedOrders, getProfileOrders } from '../../services/feedSlice';
import { getIsLoading } from '../../services/userSlice';
import { Preloader } from '@ui';
export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getFeedOrders);
  const isLoading = useSelector(getIsLoading);

  useEffect(() => {
    dispatch(getProfileOrders());
  }, [dispatch]);

  if (isLoading) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
