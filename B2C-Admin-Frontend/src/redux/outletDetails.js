// src/redux/outletDetails.js

import axios from 'axios';

export const FETCH_OUTLET_DETAILS_REQUEST = 'FETCH_OUTLET_DETAILS_REQUEST';
export const FETCH_OUTLET_DETAILS_SUCCESS = 'FETCH_OUTLET_DETAILS_SUCCESS';
export const FETCH_OUTLET_DETAILS_FAILURE = 'FETCH_OUTLET_DETAILS_FAILURE';

// Action to initiate API request
export const fetchOutletDetails = () => async (dispatch, getState) => {
    const state = getState();
    if (state.outletDetails.summaryData && state.outletDetails.outletData.length > 0) {
        // Data is already cached, dispatch success with cached data
        dispatch({
            type: FETCH_OUTLET_DETAILS_SUCCESS,
            payload: {
                revenue: state.outletDetails.summaryData.revenue,
                totalOrders: state.outletDetails.summaryData.totalOrders,
                totalOutlets: state.outletDetails.summaryData.totalOutlets,
                totalPartners: state.outletDetails.summaryData.totalPartners,
                outlets: state.outletDetails.outletData,
            },
        });
        return; // Exit the function
    }

    dispatch({ type: FETCH_OUTLET_DETAILS_REQUEST });

    try {
        const response = await axios.get('https://b2c-49u4.onrender.com/api/v1/admin/allOutlet');
        dispatch({
            type: FETCH_OUTLET_DETAILS_SUCCESS,
            payload: {
                revenue: parseFloat(response.data.revenue).toFixed(2),
                totalOrders: response.data.totalOrders,
                totalOutlets: response.data.totalOutlets,
                totalPartners: response.data.totalPartners,
                outlets: response.data.outlets,
            },
        });
    } catch (error) {
        dispatch({
            type: FETCH_OUTLET_DETAILS_FAILURE,
            payload: error.message,
        });
    }
};

// Reducer to handle state changes based on actions
const initialState = {
    loading: false,
    summaryData: {
        revenue: '0.00',
        totalOrders: 0,
        totalOutlets: 0,
        totalPartners: 0,
    },
    outletData: [],
    error: null,
};

const outletDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_OUTLET_DETAILS_REQUEST:
            return { ...state, loading: true };
        case FETCH_OUTLET_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                summaryData: {
                    revenue: action.payload.revenue,
                    totalOrders: action.payload.totalOrders,
                    totalOutlets: action.payload.totalOutlets,
                    totalPartners: action.payload.totalPartners,
                },
                outletData: action.payload.outlets,
            };
        case FETCH_OUTLET_DETAILS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default outletDetailsReducer;