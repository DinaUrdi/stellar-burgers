import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import userReducer from '../features/user/userSlice';

import constructorReducer from '../features/constructor/constructorSlice';
import ingredientsReducer from '../features/ingredients/ingredientsSlice';
import feedReducer from '../features/feed/feedSlice';
import ordersSlice from '../features/orders/ordersSlice';

const rootReducer = combineReducers({
  user: userReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  orders: ordersSlice
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
