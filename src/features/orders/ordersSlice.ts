import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

interface OrdersState {
  userOrders: TOrder[];
  currentOrder: TOrder | null;
  loading: boolean;
  error?: string;
}

const initialState: OrdersState = {
  userOrders: [],
  currentOrder: null,
  loading: false,
  error: undefined
};

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки заказов');
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      return await getOrderByNumberApi(number);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки заказа');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: {
      reducer: (state, action: PayloadAction<TOrder>) => {
        // Создаем новый массив вместо мутации
        state.userOrders = [action.payload, ...state.userOrders];
      },
      prepare: (order: TOrder) => ({
        payload: order
      })
    },
    clearCurrentOrder(state) {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.userOrders = action.payload;
          state.loading = false;
          state.userOrders = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.currentOrder = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.loading = false;
          state.currentOrder = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { addOrder, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
