import React from 'react';
import { GoogleLogin } from 'react-google-login';

const GoogleLoginButton = () => {
  const handleLoginSuccess = (response) => {
    console.log('Google login successful:', response);
    // Handle success, possibly send the token to your backend for verification
  };

  const handleLoginFailure = (response) => {
    console.error('Google login failed:', response);
  };

  return (
    <GoogleLogin
      clientId={import.meta.env.VITE_APP_GOOGLE_ID}
      buttonText="Login with Google"
      onSuccess={handleLoginSuccess}
      onFailure={handleLoginFailure}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default GoogleLoginButton;
