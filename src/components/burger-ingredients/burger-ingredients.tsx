import { FC, useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from 'react-redux';
import { getIngredientsSelector } from '../../services/ingredientsSlice';

export const BurgerIngredients: FC = () => {
  const ingredients = useSelector(getIngredientsSelector);

  // Группировка ингредиентов по типам
  const groupedIngredients = {
    bun: ingredients.filter((item) => item.type === 'bun'),
    main: ingredients.filter((item) => item.type === 'main'),
    sauce: ingredients.filter((item) => item.type === 'sauce')
  };

  const [activeTab, setActiveTab] = useState<TTabMode>('bun');

  // Рефы для заголовков разделов
  const sectionRefs = {
    bun: useRef<HTMLHeadingElement>(null),
    main: useRef<HTMLHeadingElement>(null),
    sauce: useRef<HTMLHeadingElement>(null)
  };

  // Наблюдатели за видимостью разделов
  const visibilityRefs = {
    bun: useInView({ threshold: 0 }),
    main: useInView({ threshold: 0 }),
    sauce: useInView({ threshold: 0 })
  };

  // Эффект для автоматического переключения табов при скролле
  useEffect(() => {
    const { bun, main, sauce } = visibilityRefs;
    if (bun.inView) setActiveTab('bun');
    else if (sauce.inView) setActiveTab('sauce');
    else if (main.inView) setActiveTab('main');
  }, [
    visibilityRefs.bun.inView,
    visibilityRefs.main.inView,
    visibilityRefs.sauce.inView
  ]);

  // Обработка клика по табам
  const handleTabClick = (tab: string) => {
    if (['bun', 'main', 'sauce'].includes(tab)) {
      setActiveTab(tab as TTabMode);
      sectionRefs[tab as TTabMode].current?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return (
    <BurgerIngredientsUI
      currentTab={activeTab}
      buns={groupedIngredients.bun}
      mains={groupedIngredients.main}
      sauces={groupedIngredients.sauce}
      titleBunRef={sectionRefs.bun}
      titleMainRef={sectionRefs.main}
      titleSaucesRef={sectionRefs.sauce}
      bunsRef={visibilityRefs.bun.ref}
      mainsRef={visibilityRefs.main.ref}
      saucesRef={visibilityRefs.sauce.ref}
      onTabClick={handleTabClick}
    />
  );
};
