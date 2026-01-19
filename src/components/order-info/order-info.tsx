import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from 'react-redux';
import { getIngredientsSelector } from '../../services/ingredientsSlice';

export const OrderInfo: FC = () => {
  // Получаем ингредиенты из стора
  const ingredients = useSelector(getIngredientsSelector);

  // Временные данные заказа (заменить на селектор из стора)
  const orderData = {
    createdAt: '',
    ingredients: [] as string[],
    _id: '',
    status: '',
    name: '',
    updatedAt: 'string',
    number: 0
  };

  // Обработка данных заказа для отображения
  const preparedOrder = useMemo(() => {
    // Проверка наличия необходимых данных
    if (!orderData || ingredients.length === 0) return null;

    // Форматируем дату
    const formattedDate = new Date(orderData.createdAt);

    // Тип для агрегированных ингредиентов
    type AggregatedIngredient = TIngredient & { count: number };
    type IngredientsMap = { [id: string]: AggregatedIngredient };

    // Группируем ингредиенты и считаем количество
    const groupedIngredients = orderData.ingredients.reduce(
      (acc, ingredientId) => {
        const ingredient = ingredients.find((ing) => ing._id === ingredientId);

        if (ingredient) {
          if (!acc[ingredientId]) {
            acc[ingredientId] = { ...ingredient, count: 1 };
          } else {
            acc[ingredientId].count += 1;
          }
        }

        return acc;
      },
      {} as IngredientsMap
    );

    // Рассчитываем общую стоимость
    const totalAmount = Object.values(groupedIngredients).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    // Возвращаем обработанные данные
    return {
      ...orderData,
      ingredientsInfo: groupedIngredients,
      date: formattedDate,
      total: totalAmount
    };
  }, [orderData, ingredients]);

  // Пока данные не готовы — показываем прелоадер
  if (!preparedOrder) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={preparedOrder} />;
};
