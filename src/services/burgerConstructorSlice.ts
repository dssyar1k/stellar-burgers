import {
  createSlice,
  createAsyncThunk,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '../utils/burger-api';

export type TStateBurgerConstructor = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: TStateBurgerConstructor = {
  constructorItems: { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

export const createOrder = createAsyncThunk<
  { order: TOrder; name: string },
  string[],
  { rejectValue: string }
>('order/createOrder', async (data: string[], { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(data);
    return response;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Ошибка при создании заказа'
    );
  }
});

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
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
    deleteIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload.id
        );
    },
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
    clearOrder: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
      state.orderRequest = false;
      state.orderModalData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.loading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.loading = false;
        state.orderModalData = action.payload.order;
        state.constructorItems.bun = null;
        state.constructorItems.ingredients = [];
        state.error = null;
      });
  },
  selectors: {
    getConstructorItems: (state) => state.constructorItems,
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData,
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  }
});

export default burgerConstructorSlice.reducer;

export const {
  getConstructorItems,
  getOrderRequest,
  getOrderModalData,
  getLoading,
  getError
} = burgerConstructorSlice.selectors;

export const {
  addIngredient,
  deleteIngredient,
  moveUpIngredient,
  moveDownIngredient,
  clearOrder
} = burgerConstructorSlice.actions;
