import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { fetchFeeds } from '../../features/feed/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const feedState = useSelector((state: RootState) => state.feed);
  const orders: TOrder[] = feedState.orders;

  useEffect(() => {
    if (!feedState.orders.length) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, feedState.orders.length]);

  if (feedState.loading && !orders.length) return <Preloader />;

  return <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
