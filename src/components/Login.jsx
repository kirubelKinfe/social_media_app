import React from 'react';
import { useNavigate } from 'react-router-dom'
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';

import { GoogleLogin } from '@react-oauth/google';
import { client } from '../client'
import jwt_decode from 'jwt-decode'

const Login = () => {
  const navigate = useNavigate()

  const responseGoogle = (response) => {
    localStorage.setItem('user', JSON.stringify(jwt_decode(response.credential)))
    
    const {name, sub, picture} = jwt_decode(response.credential)
    

    const user = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture
    }

    client.createIfNotExists(user)
    .then(() => navigate('/', {replace: true})
    )
  }
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className=" relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="logo" width="130px" />
          </div>

          <div className="shadow-2xl">
            <GoogleLogin
              onSuccess={(response) => responseGoogle(response)}
              onError={() => console.log('Login Failed')}
            />;
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;