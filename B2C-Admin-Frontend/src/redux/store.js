// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import outletDetailsReducer from './outletDetails';
import partnerReducer from './OutletPartnerForm';
import outletReducer from './OutletPartnerForm';
import ordersReducer from './ordersSlice';
import orderDetailsReducer from './orderDetailsSlice';
import customerInsightsReducer from './customerInsightsSlice';
import deliveryPartnerDetailsReducer from './deliveryPartnerDetailsSlice'; // Import the new reducer

const store = configureStore({
    reducer: {
        outletDetails: outletDetailsReducer,
        partner: partnerReducer,
        outlet: outletReducer,
        orders: ordersReducer,
        orderDetails: orderDetailsReducer,
        customerInsights: customerInsightsReducer,
        deliveryPartnerDetails: deliveryPartnerDetailsReducer, // Add the new reducer
    },
});

export default store;