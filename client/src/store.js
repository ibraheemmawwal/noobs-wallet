import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

import thunk from 'redux-thunk';
import {
  signupReducer,
  signinReducer,
  verifyReducer,
  pinReducer,
} from './reducers/userReducer';

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
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
