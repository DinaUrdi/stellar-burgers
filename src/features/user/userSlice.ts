import { getUserApi, loginUserApi, logoutApi, registerUserApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setCookie } from '../../utils/cookie';

interface TAuthResponse {
  user: {
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

interface User {
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error?: string;
  isAuthChecked: boolean;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: undefined,
  isAuthChecked: false
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (
    data: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await registerUserApi(data);
      if (res.accessToken) {
        setCookie('accessToken', res.accessToken);
      }
      if (res.refreshToken) {
        localStorage.setItem('refreshToken', res.refreshToken);
      }
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка регистрации');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      if (res.accessToken) {
        setCookie('accessToken', res.accessToken);
      }
      if (res.refreshToken) {
        localStorage.setItem('refreshToken', res.refreshToken);
      }
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка входа');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return true;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка выхода');
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch (err: any) {
      localStorage.removeItem('refreshToken');
      document.cookie =
        'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      return rejectWithValue(err.message || 'Ошибка проверки авторизации');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          state.user = action.payload.user;
          state.loading = false;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          state.user = action.payload.user;
          state.loading = false;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        checkUserAuth.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.loading = false;
          state.isAuthChecked = true;
        }
      )
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.isAuthChecked = true;
        state.error = action.payload as string;
      });
  }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
