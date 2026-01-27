import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../utils/burger-api';

export type TStateIngredients = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: TStateIngredients = {
  ingredients: [],
  loading: false,
  error: null
};

export const getIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/getIngredients',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIngredients.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getIngredients.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? 'Ошибка загрузки ингредиентов';
    });

    builder.addCase(getIngredients.fulfilled, (state, action) => {
      state.loading = false;
      state.ingredients = action.payload;
    });
  },
  selectors: {
    getIngredientsSelector: (state) => state.ingredients,
    getLoadingStatus: (state) => state.loading,
    getErrorStatus: (state) => state.error
  }
});

export default ingredientsSlice.reducer;

export const { getIngredientsSelector, getLoadingStatus, getErrorStatus } =
  ingredientsSlice.selectors;
