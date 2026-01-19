import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from 'react-redux';
import { getIngredientsSelector } from '../../services/ingredientsSlice';

const INGREDIENTS_LIMIT = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const allIngredients = useSelector(getIngredientsSelector);

  const processedOrder = useMemo(() => {
    if (allIngredients.length === 0) return null;

    // Сопоставляем ID ингредиентов с их данными
    const matchedIngredients = order.ingredients
      .map((id) => allIngredients.find((ing) => ing._id === id))
      .filter(
        (ingredient): ingredient is TIngredient => ingredient !== undefined
      );

    // Рассчитываем итоговую стоимость
    const totalPrice = matchedIngredients.reduce(
      (sum, item) => sum + item.price,
      0
    );

    // Определяем видимые ингредиенты и остаток
    const visibleIngredients = matchedIngredients.slice(0, INGREDIENTS_LIMIT);
    const remainingCount = Math.max(
      matchedIngredients.length - INGREDIENTS_LIMIT,
      0
    );

    // Формируем итоговый объект
    return {
      ...order,
      ingredientsInfo: matchedIngredients,
      ingredientsToShow: visibleIngredients,
      remains: remainingCount,
      total: totalPrice,
      date: new Date(order.createdAt)
    };
  }, [order, allIngredients]);

  if (!processedOrder) return null;

  return (
    <OrderCardUI
      orderInfo={processedOrder}
      maxIngredients={INGREDIENTS_LIMIT}
      locationState={{ background: location }}
    />
  );
});
