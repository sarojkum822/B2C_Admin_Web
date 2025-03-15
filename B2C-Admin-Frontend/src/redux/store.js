// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import outletDetailsReducer from './outletDetails';
import partnerReducer from './OutletPartnerForm';
import outletReducer from './OutletPartnerForm';
import ordersReducer from './ordersSlice';
import orderDetailsReducer from './orderDetailsSlice';
import customerInsightsReducer from './customerInsightsSlice';
import deliveryPartnerDetailsReducer from './deliveryPartnerDetailsSlice';
import { apiSlice } from './apiSlice'; // Import the new API slice

const store = configureStore({
    reducer: {
        outletDetails: outletDetailsReducer,
        partner: partnerReducer,
        outlet: outletReducer,
        orders: ordersReducer,
        orderDetails: orderDetailsReducer,
        customerInsights: customerInsightsReducer,
        deliveryPartnerDetails: deliveryPartnerDetailsReducer,
        [apiSlice.reducerPath]: apiSlice.reducer, // Add the API slice reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware), // Add the API middleware
});

export default store;