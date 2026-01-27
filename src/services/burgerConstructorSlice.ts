import {
  createSlice,
  createAsyncThunk,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi, orderBurgerApi } from '../utils/burger-api';

// Интерфейс состояния конструктора бургеров
export type TStateBurgerConstructor = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderData: TOrder | null;
  loading: boolean;
  error: string | null;
};

// Начальное состояние редуктора
const initialState: TStateBurgerConstructor = {
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderData: null,
  loading: false,
  error: null
};

// Создание слайса для управления состоянием конструктора бургеров
export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление ингредиента в конструктор
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const key = nanoid();
        return { payload: { ...ingredient, key, id: key } };
      }
    },
    // Удаление ингредиента из конструктора
    deleteIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload.id
        );
    },
    // Перемещение ингредиента вверх в списке
    moveUpIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const ingredients = state.constructorItems.ingredients;
        [ingredients[index - 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index - 1]
        ];
      }
    },
    // Перемещение ингредиента вниз в списке
    moveDownIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const ingredients = state.constructorItems.ingredients;
      if (index < ingredients.length - 1) {
        [ingredients[index + 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index + 1]
        ];
      }
    },
    // Очистка данных заказа
    clearOrder: (state) => {
      state.orderData = null;
      state.error = null;
    },
    // Очистка конструктора (удаление всех ингредиентов и булки)
    clearConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработчик состояния при отправке заказа
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.loading = true;
        state.error = null;
      })
      // Обработчик ошибки при отправке заказа
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.loading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      })
      // Обработчик успешного создания заказа
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.loading = false;
        state.orderData = action.payload.order;
        state.constructorItems.bun = null;
        state.constructorItems.ingredients = [];
        state.error = null;
      })
      // Обработчик начала запроса заказа по номеру
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
      })
      // Обработчик успешного получения заказа по номеру
      .addCase(
        getOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderData = action.payload;
        }
      )
      // Обработчик ошибки получения заказа по номеру
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message || 'Не удалось получить заказ';
      });
  },
  selectors: {
    getConstructorItems: (state) => state.constructorItems,
    getOrderRequest: (state) => state.orderRequest,
    getOrderData: (state) => state.orderData,
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  }
});

// Асинхронное действие: создание заказа
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

// Асинхронное действие: получение заказа по номеру
export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

// Экспорт редуктора слайса
export default burgerConstructorSlice.reducer;

// Экспорт селекторов состояния
export const {
  getConstructorItems,
  getOrderRequest,
  getOrderData,
  getLoading,
  getError
} = burgerConstructorSlice.selectors;

// Экспорт действий слайса
export const {
  addIngredient,
  deleteIngredient,
  moveUpIngredient,
  moveDownIngredient,
  clearOrder,
  clearConstructor
} = burgerConstructorSlice.actions;
