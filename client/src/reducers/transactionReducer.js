import {
  TRANSACTION_MINE_REQUEST,
  TRANSACTION_MINE_SUCCESS,
  TRANSACTION_MINE_FAIL,
  TRANSACTION_DETAILS_REQUEST,
  TRANSACTION_DETAILS_SUCCESS,
  TRANSACTION_DETAILS_FAIL,
  TRANSACTION_TRANSFER_REQUEST,
  TRANSACTION_TRANSFER_SUCCESS,
  TRANSACTION_TRANSFER_FAIL,
  TRANSACTION_TRANSFER_CLEAR,
} from '../constants/transactionConstants';

export const transactionListReducer = (
  state = { transactions: [] },
  action
) => {
  switch (action.type) {
    case TRANSACTION_MINE_REQUEST:
      return { loading: true };
    case TRANSACTION_MINE_SUCCESS:
      return { loading: false, transactions: action.payload };
    case TRANSACTION_MINE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const transactionDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case TRANSACTION_DETAILS_REQUEST:
      return { loading: true };
    case TRANSACTION_DETAILS_SUCCESS:
      return { loading: false, details: action.payload };
    case TRANSACTION_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const transactionTransferReducer = (state = {}, action) => {
  switch (action.type) {
    case TRANSACTION_TRANSFER_REQUEST:
      return { loading: true };
    case TRANSACTION_TRANSFER_SUCCESS:
      return { loading: false, success: true, transaction: action.payload };
    case TRANSACTION_TRANSFER_FAIL:
      return { loading: false, error: action.payload };
    case TRANSACTION_TRANSFER_CLEAR:
      return {};
    default:
      return state;
  }
};
