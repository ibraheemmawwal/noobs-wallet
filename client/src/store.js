import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

import thunk from 'redux-thunk';
import {
  signupReducer,
  signinReducer,
  verifyReducer,
  pinReducer,
  detailsReducer,
  balanceReducer,
} from './reducers/userReducer';
import {
  transactionListReducer,
  transactionDetailsReducer,
  transactionTransferReducer,
} from './reducers/transactionReducer';

const initialState = {
  userSignin: {
    userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null,
  },
};

const reducers = combineReducers({
  userSignup: signupReducer,
  userSignin: signinReducer,
  userVerify: verifyReducer,
  userSetPin: pinReducer,
  userDetails: detailsReducer,
  userBalance: balanceReducer,
  transactionList: transactionListReducer,
  transactionDetails: transactionDetailsReducer,
  transactionTransfer: transactionTransferReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
