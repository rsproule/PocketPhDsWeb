/*jshint loopfunc: true */

import { fire, initSecondary } from '../firebase.js';
import React, { Component } from 'react';
//bootstrap
import {
  Alert,
  Button,
  Card,
  Col,
  FormGroup,
  Input,
  Label,
  Row
} from 'reactstrap';
import Link from 'valuelink';

export default class AddTutor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldShowErrors: false,
      name: '',
      email: ''
    };
  }

  addTutor(nameLink, emailLink) {
    //ensure no errors
    if (nameLink.error || emailLink.error) {
      this.setState({
        shouldShowErrors: true
      });
      return;
    }

    let password =
      Math.random()
        .toString(36)
        .substr(2, 8) +
      Math.random()
        .toString(36)
        .substr(2, 8);

    let secondaryFire = initSecondary();
    //send email
    secondaryFire
      .auth()
      .createUserWithEmailAndPassword(this.state.email, password)
      .catch(err => {
        alert(err);
        this.setState({
          serverErrors: err,
          shouldShowErrors: true
        });
        return;
      })
      .then(userAuth => {
        if (this.state.serverErrors) {
          return;
        }

        let id = this.getId(userAuth);
        // update db
        return fire
          .database()
          .ref('users/' + id)
          .set({
            name: this.state.name,
            email: this.state.email,
            type: 'tutor',
            bio: 'Tutor for Pocket Phds',
            school: 'Pocket Phds Tutoring'
          });
      })
      .then(() => {
        if (this.state.serverErrors) {
          secondaryFire.delete();
          return;
        }
        // delete secondary auth instance
        secondaryFire.delete();
        // clear form
        let name = this.state.name;
        this.setState({
          shouldShowErrors: false,
          name: '',
          email: '',
          success: name
        });
      });
  }

  getId(userAuth) {
    // HACK: There is an upcoming update that will make the promise
    // return a AuthUser instead of a User. When that happens the
    // if statement should resolve true and still work fine
    return userAuth.user ? userAuth.user.uid : userAuth.uid;
  }

  render() {
    const nameLink = Link.state(this, 'name').check(x => x, 'Name is required');
    const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    const emailLink = Link.state(this, 'email')
      .check(x => x, 'Email is required')
      .check(
        x => x.match(re),
        'Must be a valid E-mail Address (you@domain.com)'
      );

    return (
      <div style={{ padding: 30 + 'px', borderTop: '1px solid lightgrey' }}>
        <Card>
          <div style={{ padding: 10 + 'px' }}>
            <Row>
              <Col>
                <FormGroup>
                  <Label> Tutor Name </Label>
                  <div className="error-message">
                    {this.state.shouldShowErrors ? nameLink.error || '' : ''}
                  </div>
                  <Input
                    onChange={e => nameLink.set(e.target.value)}
                    value={nameLink.value}
                    type="text"
                    placeholder="Enter the tutors's name."
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label> Tutor E-Mail </Label>
                  <div className="error-message">
                    {this.state.shouldShowErrors ? emailLink.error || '' : ''}
                  </div>
                  <Input
                    onChange={e => emailLink.set(e.target.value)}
                    value={emailLink.value}
                    type="text"
                    placeholder="Enter the tutors's email."
                  />
                </FormGroup>
              </Col>
            </Row>
            <Button
              color="primary"
              onClick={() => this.addTutor(nameLink, emailLink)}
            >
              Add Tutor
            </Button>
          </div>
        </Card>
        {this.state.success ? (
          <Alert color="success">
            Tutor ({this.state.success}) created successfully.
          </Alert>
        ) : null}
      </div>
    );
  }
}
