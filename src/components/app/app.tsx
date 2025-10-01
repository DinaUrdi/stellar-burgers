import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../features/ingredients/ingredientsSlice';
import { checkUserAuth, setUser } from '../../features/user/userSlice';
import { getUserApi } from '@api';
import { Preloader } from '@ui';

const App = () => {
  const user = useSelector((state) => state.user.user);
  const isAuth = Boolean(user);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const closeModal = () => {
    sessionStorage.removeItem('modalPath');
    navigate(state?.backgroundLocation || '/', { replace: true });
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);

  useEffect(() => {
    if (isAuthChecked && isAuth) {
      if (
        ['/login', '/register', '/forgot-password', '/reset-password'].includes(
          location.pathname
        )
      ) {
        navigate('/', { replace: true });
      }
    } else if (isAuthChecked && !isAuth) {
      if (location.pathname.startsWith('/profile')) {
        navigate('/login', { replace: true, state: { from: location } });
      }
    }
  }, [isAuthChecked, isAuth, location.pathname, navigate]);

  if (!isAuthChecked) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={state?.backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute isAuth={!isAuth}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute isAuth={!isAuth}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute isAuth={!isAuth}>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute isAuth={!isAuth}>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute isAuth={isAuth}>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute isAuth={isAuth}>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute isAuth={isAuth}>
                <Modal title='Детали заказа' onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
