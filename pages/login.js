import Helmet from 'react-helmet';
import Layout from '../components/Layout.js';
import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import Auth from '../components/Auth.js';
import Login from '../components/Login.js';

class LoginPage extends Component {
  constructor(props) {
    super(props);
  }

  authValidation = async event => {
    const key = sessionStorage.getItem('AuthToken');
    if (key) {
      window.location.href = './';
    }
  };

  componentWillMount() {
    this.authValidation();
  }

  render() {
    return (
      <div className="login-container">
        <Helmet>
          <link rel="stylesheet" href="/static/styles/style.css" />
        </Helmet>
        <h1> Login Form</h1>
        <Login />
      </div>
    );
  }
}

export default LoginPage;
