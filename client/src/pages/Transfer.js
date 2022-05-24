import React, { useEffect, useState } from 'react';
import { transfer } from '../actions/transactionActions';
import { useDispatch, useSelector } from 'react-redux';
import { TRANSACTION_TRANSFER_CLEAR } from '../constants/transactionConstants';
import { useNavigate } from 'react-router-dom';

export default function Transfer(props) {
  const transactionTransfer = useSelector((state) => state.transactionTransfer);
  const { loading, error, success, transaction } = transactionTransfer;

  const [receipient, setReceipient] = useState('');
  const [amount, setAmount] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'receipient') {
      setReceipient(value);
    } else if (name === 'amount') {
      setAmount(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(transfer(amount, receipient));
  };

  useEffect(() => {
    if (success) {
      navigate('/dashboard');
      dispatch({ type: TRANSACTION_TRANSFER_CLEAR });
    }
  }, [success, navigate, dispatch]);
  console.log(transaction);

  return (
    <div>
      <h1>Transfer</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={amount}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Recipient</label>
          <input
            type="text"
            name="receipient"
            value={receipient}
            onChange={handleChange}
          />
        </div>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        <button type="submit">Transfer</button>
      </form>
    </div>
  );
}
