import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { fetchOrderByNumber } from '../../features/orders/ordersSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useDispatch();
  const isProfileOrder = location.pathname.includes('/profile/orders');
  const orders = useSelector((state) =>
    isProfileOrder ? state.orders.userOrders : state.feed.orders
  );
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const currentOrder = useSelector((state) => state.orders.currentOrder);
  const loading = useSelector((state) => state.orders.loading);

  useEffect(() => {
    if (!number) return;
    const foundOrder = orders.find((o: TOrder) => o.number === Number(number));
    if (!foundOrder) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orders]);

  const orderData =
    orders.find((o: TOrder) => o.number === Number(number)) || currentOrder;
  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || loading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
