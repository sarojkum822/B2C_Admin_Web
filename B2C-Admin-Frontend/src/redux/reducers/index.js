// src/redux/reducers/index.js
import { combineReducers } from 'redux';
import outletReducer from './outletReducer';

const rootReducer = combineReducers({
  outletReducer,
  // Add other reducers here if needed
});

export default rootReducer;
