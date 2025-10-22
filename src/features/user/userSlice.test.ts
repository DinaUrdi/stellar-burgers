import { configureStore } from '@reduxjs/toolkit';
import userReducer, {
  registerUser,
  loginUser,
  logoutUser,
  checkUserAuth
} from './userSlice';
import { registerUserApi, loginUserApi, logoutApi, getUserApi } from '@api';

jest.mock('@api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn()
}));

jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn()
}));

Object.defineProperty(global, 'localStorage', {
  value: {
    setItem: jest.fn(),
    removeItem: jest.fn(),
    getItem: jest.fn()
  }
});

describe('тесты асинхронных экшенов userSlice', () => {
  describe('тесты для registerUser', () => {
    test('успешная регистрация', async () => {
      const expectedResult = {
        user: { name: 'Dina', email: 'dina@test.com' },
        accessToken: 'access123',
        refreshToken: 'refresh123'
      };

      (registerUserApi as jest.Mock).mockResolvedValue(expectedResult);

      const store = configureStore({
        reducer: { user: userReducer }
      });
      const result = await store.dispatch(
        registerUser({ name: 'Dina', email: 'dina@test.com', password: '123' })
      );
      const state = store.getState().user;

      expect(result.type).toBe('user/register/fulfilled');
      expect(state.user).toEqual(expectedResult.user);
      expect(state.loading).toBe(false);
    });
    test('включение лоадера', async () => {
      const initialState = {
        user: null,
        loading: false,
        error: undefined,
        isAuthChecked: false
      };
      const nextState = userReducer(
        initialState,
        registerUser.pending('requestId', {
          name: 'Dina',
          email: 'dina@test.com',
          password: '123'
        })
      );
      expect(nextState.loading).toEqual(true);
    });
    test('ошибка загрузки', async () => {
      const initialState = {
        user: null,
        loading: true,
        error: undefined,
        isAuthChecked: false
      };
      const action = {
        type: registerUser.rejected.type,
        payload: 'Ошибка регистрации',
        error: { message: 'Rejected' }
      };
      const nextState = userReducer(initialState, action);
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Ошибка регистрации');
    });
  });
  describe('тесты для loginUser', () => {
    test('успешный вход', async () => {
      const expectedResult = {
        user: { name: 'Dina', email: 'dina@test.com' },
        accessToken: 'access123',
        refreshToken: 'refresh123'
      };

      (loginUserApi as jest.Mock).mockResolvedValue(expectedResult);

      const store = configureStore({
        reducer: { user: userReducer }
      });
      await store.dispatch(
        loginUser({ email: 'dina@test.com', password: '123' })
      );
      const state = store.getState().user;

      expect(state.user).toEqual(expectedResult.user);
      expect(state.loading).toBe(false);
    });
    test('включение лоадера', async () => {
      const initialState = {
        user: null,
        loading: false,
        error: undefined,
        isAuthChecked: false
      };
      const nextState = userReducer(
        initialState,
        loginUser.pending('requestId', {
          email: 'dina@test.com',
          password: '123'
        })
      );
      expect(nextState.loading).toEqual(true);
    });
    test('ошибка входа', async () => {
      const initialState = {
        user: null,
        loading: true,
        error: undefined,
        isAuthChecked: false
      };
      const action = {
        type: loginUser.rejected.type,
        payload: 'Ошибка входа',
        error: { message: 'Rejected' }
      };
      const nextState = userReducer(initialState, action);
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Ошибка входа');
    });
  });
  describe('тесты для logoutUser', () => {
    test('успешный выход', async () => {
      (logoutApi as jest.Mock).mockResolvedValue(null);

      const store = configureStore({
        reducer: { user: userReducer }
      });
      await store.dispatch(logoutUser());
      const state = store.getState().user;

      expect(state.user).toEqual(null);
    });
  });
  describe('тесты для checkUserAuth', () => {
    test('юзер авторизован', async () => {
      const expectedResult = {
        user: { name: 'Dina', email: 'dina@test.com' },
        accessToken: 'access123',
        refreshToken: 'refresh123'
      };

      (getUserApi as jest.Mock).mockResolvedValue(expectedResult);

      const store = configureStore({
        reducer: { user: userReducer }
      });
      await store.dispatch(checkUserAuth());
      const state = store.getState().user;

      expect(state.user).toEqual(expectedResult.user);
      expect(state.loading).toBe(false);
    });
    test('включение лоадера', async () => {
      const initialState = {
        user: null,
        loading: false,
        error: undefined,
        isAuthChecked: false
      };
      const nextState = userReducer(
        initialState,
        checkUserAuth.pending('requestId')
      );
      expect(nextState.loading).toEqual(true);
    });
    test('ошибка проверки авторизации', async () => {
      const initialState = {
        user: null,
        loading: true,
        error: undefined,
        isAuthChecked: false
      };
      const action = {
        type: checkUserAuth.rejected.type,
        payload: 'Ошибка проверки авторизации',
        error: { message: 'Rejected' }
      };
      const nextState = userReducer(initialState, action);
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Ошибка проверки авторизации');
    });
  });
});
