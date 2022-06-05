import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
import { signout, getBalance } from '../actions/userActions';
import {
  transactionListMine,
  detailsTransaction,
} from '../actions/transactionActions';

import { Link } from 'react-router-dom';

export default function Dashboard(props) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const userBalance = useSelector((state) => state.userBalance);
  const { balance } = userBalance;

  const transactionDetails = useSelector((state) => state.transactionDetails);
  const { details, success, load, err } = transactionDetails;

  const transactionList = useSelector((state) => state.transactionList);
  const { transactions, loading, error } = transactionList;

  useEffect(() => {
    dispatch(transactionListMine());
    dispatch(getBalance());
  }, [dispatch]);

  const handleOpen = (id) => {
    dispatch(detailsTransaction(id));
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const signoutHandler = () => {
    dispatch(signout());
  };
  console.log(details);
  return (
    <>
      <div>
        <button onClick={signoutHandler}>Signout</button>
      </div>

      <div>
        <h1>Dashboard</h1>
        <p>Welcome {userInfo.username}</p>
        <h1> Balance:{balance}</h1>

        <div>
          <h2>Transactions</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>txnType</th>
                  <th>purpose</th>
                  <th>time</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.txnType}</td>
                    <td>{transaction.purpose}</td>
                    <td>{transaction.createdAt}</td>
                    <td>
                      <button
                        id={transaction.id}
                        onClick={(e) => {
                          handleOpen(e.target.id);
                        }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div>
        <Modal
          isOpen={open}
          // onAfterOpen={afterOpenModal}
          onRequestClose={handleClose}
          // appElement={document.getElementById('app')}
          ariaHideApp={false}
          contentLabel="Example Modal"
        >
          <button onClick={handleClose}>close</button>
          <h2>Transaction Details</h2>
          {load ? (
            <p>Loading...</p>
          ) : err ? (
            <p>{err}</p>
          ) : (
            <>
              <p>Amount: {details?.amount}</p>
              <p>Balance After: {details?.balanceAfter}</p>
              <p>Balance Before: {details?.balanceBefore}</p>
              <p>Date Created: {details?.createdAt}</p>
              <p>Transaction Type: {details?.txnType}</p>
              <p>{details?.transactionAmount}</p>
            </>
          )}
        </Modal>
      </div>

      <Link to="/transfer">Transfer</Link>
      <Link to="/deposit">Deposit</Link>
    </>
  );
}
