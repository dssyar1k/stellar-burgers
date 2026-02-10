import {
  burgerConstructorSlice,
  addIngredient,
  deleteIngredient,
  moveUpIngredient,
  moveDownIngredient,
  clearOrder,
  clearConstructor
} from '../src/services/burgerConstructorSlice';
import { TIngredient } from '../src/utils/types';

const mockIngredient: TIngredient = {
  _id: 'test-id',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
};

describe('burgerConstructorSlice', () => {
  const initialState = burgerConstructorSlice.getInitialState();

  describe('addIngredient', () => {
    it('Добавление булки в state.constructorItems.bun', () => {
      const action = addIngredient(mockIngredient);
      const state = burgerConstructorSlice.reducer(initialState, action);

      expect(state.constructorItems.bun).toEqual({
        ...mockIngredient,
        key: expect.any(String),
        id: expect.any(String)
      });
    });

    it('Добавление начинки в state.constructorItems.ingredients', () => {
      const ingredientWithType: TIngredient = {
        ...mockIngredient,
        type: 'main'
      };
      const action = addIngredient(ingredientWithType);
      const state = burgerConstructorSlice.reducer(initialState, action);

      const added = state.constructorItems.ingredients[0];

      expect(added).toEqual({
        ...ingredientWithType,
        key: expect.any(String),
        id: expect.any(String)
      });
    });
  });

  describe('deleteIngredient', () => {
    it('Удаление ингредиента по id', () => {
      const idToDelete = 'abc123';
      const initial = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [
            { ...mockIngredient, key: 'xyz', id: 'def456' },
            { ...mockIngredient, key: 'abc', id: idToDelete }
          ]
        }
      };

      const action = deleteIngredient({
        ...mockIngredient,
        key: 'abc',
        id: idToDelete
      });
      const state = burgerConstructorSlice.reducer(initial, action);

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0].id).not.toBe(idToDelete);
    });
  });

  describe('moveUpIngredient', () => {
    it('Перемещение ингредиента вверх в массиве', () => {
      const ingredients = [
        { ...mockIngredient, key: '1', id: '1' },
        { ...mockIngredient, key: '2', id: '2' }
      ];
      const initial = {
        ...initialState,
        constructorItems: { bun: null, ingredients }
      };

      const action = moveUpIngredient(1);
      const state = burgerConstructorSlice.reducer(initial, action);

      expect(state.constructorItems.ingredients[0].id).toBe('2');
      expect(state.constructorItems.ingredients[1].id).toBe('1');
    });
  });

  describe('moveDownIngredient', () => {
    it('Перемещение ингредиента вниз в массиве', () => {
      const ingredients = [
        { ...mockIngredient, key: '1', id: '1' },
        { ...mockIngredient, key: '2', id: '2' }
      ];
      const initial = {
        ...initialState,
        constructorItems: { bun: null, ingredients }
      };

      const action = moveDownIngredient(0);
      const state = burgerConstructorSlice.reducer(initial, action);

      expect(state.constructorItems.ingredients[0].id).toBe('2');
      expect(state.constructorItems.ingredients[1].id).toBe('1');
    });
  });

  describe('clearOrder', () => {
    it('Очистка orderData и error', () => {
      const initial = {
        ...initialState,
        orderData: { _id: 'order-1', number: 123 },
        error: 'Ошибка'
      };
      const state = burgerConstructorSlice.reducer(initial, clearOrder());

      expect(state.orderData).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('clearConstructor', () => {
    it('Очищает все ингредиентов и булку', () => {
      const initial = {
        ...initialState,
        constructorItems: {
          bun: mockIngredient,
          ingredients: [{ ...mockIngredient, key: 'x', id: 'x' }]
        }
      };
      const state = burgerConstructorSlice.reducer(initial, clearConstructor());

      expect(state.constructorItems.bun).toBeNull();
      expect(state.constructorItems.ingredients).toHaveLength(0);
    });
  });
});
