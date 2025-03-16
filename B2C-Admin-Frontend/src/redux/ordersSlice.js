// src/redux/ordersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  orders: [],
  loading: false,
  error: null,
  successMessage: '',
  lastFetched: 0, // Track last fetch time
};

// Fetch Orders with Caching
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const now = Date.now();
    
    // Prevent unnecessary re-fetching (cache for 5 min)
    if (state.orders.orders.length > 0 && now - state.orders.lastFetched < 300000) {
      return state.orders.orders;
    }

    try {
      const response = await axios.get(
        'https://b2c-49u4.onrender.com/api/v1/order/order',
        { headers: { 'Cache-Control': 'max-age=300' } } // Cache for 5 minutes
      );
      return response.data.orders || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

// Delete Order
export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`https://b2c-backend-eik4.onrender.com/api/v1/admin/order/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete order');
    }
  }
);

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
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.lastFetched = Date.now(); // Update cache timestamp
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Order
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
        state.error = action.payload;
      });
  },
});

export const { setSuccessMessage, clearSuccessMessage } = ordersSlice.actions;
export default ordersSlice.reducer;
