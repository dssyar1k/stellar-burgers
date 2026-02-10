import reducer, {
  TStateIngredients,
  getIngredients,
  initialState
} from '../src/services/ingredientsSlice';
import { TIngredient } from '../src/utils/types';
const createIngredient = (
  overrides: Partial<TIngredient> = {}
): TIngredient => ({
  _id: 'ingredient-id',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  ...overrides
});

const cloneState = (state: TStateIngredients): TStateIngredients => ({
  ...state,
  ingredients: [...state.ingredients]
});

describe('ingredients slice', () => {
  it('Проверка сохранения ингредиентов и сброса флага загрузки при getIngredients.fulfilled', () => {
    // Подготавливаем тестовые данные
    const ingredients: TIngredient[] = [
      createIngredient({ _id: '1', name: 'Булка', type: 'bun' }),
      createIngredient({ _id: '2', name: 'Ингредиент', type: 'main' })
    ];

    // Применяем экшен к состоянию
    const state = reducer(
      {
        ...cloneState(initialState),
        loading: true
      },
      getIngredients.fulfilled(ingredients, 'requestId', undefined)
    );

    // Проверяем итоговое состояние
    expect(state).toEqual({
      ingredients,
      loading: false,
      error: null
    });
  });

  it('Проверка установления флага загрузки в true при getIngredients.pending', () => {
    // Применяем pending-экшен
    const state = reducer(
      cloneState(initialState),
      getIngredients.pending('requestId', undefined)
    );

    // Проверяем состояние загрузки
    expect(state).toEqual({
      ingredients: [],
      loading: true,
      error: null
    });
  });

  it('Проверка сохранения ошибки и сбрасывания флага загрузки при getIngredients.rejected', () => {
    // Создаём тестовую ошибку
    const error = new Error('Ошибка загрузки');

    // Применяем rejected-экшен
    const state = reducer(
      {
        ...cloneState(initialState),
        loading: true
      },
      getIngredients.rejected(error, 'requestId', undefined, undefined, error)
    );

    // Проверяем обработку ошибки
    expect(state).toEqual({
      ingredients: [],
      loading: false,
      error: 'Ошибка загрузки'
    });
  });
});
