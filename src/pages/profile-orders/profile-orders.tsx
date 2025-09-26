import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { AppDispatch, RootState, useSelector } from '../../services/store';
import { useDispatch } from 'react-redux';
import { fetchUserOrders } from '../../features/orders/ordersSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector((state: RootState) => state.orders.userOrders);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);
  return <ProfileOrdersUI orders={orders} />;
};
