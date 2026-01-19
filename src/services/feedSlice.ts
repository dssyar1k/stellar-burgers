import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi, getOrderByNumberApi } from '@api';

// Интерфейс состояния ленты заказов
export type TStateFeed = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  orderModal: TOrder | null;
  loading: boolean;
  error: null | string | undefined;
};

// Инициализация начального состояния
const initialState: TStateFeed = {
  orders: [],
  total: 0,
  totalToday: 0,
  orderModal: null,
  loading: false,
  error: null
};

// Асинхронный экшен для получения данных ленты
export const getFeeds = createAsyncThunk(
  'feeds/getFeeds',
  async () => await getFeedsApi()
);

// Асинхронный экшен для запроса конкретного заказа
export const getOrderByNumber = createAsyncThunk<
  { orders: TOrder[] },
  number,
  { rejectValue: string }
>('orders/getOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    return await getOrderByNumberApi(number);
  } catch {
    return rejectWithValue('Ошибка получения данных заказа');
  }
});

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
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.orderModal = payload.orders.length > 0 ? payload.orders[0] : null;
      })
      .addCase(getOrderByNumber.rejected, (state, { error, payload }) => {
        state.loading = false;
        state.error = payload ?? error.message ?? 'Ошибка загрузки заказа';
      });
  },
  selectors: {
    getFeedOrders: (state) => state.orders,
    getTotalOrders: (state) => state.total,
    getTotalToday: (state) => state.totalToday,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    selectOrderModal: (state) => state.orderModal
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
  getOrderByNumber
};
