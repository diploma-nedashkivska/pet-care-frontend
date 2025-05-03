import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/StartStyle.css';

export default function StartPage() {
  return (
    <div className="start-page">
      <h1>wow</h1>
      <img
        src="https://diploma-nedashkivska.s3.eu-north-1.amazonaws.com/user_profile/b4ee3f2c4f374b9ba6437ca57bae08e2.jpg"
        alt="pupu"
        className="profile-photo"
      />
    </div>
  );
}
