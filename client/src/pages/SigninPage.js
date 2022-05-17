import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signin } from '../actions/userActions';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function SigninPage(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  // const redirect = redirectInUrl ? redirectInUrl : '/dashboard';
  const redirect2 = redirectInUrl ? redirectInUrl : '/signup/verify';

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  };
  useEffect(() => {
    // if (!userInfo.active) {
    //   navigate(redirect2);
    // }
    if (userInfo) {
      navigate(redirect2);
    }
  }, [userInfo, navigate, redirect2]);

  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Sign In</h1>
          {loading && <div>Loading...</div>}
          {error && <div>{error}</div>}
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Sign In
          </button>
        </div>

        <label />
        <div>
          Already a user <Link to={'/signup'}>Create your account</Link>
        </div>
      </form>
    </div>
  );
}
