import Helmet from 'react-helmet';
import Layout from '../components/Layout.js';
import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch';
import Head from 'next/head';
import Link from 'next/link';
import Auth from '../components/Auth.js';
import Assessment from '../components/Assessment.js';
import Login from '../components/Login.js';
import PageWrapper from '../components/PageWrapper.js';
import Menu from '../components/Menu.js';
import { Config } from '../config.js';

class assessmentPage extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false };
  }

  static async getInitialProps(context) {
    const assessments = await fetch(
      `${Config.apiUrl}/wp-json/wp/v2/assessments`
    );
    const assessmentsList = await assessments.json();
    return { assessmentsList };
  }

  authValidation = async event => {
    const key = sessionStorage.getItem('AuthToken');
    if (key) {
      this.setState({ loggedIn: true });
    }
  };

  componentDidMount() {
    this.authValidation();
  }
  render() {
    const isLoggedIn = this.state.loggedIn;
    return (
      <div>
        <Head>
          <link rel="stylesheet" href="/static/styles/style.css" />
        </Head>
        <div>
          <Assessment assessmentsList={this.props.assessmentsList} />
        </div>
      </div>
    );
  }
}

export default PageWrapper(assessmentPage);
