import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import { getIngredientsApi } from '@api';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('тесты асинхронных экшенов ingredientSlice', () => {
  test('загрузка ингредиентов', async () => {
    const expectedResult = [
      {
        _id: '123',
        name: 'сметанный соус',
        type: 'souce',
        proteins: 24,
        fat: 32,
        carbohydrates: 45,
        calories: 123,
        price: 54,
        image: 'image.png',
        image_large: 'image_large.png',
        image_mobile: 'image_mobile.png',
        id: '1'
      },
      {
        _id: '124',
        name: 'томатный соус',
        type: 'souce',
        proteins: 8,
        fat: 50,
        carbohydrates: 34,
        calories: 321,
        price: 134,
        image: 'image2.png',
        image_large: 'image_large2.png',
        image_mobile: 'image_mobile2.png',
        id: '2'
      }
    ];

    (getIngredientsApi as jest.Mock).mockResolvedValue(expectedResult);

    const store = configureStore({
      reducer: { ingredients: ingredientsReducer }
    });
    await store.dispatch(fetchIngredients());
    const { ingredients } = store.getState().ingredients;
    expect(ingredients).toEqual(expectedResult);
    expect(store.getState().ingredients.isLoading).toBe(false);
  });
  test('включение лоадера', async () => {
    const initialState = {
      ingredients: [],
      isLoading: false,
      error: null
    };
    const nextState = ingredientsReducer(
      initialState,
      fetchIngredients.pending('id', undefined)
    );
    expect(nextState.isLoading).toEqual(true);
  });
  test('ошибка загрузки', async () => {
    const initialState = {
      ingredients: [],
      isLoading: true,
      error: null
    };
    const nextState = ingredientsReducer(
      initialState,
      fetchIngredients.rejected(new Error(), '123', undefined)
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Не удалось загрузить ингредиенты');
  });
});
