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

  useEffect(() => {
    dispatch(getFeeds()).then(() => {});
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
