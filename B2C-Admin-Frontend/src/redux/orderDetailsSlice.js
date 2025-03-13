// src/redux/orderDetailsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  order: null,
  loading: false,
  error: null,
};

// Within your orderDetailsSlice.js
export const fetchOrderDetails = createAsyncThunk(
  'orderDetails/fetchOrderDetails',
  async (id, { rejectWithValue, getState }) => {
      const state = getState();
      // Check if the order details are already in the store
      if (state.orderDetails.orderDetails && state.orderDetails.orderDetails.id === id) {
          return state.orderDetails.orderDetails; // Return cached data
      }

      try {
          const response = await fetch(
              `https://b2c-backend-eik4.onrender.com/api/v1/order/orderdetails/${id}`
          );
          if (!response.ok) {
              throw new Error('Failed to fetch order details');
          }
          const data = await response.json();
          return data;
      } catch (error) {
          return rejectWithValue(error.message);
      }
  }
);
const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderDetailsSlice.reducer;