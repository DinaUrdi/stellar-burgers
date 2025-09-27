import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { createSelector } from '@reduxjs/toolkit';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  createOrder,
  setOrderModalData
} from '../../features/constructor/constructorSlice';
import { addOrder, fetchUserOrders } from '../../features/orders/ordersSlice';

const selectConstructorState = (state: RootState) => state.burgerConstructor;

const selectConstructorItems = createSelector(
  [selectConstructorState],
  (constructorState) => ({
    bun: constructorState.bun,
    ingredients: constructorState.ingredients
  })
);

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const ingredients = useSelector(
    (state) => state.burgerConstructor.ingredients || []
  );
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(
    (state) => state.burgerConstructor.orderRequest
  );

  const orderModalData = useSelector(
    (state) => state.burgerConstructor.orderModalData
  );

  const { user } = useSelector((state) => state.user);
  const isAuth = Boolean(user);

  const onOrderClick = () => {
    if (!bun || ingredients.length === 0 || orderRequest) {
      return;
    }

    if (!isAuth) {
      navigate('/login');
      return;
    }

    const ids: string[] = [bun._id, ...ingredients.map((i) => i._id), bun._id];
    dispatch(createOrder(ids)).then((res) => {
      if (createOrder.fulfilled.match(res)) {
        dispatch(
          addOrder({
            _id: res.payload.order._id,
            name: res.payload.order.name,
            number: res.payload.order.number,
            status: res.payload.order.status,
            ingredients: res.payload.order.ingredients,
            createdAt: res.payload.order.createdAt,
            updatedAt: res.payload.order.updatedAt
          })
        );
        dispatch(fetchUserOrders());
      }
    });
  };
  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
