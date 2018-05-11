import React, { Component } from "react";
import Link from "next/link";
import Head from "next/head";
import { Config } from "../config.js";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
        username: null,
        password: null,
        email: null
    };

    this.signup = this.signup.bind(this);
    this.handleChange = this.handleChange.bind(this);      
  }

  signup = async (event) => {
    event.preventDefault();
    const payload = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email
    };
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const signupData = await fetch(`${Config.apiUrl}/wp-json/wp/v2/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    }).then(response => response.json());
      this.elem.querySelectorAll('.success-message')[0].classList.remove('hidden');      
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
    return (
      <form action="" method="post">
        <div className="row"  ref = {elem => this.elem = elem}>
        <span className="success-message hidden">User has been successfully registered. <Link href="./login">Login here</Link></span>
            <div className="form-group">
                <label htmlFor="email">Email Id</label>
                <input type="text" className="form-control" id="email" onChange={this.handleChange}/>
            </div>
            <div className="form-group">
                <label htmlFor="username">User Name</label>
                <input type="text" className="form-control" id="username" onChange={this.handleChange}/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" onChange={this.handleChange} />
            </div>
            <input type="submit" className="btn btn-default" onClick={this.signup} value="Signup" />
        </div>
        </form>
    );
  }
}

export default Signup;