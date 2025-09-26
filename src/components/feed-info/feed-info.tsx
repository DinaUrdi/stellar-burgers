import { FC, useEffect, useMemo } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState, useSelector } from '../../services/store';
import { fetchFeeds } from '../../features/feed/feedSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const feedState = useSelector((state: RootState) => state.feed);
  const orders: TOrder[] = feedState.orders;
  const feed = useMemo(
    () => ({
      total: feedState.total,
      totalToday: feedState.totalToday
    }),
    [feedState.total, feedState.totalToday]
  );

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, orders.length]);
  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
