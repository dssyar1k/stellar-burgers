import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from '../utils/cookie';
import { TUser } from '@utils-types';

export type UserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

// Начальное состояние для слайса пользователя
const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

// Асинхронное действие: регистрация нового пользователя
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

// Асинхронное действие: авторизация пользователя
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

// Асинхронное действие: выход из аккаунта
export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

// Асинхронное действие: получение данных текущего пользователя
export const getUser = createAsyncThunk('user/fetch', async () => {
  const res = await getUserApi();
  return res.user;
});

// Асинхронное действие: обновление данных пользователя
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

// Создание слайса для управления состоянием пользователя
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Обновляет флаг проверки авторизации
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Обработчики для регистрации
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      registerUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка регистрации';
    });

    // Обработчики для авторизации
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка авторизации';
    });

    // Обработчики для получения данных пользователя
    builder.addCase(getUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      getUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      }
    );
    builder.addCase(getUser.rejected, (state) => {
      state.isLoading = false;
      state.isAuthChecked = true; // Проверка завершена, даже если ошибка
    });

    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      updateUser.fulfilled,
      (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка обновления профиля';
    });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
    });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error
  }
});
export const { setAuthChecked } = userSlice.actions;
export default userSlice.reducer;
export const { selectUser, selectIsAuthChecked, getIsLoading, getError } =
  userSlice.selectors;
