import {
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAIL,
  USER_VERIFY_REQUEST,
  USER_VERIFY_SUCCESS,
  USER_VERIFY_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_SIGNOUT,
  USER_SETPIN_REQUEST,
  USER_SETPIN_SUCCESS,
  USER_SETPIN_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_BALANCE_REQUEST,
  USER_BALANCE_SUCCESS,
  USER_BALANCE_FAIL,
} from '../constants/userConstants';

export const signupReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SIGNUP_REQUEST:
      return { loading: true };
    case USER_SIGNUP_SUCCESS:
      return {
        loading: false,

        userInfo: action.payload,
      };
    case USER_SIGNUP_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const verifyReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_VERIFY_REQUEST:
      return {
        loading: true,
      };
    case USER_VERIFY_SUCCESS:
      return {
        loading: false,

        userInfo: action.payload,
      };
    case USER_VERIFY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const pinReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SETPIN_REQUEST:
      return {
        loading: true,
      };
    case USER_SETPIN_SUCCESS:
      return {
        loading: false,
        userInfo: action.payload,
      };
    case USER_SETPIN_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const signinReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SIGNIN_REQUEST:
      return {
        loading: true,
      };
    case USER_SIGNIN_SUCCESS:
      return {
        loading: false,

        userInfo: action.payload,
      };
    case USER_SIGNIN_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case USER_SIGNOUT:
      return {};
    default:
      return state;
  }
};

export const detailsReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return {
        loading: true,
      };
    case USER_DETAILS_SUCCESS:
      return {
        loading: false,
        userInfo: action.payload,
      };
    case USER_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const balanceReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_BALANCE_REQUEST:
      return {
        loading: true,
      };
    case USER_BALANCE_SUCCESS:
      return {
        loading: false,
        balance: action.payload,
      };
    case USER_BALANCE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
