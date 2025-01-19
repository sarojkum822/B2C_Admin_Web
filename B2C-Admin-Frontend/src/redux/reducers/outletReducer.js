// // const initialState = {
// //     loading: false,
// //     outlets: [],
// //     revenue: 0,
// //     totalOrders: 0,
// //     totalOutlets: 0,
// //     totalPartners: 0,
// //     error: null,
// //   };
  
// //   const outletReducer = (state = initialState, action) => {
// //     switch (action.type) {
// //       case 'FETCH_OUTLETS_REQUEST':
// //         return { ...state, loading: true };
// //       case 'FETCH_OUTLETS_SUCCESS':
// //         return {
// //           ...state,
// //           loading: false,
// //           ...action.payload, // spread the payload data directly
// //         };
// //       case 'FETCH_OUTLETS_FAILURE':
// //         return { ...state, loading: false, error: action.payload };
// //       default:
// //         return state;
// //     }
// //   };
  
// //   export default outletReducer;
  
// // Existing imports...
// import { SHOW_MODAL, HIDE_MODAL, SET_FORM_DATA } from '../actions/outletAction';

// const initialState = {
//     outlets: [],
//     loading: false,
//     error: null,
//     showModalType: null,
//     formData: {},
// };

//  const outletReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case SHOW_MODAL:
//             return { ...state, showModalType: action.payload };
//         case HIDE_MODAL:
//             return { ...state, showModalType: null };
//         case SET_FORM_DATA:
//             return { ...state, formData: { ...state.formData, ...action.payload } };
       
//         default:
//             return state;
//     }
// };
// export default outletReducer;