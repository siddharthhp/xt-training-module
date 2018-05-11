import Helmet from "react-helmet";
import Layout from "../components/Layout.js";
import React, { Component } from "react";
import fetch from "isomorphic-unfetch";
import Link from "next/link";
import Auth from "../components/Auth.js";
import Login from "../components/Login.js";

class LoginPage extends Component {   
	constructor(props) {
        super(props);
        this.state={showLoginPage: false};
    }

    authValidation = async (event) => {
        const key = sessionStorage.getItem('AuthToken');
        if (key) {
            this.setState({showLoginPage: true});
        }
    }

    componentWillMount() {
        this.authValidation();
    }

    render() {
    	if(this.state.showLoginPage) {
	        return (
	        	<div className = "login-container">
		        	Already logged in !
		        </div>
	        );
    	} else {
    		return (
	        	<div className = "login-container">
		        	<Helmet>
				        <link rel="stylesheet" href="/static/styles/style.css" />
				    </Helmet>
				    <h1> Login Form</h1>
		            <Login>                
		            </Login>
		        </div>
	        );
    	}
    }
}

export default LoginPage;
