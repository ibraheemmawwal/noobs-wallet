import React from 'react'; // { useState, useEffect }
import {
  useDispatch,
  //  useSelector
} from 'react-redux';
import { signout } from '../actions/userActions';

export default function Dashboard(props) {
  const dispatch = useDispatch();

  const signoutHandler = () => {
    dispatch(signout());
  };

  return (
    <div>
      <button onClick={signoutHandler}>Signout</button>
    </div>
  );
}
