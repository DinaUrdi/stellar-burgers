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
      const initialState = {
        userOrders: [],
        currentOrder: null,
        loading: false,
        error: undefined
      };
      const nextState = ordersReducer(
        initialState,
        fetchUserOrders.pending('id', undefined)
      );
      expect(nextState.loading).toEqual(true);
    });
    test('ошибка загрузки', () => {
      const initialState = {
        userOrders: [],
        currentOrder: null,
        loading: true,
        error: undefined
      };

      const action = {
        type: fetchUserOrders.rejected.type,
        payload: 'Ошибка загрузки заказов',
        error: { message: 'Rejected' }
      };

      const nextState = ordersReducer(initialState, action);
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Ошибка загрузки заказов');
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
      const initialState = {
        userOrders: [],
        currentOrder: null,
        loading: false,
        error: undefined
      };
      const nextState = ordersReducer(
        initialState,
        fetchOrderByNumber.pending('id', 1)
      );
      expect(nextState.loading).toEqual(true);
    });
    test('ошибка загрузки', () => {
      const initialState = {
        userOrders: [],
        currentOrder: null,
        loading: true,
        error: undefined
      };

      const action = {
        type: fetchOrderByNumber.rejected.type,
        payload: 'Ошибка загрузки заказа',
        error: { message: 'Rejected' }
      };

      const nextState = ordersReducer(initialState, action);
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Ошибка загрузки заказа');
    });
  });
});
