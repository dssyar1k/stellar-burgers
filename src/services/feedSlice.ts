import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';

// Интерфейс состояния ленты заказов
export type TStateFeed = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: null | string | undefined;
};

// Инициализация начального состояния
const initialState: TStateFeed = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

// Асинхронный экшен для получения данных ленты
export const getFeeds = createAsyncThunk(
  'feeds/getFeeds',
  async () => await getFeedsApi()
);

// Асинхронный экшен для запроса конкретного заказа
export const getProfileOrders = createAsyncThunk(
  'feeds/getProfileOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

// Создание slice для управления состоянием ленты
export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Обработчики для getFeeds
    builder
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message ?? 'Не удалось загрузить ленту заказов';
      })
      .addCase(getFeeds.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.orders = payload.orders;
        state.total = payload.total;
        state.totalToday = payload.totalToday;
      });

    // Обработчики для getOrderByNumber
    builder
      .addCase(getProfileOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getProfileOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(getProfileOrders.rejected, (state, action) => {
        state.error = action.error.message || 'Не удалось загрузить заказы';
      });
  },
  selectors: {
    getFeedOrders: (state) => state.orders,
    getTotalOrders: (state) => state.total,
    getTotalToday: (state) => state.totalToday,
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  }
});

// Экспорт редуктора
export default feedSlice.reducer;

// Групповой экспорт селекторов
export const {
  getFeedOrders,
  getTotalOrders,
  getTotalToday,
  getLoading,
  getError
} = feedSlice.selectors;

// Объединённый экспорт экшенов
export const feedActions = {
  getFeeds,
  getProfileOrders
};
