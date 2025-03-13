// src/redux/customerInsightsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  data: {
    totalCustomers: 0,
    inactiveCustomers: 0,
    customerInquiries: 0,
    topCustomers: [],
    customerAgeGroups: [],
    newVsReturning: {
      new: 0,
      returning: 0,
    },
    genderDistribution: {
      male: 0,
      female: 0,
      others: 0,
    },
    areaDistribution: [],
  },
  loading: false,
  error: null,
};

export const fetchCustomerInsights = createAsyncThunk(
  'customerInsights/fetchCustomerInsights',
  async (_, { rejectWithValue, getState }) => {
      const state = getState();
      if (state.customerInsights.data && Object.keys(state.customerInsights.data).length > 0 && state.customerInsights.data.totalCustomers > 0) {
          // Data is already cached, return cached data
          return state.customerInsights.data;
      }

      try {
          const response = await axios.get('https://b2c-backend-eik4.onrender.com/api/v1/admin/customerInsights');
          const responseData = response?.data || {};

          const aggregation = responseData?.aggregation || {};
          const customers = responseData?.customers || [];
          const ageGroup = aggregation?.ageGroup || {};
          const areaArray = aggregation?.areaArray || [];

          return {
              totalCustomers: aggregation?.totalCustomers || 0,
              inactiveCustomers: aggregation?.inactiveCust || 0,
              customerInquiries: aggregation?.custEnquiry || 0,
              topCustomers: customers.map((customer, index) => ({
                  rank: index + 1,
                  name: customer?.name || "Unknown",
                  orders: customer?.totalOrders || 0,
                  spend: customer?.totalExpenditure || 0,
              })),
              customerAgeGroups: Object.entries(ageGroup).map(([age, percentage]) => ({
                  age,
                  percentage: percentage || 0,
              })),
              newVsReturning: {
                  new: aggregation?.newCust || 0,
                  returning: aggregation?.returningCust || 0,
              },
              genderDistribution: {
                  male: aggregation?.male || 0,
                  female: aggregation?.female || 0,
                  others: aggregation?.others || 0,
              },
              areaDistribution: areaArray.map(([area, percentage]) => ({
                  area: area || "Unknown",
                  percentage: percentage || 0,
              })),
          };
      } catch (err) {
          return rejectWithValue(err.message);
      }
  }
);

const customerInsightsSlice = createSlice({
  name: 'customerInsights',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCustomerInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerInsightsSlice.reducer;