// // src/redux/actions/outletActions.js
// import axios from 'axios';

// // Fetch all outlets
// export const fetchAllOutlets = () => async (dispatch) => {
//     dispatch({ type: 'FETCH_ALL_OUTLETS_REQUEST' });
//     try {
//         const response = await axios.get('https://b2c-49u4.onrender.com/api/v1/admin/allOutlet');
//         dispatch({ type: 'FETCH_ALL_OUTLETS_SUCCESS', payload: response.data });
//     } catch (error) {
//         dispatch({ type: 'FETCH_ALL_OUTLETS_FAILURE', payload: error.message });
//     }
// };

// // Fetch a specific outlet by ID
// export const fetchOutletById = (id) => async (dispatch) => {
//     dispatch({ type: 'FETCH_OUTLET_REQUEST' });
//     try {
//         const response = await axios.get(`https://b2c-49u4.onrender.com/api/v1/admin/oneOutlet/${id}`);
//         dispatch({ type: 'FETCH_OUTLET_SUCCESS', payload: response.data });
//     } catch (error) {
//         dispatch({ type: 'FETCH_OUTLET_FAILURE', payload: error.message });
//     }
// };

// // Add an outlet
// export const addOutlet = (outletData) => async (dispatch) => {
//     dispatch({ type: 'ADD_OUTLET_REQUEST' });
//     try {
//         const response = await axios.post('https://b2c-49u4.onrender.com/api/v1/admin/addOutlet', outletData);
//         dispatch({ type: 'ADD_OUTLET_SUCCESS', payload: response.data });
//     } catch (error) {
//         dispatch({ type: 'ADD_OUTLET_FAILURE', payload: error.message });
//     }
// };

// // Add an outlet partner
// export const addOutletPartner = (partnerData) => async (dispatch) => {
//     dispatch({ type: 'ADD_OUTLET_PARTNER_REQUEST' });
//     try {
//         const response = await axios.post('https://b2c-49u4.onrender.com/api/v1/admin/addOutletPartner', partnerData);
//         dispatch({ type: 'ADD_OUTLET_PARTNER_SUCCESS', payload: response.data });
//     } catch (error) {
//         dispatch({ type: 'ADD_OUTLET_PARTNER_FAILURE', payload: error.message });
//     }
// };

// // Remove an outlet partner by phone number
// export const removeOutletPartner = (phone) => async (dispatch) => {
//     dispatch({ type: 'REMOVE_OUTLET_PARTNER_REQUEST' });
//     try {
//         await axios.delete(`https://b2c-49u4.onrender.com/api/v1/admin/removeOutletPartner/${phone}`);
//         dispatch({ type: 'REMOVE_OUTLET_PARTNER_SUCCESS', payload: phone });
//     } catch (error) {
//         dispatch({ type: 'REMOVE_OUTLET_PARTNER_FAILURE', payload: error.message });
//     }
// };

// src/redux/actions/outletAction.js
// src/redux/actions/outletAction.js


import axios from 'axios';

const FETCH_OUTLETS_REQUEST = 'FETCH_OUTLETS_REQUEST';
const FETCH_OUTLETS_SUCCESS = 'FETCH_OUTLETS_SUCCESS';
const FETCH_OUTLETS_FAILURE = 'FETCH_OUTLETS_FAILURE';

export const fetchOutlets = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_OUTLETS_REQUEST });
    try {
      const response = await axios.get('https://b2c-49u4.onrender.com/api/v1/admin/allOutlet');
      dispatch({ type: FETCH_OUTLETS_SUCCESS, payload: response.data });
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message || error.message : error.message;
      dispatch({ type: FETCH_OUTLETS_FAILURE, payload: errorMessage });
    }
  };
};

// Existing imports...
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const SET_FORM_DATA = 'SET_FORM_DATA';

// Show modal action
export const showModal = (modalType) => ({
    type: SHOW_MODAL,
    payload: modalType,
});

// Hide modal action
export const hideModal = () => ({
    type: HIDE_MODAL,
});

// Set form data action
export const setFormData = (data) => ({
    type: SET_FORM_DATA,
    payload: data,
});