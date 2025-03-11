// src/redux/ordersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  orders: [],
  loading: false,
  error: null,
  successMessage: '',
};

// export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
//   try {
//     const response = await axios.get(
//       "https://b2c-49u4.onrender.com/api/v1/order/order"
//     );
//     return response.data.orders || [];
//   } catch (error) {
//     throw error;
//   }
// });
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { getState }) => {
  const state = getState();
  if (state.orders.orders.length > 0) {
      // Data is already in the store, return it
      return state.orders.orders;
  }

  try {
      const response = await axios.get(
          "https://b2c-49u4.onrender.com/api/v1/order/order"
      );
      return response.data.orders || [];
  } catch (error) {
      throw error;
  }
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`https://b2c-backend-1.onrender.com/api/v1/admin/order/delete/${id}`);
    console.log(response);
    return id; // Return the deleted order's ID
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter((order) => order.id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : action.error.message;
      });
  },
});

export const { setSuccessMessage, clearSuccessMessage } = ordersSlice.actions;
export default ordersSlice.reducer;