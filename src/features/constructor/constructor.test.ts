import { expect, test, describe } from '@jest/globals';
import constructorReducer, {
  addIngredient,
  moveIngredient,
  removeIngredient
} from './constructorSlice';

import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid')
}));

describe('тесты редьюсера слайса constructor', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  const initialIngredientsState = {
    bun: null,
    ingredients: [
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
    ],
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  test('добавить ингредиент', () => {
    const ingredient = {
      _id: '123',
      name: 'Соус',
      type: 'sauce',
      proteins: 5,
      fat: 45,
      carbohydrates: 19,
      calories: 150,
      price: 280,
      image: 'image.png',
      image_large: 'image_large.png',
      image_mobile: 'image_mobile.png'
    };

    const action = addIngredient(ingredient);
    const nextState = constructorReducer(initialState, action);

    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toEqual({
      ...ingredient,
      id: 'test-uuid'
    });
  });

  test('удалить ингредиент', () => {
    const action = removeIngredient('2');
    const nextState = constructorReducer(initialIngredientsState, action);

    expect(nextState.ingredients).toEqual([
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
      }
    ]);
  });

  test('поменять порядок ингредиента', () => {
    const action = moveIngredient({ from: 0, to: 1 });
    const nextState = constructorReducer(initialIngredientsState, action);

    expect(nextState.ingredients).toEqual([
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
      },
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
      }
    ]);
  });
});
