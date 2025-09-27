import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchUserOrders } from '../../features/orders/ordersSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector((state) => state.orders.userOrders);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);
  return <ProfileOrdersUI orders={orders} />;
};
