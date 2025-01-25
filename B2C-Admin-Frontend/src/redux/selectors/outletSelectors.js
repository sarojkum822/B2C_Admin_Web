// src/redux/selectors/outletSelectors.js
import { createSelector } from 'reselect';

export const selectOutletData = (state) => state.outletReducer;

export const selectOutlets = createSelector(
  [selectOutletData],
  (outletData) => ({
    loading: outletData.loading,
    outlets: outletData.outlets,
    revenue: outletData.revenue,
    totalOrders: outletData.totalOrders,
    totalOutlets: outletData.totalOutlets,
    totalPartners: outletData.totalPartners,
    error: outletData.error,
  })
);
