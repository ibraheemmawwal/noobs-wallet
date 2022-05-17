import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pin } from '../actions/userActions';
import { useNavigate, useLocation } from 'react-router-dom';
import OtpInput from 'react-otp-input';

export default function SetpinPage(props) {
  const [pin, setPin] = useState('');

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const userSetPin = useSelector((state) => state.userSetPin);
  const {
    success: successSetPin,
    error: errorSetPin,
    loading: loadingSetPin,
  } = userSetPin;

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/dashboard';

  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(Pin(pin));
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
        <p>Pin has been sent to your mail </p>
        {loadingSetPin && <div>Loading...</div>}
        {errorSetPin && <div>{errorSetPin}</div>}
        {successSetPin && <div>Pin Set</div>}
        <OtpInput
          id="pin"
          value={pin}
          onChange={setPin}
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
