import '../../CSS/login.css';

import { fire } from '../firebase.js';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Link from 'valuelink';
import { Input } from 'valuelink/lib/tags';
import { Button } from 'reactstrap';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loggedIn: false,
      errorMsg: '',
      loggingIn: false
    };
  }

  login() {
    this.setState({
      loggingIn: true
    });
    var loginSuccessful = true;
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => {
        // Handle Errors here.
        loginSuccessful = false;
        this.setState({
          errorMsg: error.message,
          loggingIn: false
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
      <form className="login" onSubmit={() => this.login()}>
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
          autoComplete="email"
          placeholder="Enter E-Mail"
          valueLink={Link.state(this, 'email')}
        />

        <label> Password </label>
        <Input
          type="password"
          autoComplete="current-password"
          placeholder="Enter Password"
          valueLink={Link.state(this, 'password')}
        />

        <div className="error-message">{this.state.errorMsg}</div>
        <Button
          disabled={this.state.loggingIn}
          color="primary"
          onClick={() => {
            this.login();
          }}
        >
          {' '}
          Log In{' '}
        </Button>
      </form>
    );
  }
}

export default Login;
