import Helmet from 'react-helmet';
import Layout from '../components/Layout.js';
import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import Link from 'next/link';
import Signup from '../components/Signup.js';

class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = { showSignupPage: false };
  }

  authValidation = async event => {
    const key = window.localStorage.getItem('AuthToken');
    if (key) {
      this.setState({ showSignupPage: true });
    }
  };

  componentWillMount() {
    this.authValidation();
  }

  render() {
    if (this.state.showSignupPage) {
      return <div className="login-container">Already logged in !</div>;
    } else {
      return (
        <div className="signup-container">
          <Head>
            <link rel="stylesheet" href="/static/styles/style.css" />
          </Head>
          <h1> User Registration Form</h1>
          <Signup />
        </div>
      );
    }
  }
}

export default SignupPage;
