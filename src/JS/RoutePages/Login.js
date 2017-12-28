import '../../CSS/login.css';

import { fire } from '../firebase.js';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Link from 'valuelink';
import { Input } from 'valuelink/lib/tags';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loggedIn: false,
      errorMsg: ''
    };
  }

  login() {
    var loginSuccessful = true;
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => {
        // Handle Errors here.
        loginSuccessful = false;
        this.setState({
          errorMsg: error.message
        });
      })
      .then(() => {
        if (loginSuccessful) {
          this.setState({
            loggedIn: true
          });
        }
      });
  }

  render() {
    // successful login redirect
    if (this.state.loggedIn) {
      return <Redirect loggedIn="true" to="/account" />;
    }

    return (
      <div className="login">
        <div>
          <h2> Log In </h2>

          <p>
            {' '}
            Sign in to access your account, your classes and all the other great
            Pocket PhD features.{' '}
          </p>
        </div>
        <br />

        <label> E-Mail </label>
        <Input
          type="text"
          placeholder="Enter E-Mail"
          valueLink={Link.state(this, 'email')}
        />

        <label> Password </label>
        <Input
          type="password"
          placeholder="Enter Password"
          valueLink={Link.state(this, 'password')}
        />

        <div className="error-message">{this.state.errorMsg}</div>
        <button
          onClick={() => {
            this.login();
          }}
        >
          {' '}
          Log In{' '}
        </button>
      </div>
    );
  }
}

export default Login;
