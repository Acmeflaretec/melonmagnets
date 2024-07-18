import React, { useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script'

const GoogleLoginComponent = () => {

    useEffect(() => { 
        function start() {
          gapi.client.init({
              clientId:import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
              scope:'profile'
          })   
        }
      gapi.load('client:auth2',start)
      })

    const navigate = useNavigate();

    const handleLoginSuccess = async (response) => {
        console.log('google response', response);
        const { tokenId } = response;
        try {
            const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/v1/auth/google-login`, { tokenId });
            localStorage.setItem('Tokens', JSON.stringify({ access: res.data.token.accessToken, refresh: res.data.token.refreshToken }));
            navigate('/');
        } catch (error) {
            console.error('Error during Google login: ', error);
        }
    };

    const handleLoginFailure = (response) => {
        console.error('Google login failed: ', response);
    };
    return (
        <GoogleLogin    
            clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}
            buttonText="Login with Google"
            onSuccess={handleLoginSuccess}
            onFailure={handleLoginFailure}
            cookiePolicy={'single_host_origin'}
        />
    );
};

export default GoogleLoginComponent;
