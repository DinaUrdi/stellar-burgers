import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import feedReducer, { fetchFeeds } from './feedSlice';
import { getFeedsApi } from '@api';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

const initialState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: undefined
};

describe('тесты асинхронных экшенов feedSlice', () => {
  test('загрузка ленты', async () => {
    const expectedResult = {
      success: true,
      orders: [
        {
          _id: '123',
          status: 'выполнен',
          name: 'мясной бургер',
          createdAt: 'вчера',
          updatedAt: 'сегодня',
          number: 2,
          ingredients: []
        },
        {
          _id: '134',
          status: 'выполнен',
          name: 'вегетарианский бургер',
          createdAt: 'сегодня',
          updatedAt: 'сегодня',
          number: 3,
          ingredients: []
        }
      ],
      total: 2,
      totalToday: 1
    };

    (getFeedsApi as jest.Mock).mockResolvedValue(expectedResult);

    const store = configureStore({
      reducer: { feed: feedReducer }
    });
    await store.dispatch(fetchFeeds());
    const { orders, total, totalToday, loading, error } = store.getState().feed;
    expect(orders).toEqual(expectedResult.orders);
    expect(total).toBe(expectedResult.total);
    expect(totalToday).toBe(expectedResult.totalToday);
    expect(loading).toBe(false);
    expect(error).toBeUndefined();
  });
  test('включение лоадера', async () => {
    const nextState = feedReducer(
      initialState,
      fetchFeeds.pending('id', undefined)
    );
    const expectedState = {
      ...initialState,
      loading: true
    };

    expect(nextState).toEqual(expectedState);
  });
  test('ошибка загрузки', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      payload: 'Ошибка загрузки ленты',
      error: { message: 'Rejected' }
    };

    const nextState = feedReducer({ ...initialState, loading: true }, action);

    const expectedState = {
      ...initialState,
      loading: false,
      error: 'Ошибка загрузки ленты'
    };

    expect(nextState).toEqual(expectedState);
  });
});
