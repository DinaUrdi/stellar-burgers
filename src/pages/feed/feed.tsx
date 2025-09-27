import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../features/feed/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feedState = useSelector((state) => state.feed);
  const orders: TOrder[] = feedState.orders;

  useEffect(() => {
    if (!feedState.orders.length) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, feedState.orders.length]);

  if (feedState.loading && !orders.length) return <Preloader />;

  return <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
