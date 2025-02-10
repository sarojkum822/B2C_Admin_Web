// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import outletDetailsReducer from './outletDetails';
import partnerReducer from './OutletPartnerForm';
import outletReducer from './OutletPartnerForm';



const store = configureStore({
  reducer: {
    outletDetails: outletDetailsReducer,
    partner: partnerReducer,
    outlet: outletReducer,
  },
});

export default store;
