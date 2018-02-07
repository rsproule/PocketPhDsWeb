import '../../CSS/register.css';

import { fire } from '../firebase.js';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Link from 'valuelink';
import { Input } from 'valuelink/lib/tags';
import { Button } from 'reactstrap';

// wrapper for form inputs that also will show error state
const FormInput = ({ label, shouldShowErrors, ...props }) => (
  <div>
    <label> {label} </label>
    <div className="error-message">
      {shouldShowErrors ? props.valueLink.error || '' : ''}
    </div>
    <Input {...props} />
  </div>
);

/*
    Register Component:
        email and password registrstion form
        managaes state of inputs with dual state data binding from valueLink

*/
export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pswd1: '',
      pswd2: '',
      shouldShowErrors: false,
      redirect: false,
      accountId: '',
      serverError: ''
    };
  }

  /*
      onSubmit function:
        -checks to ensure the form input is clean
        -registers the email + password with firebase
        -sends verification email
        -updates database with minimal info about users
        -redirects to the account page
    */
  onSubmit(containsError) {
    //make sure the form is all good
    if (containsError) {
      this.setState({
        shouldShowErrors: true
      });
      return;
    }

    this.setState({
      registering: true
    });

    // try to register the user
    var registerSuccessful = true;
    fire
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.pswd1)
      .catch(error => {
        registerSuccessful = false;
        this.setState({
          shouldShowErrors: true,
          serverError: error.message,
          registering: false
        });
      })
      .then(() => {
        if (registerSuccessful) {
          // set default display name to email prefix
          fire
            .auth()
            .currentUser.updateProfile({
              displayName: this.state.email.substring(
                0,
                this.state.email.indexOf('@')
              )
            })
            .then(() => {
              // add this user to the database
              fire
                .database()
                .ref('users/' + fire.auth().currentUser.uid)
                .set({
                  type: 'teacher',
                  name: fire.auth().currentUser.displayName,
                  email: this.state.email,
                  school: '',
                  classes: {},
                  subscriptionLevel: 0,
                  profileUrl: '',
                  bio: ''
                })
                .catch(error => alert(error))
                .then(() => {
                  // add user to uid table
                  fire
                    .database()
                    .ref('emailToUId/' + this.state.email.replace('.', ','))
                    .set(fire.auth().currentUser.uid);
                })
                .then(() => {
                  // this will force render to be called again this time with the redirect triggered
                  this.setState({
                    redirect: true,
                    accountId: fire.auth().currentUser.uid
                  });
                });
            });

          // send the verification email
          fire
            .auth()
            .currentUser.sendEmailVerification()
            .then(() => {
              // Email sent.
            })
            .catch(function(error) {
              // An error happened.
              alert(error);
            });
        }
      });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={'account/' + this.state.accountId} />;
    }

    // email regular expression... matches the regex that firebase uses to test formatting
    const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    const emailLink = Link.state(this, 'email')
      .check(x => x, 'Email is Required')
      .check(x => x.match(re), 'Must be a valid E-mail Address');

    const pswd1Link = Link.state(this, 'pswd1').check(
      x => x.length >= 8,
      'Password must be at least 8 characters'
    );

    const pswd2Link = Link.state(this, 'pswd2').check(
      x => x === this.state.pswd1,
      'Passwords must match'
    );

    return (
      <div className="register">
        <div>
          <h2> Welcome to Pocket PhDs! </h2>
          <p>
            Create a teacher account to create classes and monitor your students
            progress.
          </p>
        </div>

        <form className="register-form">
          <FormInput
            label="E-mail"
            shouldShowErrors={this.state.shouldShowErrors}
            type="text"
            placeholder="you@domain.com"
            id="email"
            autoComplete="email"
            required
            valueLink={emailLink}
          />

          <FormInput
            label="Password"
            shouldShowErrors={this.state.shouldShowErrors}
            type="password"
            placeholder="Enter Password"
            autoComplete="new-password"
            required
            valueLink={pswd1Link}
          />

          <FormInput
            label="Confirm Password"
            shouldShowErrors={this.state.shouldShowErrors}
            type="password"
            placeholder="Enter Password"
            autoComplete="new-password"
            required
            valueLink={pswd2Link}
          />

          <div className="error-message">{this.state.serverError}</div>

          <Button
            color="primary"
            disabled={this.state.registering}
            onClick={() =>
              this.onSubmit(
                emailLink.error || pswd1Link.error || pswd2Link.error
              )
            }
            type="submit"
          >
            Create Teacher Account
          </Button>
        </form>
      </div>
    );
  }
}
