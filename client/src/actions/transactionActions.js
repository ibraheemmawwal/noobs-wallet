import Axios from 'axios';
import {
  TRANSACTION_TRANSFER_REQUEST,
  TRANSACTION_TRANSFER_SUCCESS,
  TRANSACTION_TRANSFER_FAIL,
  TRANSACTION_MINE_REQUEST,
  TRANSACTION_MINE_SUCCESS,
  TRANSACTION_MINE_FAIL,
  TRANSACTION_DETAILS_REQUEST,
  TRANSACTION_DETAILS_SUCCESS,
  TRANSACTION_DETAILS_FAIL,
} from '../constants/transactionConstants';

export const transactionListMine = () => async (dispatch, getState) => {
  dispatch({ type: TRANSACTION_MINE_REQUEST });
  const {
    userSignin: { userInfo },
  } = getState();

  try {
    const { data } = await Axios.get('/api/transactions/mine', {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    dispatch({ type: TRANSACTION_MINE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: TRANSACTION_MINE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const detailsTransaction = (id) => async (dispatch, getState) => {
  dispatch({ type: TRANSACTION_DETAILS_REQUEST, payload: id });
  const {
    userSignin: { userInfo },
  } = getState();

  try {
    const { data } = await Axios.get(`/api/transactions/${id}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    dispatch({ type: TRANSACTION_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: TRANSACTION_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const transfer = (amount, receipient) => async (dispatch, getState) => {
  dispatch({
    type: TRANSACTION_TRANSFER_REQUEST,
    payload: { amount, receipient },
  });
  const {
    userSignin: { userInfo },
  } = getState();

  try {
    const { data } = await Axios.post(
      '/api/transactions/transfer',
      { amount, receipient },

      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );

    dispatch({ type: TRANSACTION_TRANSFER_SUCCESS, payload: data.transaction });
  } catch (error) {
    dispatch({
      type: TRANSACTION_TRANSFER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
