import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { getConstructorItems } from '../../services/burgerConstructorSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const burgerConstructor = useSelector(getConstructorItems);

  const ingredientsCounters = useMemo(() => {
    // Инициализируем счётчик ингредиентов
    const counters: { [key: string]: number } = {};

    // Обрабатываем ингредиенты из конструктора
    burgerConstructor.ingredients.forEach((ingredient: TIngredient) => {
      counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
    });

    // Учитываем булочку (всегда 2 единицы)
    if (burgerConstructor.bun) {
      counters[burgerConstructor.bun._id] = 2;
    }

    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      ref={ref}
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
    />
  );
});
