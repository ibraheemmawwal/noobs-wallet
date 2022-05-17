import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verify } from '../actions/userActions';
import { useNavigate, useLocation } from 'react-router-dom';
import OtpInput from 'react-otp-input';

export default function VerifyPage(props) {
  const [otp, setOtp] = useState('');
  const userVerify = useSelector((state) => state.userVerify);
  const { loading, error, userInfo } = userVerify;

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/signup/setpin';

  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(verify(otp));
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  return (
    <div className="container">
      <h1>Verify OTP</h1>
      <form onSubmit={handleSubmit}>
        <p>OTP has been sent to your mail </p>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        <OtpInput
          id="otp"
          value={otp}
          onChange={setOtp}
          // onChange={(e) => setOtp(e.target.value)}
          numInputs={6}
          separator={<span>-</span>}
        />

        <button type="submit" className="btn btn-primary">
          Verify
        </button>
      </form>
    </div>
  );
}
