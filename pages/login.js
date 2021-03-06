import Helmet from 'react-helmet';
import Layout from '../components/Layout.js';
import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import Link from 'next/link';
import Auth from '../components/Auth.js';
import Login from '../components/Login.js';

class LoginPage extends Component {
  constructor(props) {
    super(props);
  }

  authValidation = async event => {
    const key = window.localStorage.getItem('AuthToken');
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
        <Head>
          <link rel="stylesheet" href="/static/styles/style.css" />
        </Head>
        <h1> Login Form</h1>
        <Login />
      </div>
    );
  }
}

export default LoginPage;
