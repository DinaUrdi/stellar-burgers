import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import ordersReducer, {
  fetchOrderByNumber,
  fetchUserOrders
} from './ordersSlice';
import { getOrderByNumberApi, getOrdersApi } from '@api';

jest.mock('@api', () => ({
  getOrdersApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

describe('тесты асинхронных экшенов ordersSlice', () => {
  const initialState = {
    userOrders: [],
    currentOrder: null,
    loading: false,
    error: undefined
  };
  describe('тесты для fetchUserOrders', () => {
    test('загрузка заказов', async () => {
      const expectedResult = [
        { _id: '1', name: 'burger', status: 'done', ingredients: [] }
      ];

      (getOrdersApi as jest.Mock).mockResolvedValue(expectedResult);

      const store = configureStore({
        reducer: { orders: ordersReducer }
      });
      await store.dispatch(fetchUserOrders());
      const state = store.getState().orders;
      expect(state.userOrders).toEqual(expectedResult);
      expect(state.loading).toBe(false);
      expect(state.error).toBeUndefined();
    });
    test('включение лоадера', async () => {
      const expectedState = {
        ...initialState,
        loading: true
      };
      const nextState = ordersReducer(
        initialState,
        fetchUserOrders.pending('id', undefined)
      );
      expect(nextState).toEqual(expectedState);
    });
    test('ошибка загрузки', () => {
      const loadingState = {
        ...initialState,
        loading: true
      };

      const expectedState = {
        ...loadingState,
        loading: false,
        error: 'Ошибка загрузки заказов'
      };

      const action = {
        type: fetchUserOrders.rejected.type,
        payload: 'Ошибка загрузки заказов',
        error: { message: 'Rejected' }
      };

      const nextState = ordersReducer(loadingState, action);
      expect(nextState).toEqual(expectedState);
    });
  });
  describe('тесты для fetchOrderByNumber', () => {
    test('загрузка заказа', async () => {
      const expectedResult = {
        _id: '1',
        name: 'burger',
        status: 'done',
        ingredients: []
      };
      (getOrderByNumberApi as jest.Mock).mockResolvedValue(expectedResult);

      const store = configureStore({
        reducer: { orders: ordersReducer }
      });
      await store.dispatch(fetchOrderByNumber(1));
      const state = store.getState().orders;
      expect(state.currentOrder).toEqual(expectedResult);
      expect(state.loading).toBe(false);
      expect(state.error).toBeUndefined();
    });
    test('включение лоадера', async () => {
      const expectedState = {
        ...initialState,
        loading: true
      };
      const nextState = ordersReducer(
        initialState,
        fetchOrderByNumber.pending('id', 1)
      );
      expect(nextState).toEqual(expectedState);
    });
    test('ошибка загрузки', () => {
      const loadingState = {
        ...initialState,
        loading: true
      };

      const expectedState = {
        ...loadingState,
        loading: false,
        error: 'Ошибка загрузки заказа'
      };

      const action = {
        type: fetchOrderByNumber.rejected.type,
        payload: 'Ошибка загрузки заказа',
        error: { message: 'Rejected' }
      };

      const nextState = ordersReducer(loadingState, action);
      expect(nextState).toEqual(expectedState);
    });
  });
});
