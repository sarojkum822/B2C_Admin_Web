// src/redux/deliveryPartnerDetailsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    partnerData: null,
    loading: false,
    error: null,
    cachedPartnerData: {}, // Add a cache object
};

export const fetchDeliveryPartnerDetails = createAsyncThunk(
    'deliveryPartnerDetails/fetchDeliveryPartnerDetails',
    async (partnerId, { rejectWithValue, getState }) => {
        const state = getState().deliveryPartnerDetails;
        if (state.cachedPartnerData[partnerId]) {
            // Data is cached, return it
            return state.cachedPartnerData[partnerId];
        }

        try {
            const response = await axios.get(`https://b2c-backend-eik4.onrender.com/api/v1/admin/deliverypartner/${partnerId}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const deliveryPartnerDetailsSlice = createSlice({
    name: 'deliveryPartnerDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeliveryPartnerDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeliveryPartnerDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.partnerData = action.payload;
                state.cachedPartnerData[action.meta.arg] = action.payload; // Cache the data
            })
            .addCase(fetchDeliveryPartnerDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default deliveryPartnerDetailsSlice.reducer;