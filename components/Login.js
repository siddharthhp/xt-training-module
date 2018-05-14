import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Link from 'next/link';
import Auth from './Auth';
import { Config } from '../config.js';

async function store(value, name, id) {
  const tokenKey = 'AuthToken';
  const userName = 'Name';
  const user_id = 'id';
  if (value === undefined) {
    return sessionStorage.getItem(tokenKey);
  }

  sessionStorage.setItem(tokenKey, value);
  sessionStorage.setItem(userName, name);
  sessionStorage.setItem(user_id, id);
}

const auth = {
  get isAuthenticated() {
    return store() !== null;
  },
  authenticate(username, password, fn) {
    let api = new Auth();
    api
      .authenticate(username, password)
      .then(obj => {
        console.log(obj);
        store(obj.token, obj.user_display_name, obj.user_id);
        fn();
      })
      .catch(error => {
        fn(true);
      });
  }
};

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: null,
      password: null
    };

    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  login(event) {
    event.preventDefault();
    auth.authenticate(this.state.username, this.state.password, error => {
      if (error) {
        this.elem.querySelectorAll('.is-error')[0].classList.remove('hidden');
      } else {
        this.setState({ redirectTo: true });
      }
    });
  }

  handleChange(e) {
    const target = e.target;
    const value = target.value;
    const id = target.id;

    this.setState({
      [id]: value
    });
  }

  render() {
    if (this.state.redirectTo) {
      window.location.href = './';
    }

    return (
      <form action="" method="post">
        <div className="row" ref={elem => (this.elem = elem)}>
          <div className="form-group">
            <label htmlFor="username">User Name</label>
            <input
              type="text"
              className="form-control"
              id="username"
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              onChange={this.handleChange}
            />
          </div>
          <span className="hidden is-error">
            Incorrect credentials. Please try again with correct credentials.{' '}
          </span>
          <input
            type="submit"
            className="btn btn-default"
            onClick={this.login}
            value="Login"
          />
          <span>
            <Link href="/signup">New User? Signup here</Link>
          </span>
          <span className="t-float-right">
            <Link href="./">Go back to Courses</Link>
          </span>
        </div>
      </form>
    );
  }
}

export default Login;
