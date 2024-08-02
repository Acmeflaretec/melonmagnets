// import React, { useRef,useEffect } from 'react';
// import { GoogleLogin } from 'react-google-login';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { gapi } from 'gapi-script'
// import { FaGoogle } from 'react-icons/fa';
// import styled from 'styled-components';
// import {Button} from 'react-bootstrap';


// const StyledButton = styled(Button)`
//   border-radius: 30px;
//   padding: 0.75rem 2rem;
//   font-weight: bold;
//   transition: all 0.3s ease;

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
//   }
// `;
// const GoogleButton = styled(StyledButton)`
//   background-color: #ffffff;
//   color: #757575;
//   border: 1px solid #e0e0e0;

//   &:hover {
//     background-color: #f5f5f5;
//   }
// `;

// const GoogleLoginComponent = () => {
//     const googleButtonRef = useRef(null);

//     useEffect(() => {
//         function start() {
//             gapi.client.init({
//                 clientId: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
//                 scope: 'profile'
//             })
//         }
//         gapi.load('client:auth2', start)
//     })

//     const navigate = useNavigate();

//     const handleLoginSuccess = async (response) => {
//         console.log('google response', response);
//         const { tokenId } = response;
//         try {
//             const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/v1/auth/google-login`, { tokenId });
//             localStorage.setItem('Tokens', JSON.stringify({ access: res.data.token.accessToken, refresh: res.data.token.refreshToken }));
//             navigate('/');
//         } catch (error) {
//             console.error('Error during Google login: ', error);
//         }
//     };

//     const handleLoginFailure = (response) => {
//         alert('Google login failed')
//         console.error('Google login failed: ', response);
//     };
//     return (
//         <>
//             <GoogleButton onClick={() => googleButtonRef.current.click()}>
//          <FaGoogle className="me-2" /> Log in with Google
//        </GoogleButton>
//        <div style={{ display: 'none' }}>
//                 <GoogleLogin
//                     clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}
//                     buttonText="Login with Google"
//                     onSuccess={handleLoginSuccess}
//                     onFailure={handleLoginFailure}
//                     cookiePolicy={'single_host_origin'}
//                     ref={googleButtonRef}
//                 />
//             </div>
//         </>
//     );
// };

// export default GoogleLoginComponent;



import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script';
import { FaGoogle } from 'react-icons/fa';
import styled from 'styled-components';

const GoogleButton = styled.button`
  background-color: #ffffff;
  color: #757575;
  border: 1px solid #e0e0e0;
  width: 100%;
  margin-bottom: 1rem;
  padding: 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 30px;
   padding: 0.75rem 2rem;
   font-weight: bold;
   transition: all 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
    transform: translateY(-2px);
   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const GoogleLoginComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
        scope: 'profile email'
      }).then(() => {
        gapi.auth2.getAuthInstance();
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  const handleLogin = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then(async (googleUser) => {
      const id_token = googleUser.getAuthResponse().id_token;
      try {
        const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/v1/auth/google-login`, { tokenId: id_token });
        localStorage.setItem('Tokens', JSON.stringify({ access: res.data.token.accessToken, refresh: res.data.token.refreshToken }));
        navigate(-1);
      } catch (error) {
        console.error('Error during Google login: ', error);    
      }
    }).catch((error) => {
      alert('Google login failed');
      console.error('Google login failed: ', error);
    });
  };

  return (
    <GoogleButton onClick={handleLogin}>
      <FaGoogle className="me-2" /> Log in with Google
    </GoogleButton>
  );
};

export default GoogleLoginComponent;

