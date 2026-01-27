import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from 'react-redux';
import { getIngredientsSelector } from '../../services/ingredientsSlice';
import { useParams } from 'react-router-dom';
import { getFeedOrders } from '../../services/feedSlice';
import { useDispatch } from '../../services/store';
import {
  getOrderByNumber,
  getOrderData
} from '../../services/burgerConstructorSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const orders = useSelector(getFeedOrders);
  const dispatch = useDispatch();

  const orderData = useSelector(getOrderData);
  const ingredients: TIngredient[] = useSelector(getIngredientsSelector);

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  const preparedOrder = useMemo(() => {
    if (!orderData || ingredients.length === 0) {
      return null;
    }

    const formattedDate = new Date(orderData.createdAt);

    type AggregatedIngredient = TIngredient & { count: number };
    type IngredientsMap = { [id: string]: AggregatedIngredient };

    const groupedIngredients: IngredientsMap = {};

    orderData.ingredients.forEach((ingredientId) => {
      const ingredient = ingredients.find((ing) => ing._id === ingredientId);

      if (ingredient) {
        if (!groupedIngredients[ingredientId]) {
          groupedIngredients[ingredientId] = { ...ingredient, count: 1 };
        } else {
          groupedIngredients[ingredientId].count += 1;
        }
      }
    });

    const totalAmount = Object.values(groupedIngredients).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo: groupedIngredients,
      date: formattedDate,
      total: totalAmount
    };
  }, [orderData, ingredients]);

  if (!preparedOrder) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={preparedOrder} />;
};
