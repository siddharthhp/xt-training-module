import Helmet from "react-helmet";
import Layout from "../components/Layout.js";
import React, { Component } from "react";
import fetch from "isomorphic-unfetch";
import Link from "next/link";
import Signup from "../components/Signup.js";

class SignupPage extends Component {   
	constructor(props) {
        super(props);
        this.state={showSignupPage: false};
    }

    authValidation = async (event) => {
        const key = sessionStorage.getItem('AuthToken');
        if (key) {
            this.setState({showSignupPage: true});
        }
    }

    componentWillMount() {
        this.authValidation();
    }

    render() {
    	if(this.state.showSignupPage) {
	        return (
	        	<div className = "login-container">
		        	Already logged in !
		        </div>
	        );
    	} else {
    		return (
	        	<div className = "signup-container">
		        	<Helmet>
				        <link rel="stylesheet" href="/static/styles/style.css" />
				    </Helmet>
                    <h1> User Registration Form</h1>
		            <Signup>                
		            </Signup>
		        </div>
	        );
    	}
    }
}

export default SignupPage;
