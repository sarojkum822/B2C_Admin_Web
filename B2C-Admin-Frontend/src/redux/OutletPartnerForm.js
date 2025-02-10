import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
    partnerData: {},
    loading: false,
    error: null,
    success: false,
};

// Async thunk to handle the API call
export const addPartner = createAsyncThunk(
    'partner/addPartner',
    async (partnerData, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('firstName', partnerData.firstName);
            formData.append('lastName', partnerData.lastName);
            formData.append('aadharNo', partnerData.aadharNumber); // Corrected to match field name in API
            formData.append('password', partnerData.uniquePassword); // Corrected to match field name in API
            formData.append('phone', partnerData.phoneNumber); // Corrected to match field name in API

            if (partnerData.profileImage) {
                formData.append('img', partnerData.profileImage);
            }

            const response = await axios.post(
                'https://b2c-49u4.onrender.com/api/v1/admin/addOutletPartner',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to add partner.'
            );


        }
    }
);

// Create the partner slice
const partnerSlice = createSlice({
    name: 'partner',
    initialState,
    reducers: {
        resetState: (state) => {
            state.partnerData = {};
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addPartner.pending, (state) => {
                state.loading = true;
            })
            .addCase(addPartner.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.partnerData = action.payload;
            })
            .addCase(addPartner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { resetState } = partnerSlice.actions;

export default partnerSlice.reducer;
