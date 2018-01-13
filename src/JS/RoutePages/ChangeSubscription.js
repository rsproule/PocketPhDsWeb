import { fire } from '../firebase.js';
import React, { Component } from 'react';
//bootstrap
import { Button, FormGroup, Input, Label } from 'reactstrap';
import Link from 'valuelink';

export default class ChangeSubscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldShowErrors: false,
      email: '',
      subscriptionLevel: -1,
      searchDone: false
    };
  }

  searchTeachers() {
    const email = this.state.email.split('.').join(',');
    fire
      .database()
      .ref('emailToUId/' + email)
      .once('value', snap => {
        console.log(snap);
        const id = snap.val();

        if (id) {
          // teacher exists
          fire
            .database()
            .ref('users/' + id)
            .once('value', userSnap => {
              const isTeacher = userSnap.val().type === 'teacher';
              if (isTeacher) {
                var teacherName = userSnap.val().name;
                var subscriptionLevel = userSnap.val().subscriptionLevel;

                this.setState({
                  teacherExists: true,
                  searchDone: true,
                  teacherName: teacherName,
                  oldSubscriptionLevel: subscriptionLevel,
                  subscriptionLevel: subscriptionLevel,
                  teacherId: id
                });
              } else {
                this.setState({
                  teacherExists: false,
                  searchDone: true
                });
              }
            });
        } else {
          this.setState({
            teacherExists: false,
            searchDone: true
          });
        }
      });
  }

  submit(subLink) {
    if (subLink.erors) {
      return;
    }
    fire
      .database()
      .ref('users/' + this.state.teacherId + '/subscriptionLevel')
      .set(this.state.subscriptionLevel)
      .then(() => {
        alert('Changed Subscription Successfully');
        this.setState({
          oldSubscriptionLevel: this.state.subscriptionLevel
        });
      });
  }

  render() {
    const emailLink = Link.state(this, 'email').check(
      x => x,
      'Search cannot be empty'
    );

    const subscriptionLevelLink = Link.state(this, 'subscriptionLevel')
      .check(
        x => x >= 0 && x <= 10,
        'Subscription Level must be in the range [0, 10]'
      )
      .check(x => x, 'Subscription level required');

    return (
      <div style={{ marginTop: 10 + 'px' }}>
        <center>
          <FormGroup>
            <Label>Find Teacher: </Label>
            <Input
              style={{ width: '90%', padding: '10px' }}
              onChange={e => emailLink.set(e.target.value)}
              value={emailLink.value}
              type="text"
              placeholder="Enter the teachers email."
            />
            <Button
              style={{ marginTop: 10 + 'px' }}
              color="primary"
              onClick={() => this.searchTeachers()}
            >
              Search
            </Button>
          </FormGroup>

          <div>
            {this.state.searchDone ? (
              this.state.teacherExists ? (
                <div style={{ marginBottom: 100 + 'px' }}>
                  Teacher exists:<br />
                  <b>{this.state.teacherName}</b>
                  <br />
                  Current Subscription Level : {this.state.oldSubscriptionLevel}
                  <br />
                  <FormGroup
                    style={{ width: '60%', padding: '10px', textAlign: 'left' }}
                  >
                    <Label>Set Subscription Level </Label>
                    <div className="error-message">
                      {subscriptionLevelLink.error || ''}
                    </div>
                    <Input
                      onChange={e => subscriptionLevelLink.set(e.target.value)}
                      value={subscriptionLevelLink.value}
                      type="number"
                      placeholder="Enter the teachers email."
                    />
                  </FormGroup>
                  <Button
                    style={{ marginTop: 10 + 'px' }}
                    color="primary"
                    onClick={() => this.submit(subscriptionLevelLink)}
                  >
                    Change Subscription
                  </Button>
                </div>
              ) : (
                'No teacher with that email.'
              )
            ) : null}
          </div>
        </center>
      </div>
    );
  }
}
