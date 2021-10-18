import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { initializeApp } from "firebase/app";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



const firebaseConfig = {
  apiKey: "AIzaSyBBffkomiozV_0pGm4uaoUBI6AFxQBA1dY",
  authDomain: "nemuke-e4852.firebaseapp.com",
  projectId: "nemuke-e4852",
  storageBucket: "nemuke-e4852.appspot.com",
  messagingSenderId: "36070398332",
  appId: "1:36070398332:web:dee332a8f86dd54ed56cf9",
  measurementId: "G-M0KFJ0BJTB"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

