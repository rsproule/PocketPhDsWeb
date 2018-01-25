import Footer from '../Footer.js';
import React, { Component } from 'react';
import { Jumbotron, Input, Label, Button } from 'reactstrap';
import Link from 'valuelink';

export default class Contact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      phone: '',
      message: '',
      shouldShowErrors: false
    };
  }

  sendEmail(nameLink, emailLink, phoneLink, messageLink) {
    this.setState({
      shouldShowErrors: true
    });

    if (
      nameLink.error |
      emailLink.error |
      phoneLink.error |
      messageLink.error
    ) {
      return;
    }

    // send the damn email somehow
  }

  render() {
    const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    var pre = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    const nameLink = Link.state(this, 'name').check(x => x, 'Name is required');
    const emailLink = Link.state(this, 'email')
      .check(x => x, 'Email is required')
      .check(x => x.match(re), 'Must be a valid E-mail Address');
    const phoneLink = Link.state(this, 'phone')
      .check(x => x, 'Phone Number is required')
      .check(x => x.match(pre), 'Must be a valid Phone Number');
    const messageLink = Link.state(this, 'message').check(
      x => x,
      'Message is required'
    );

    return (
      <div>
        <div style={{ padding: 10 + 'px', textAlign: 'left' }}>
          <Jumbotron>
            <p className="display-4">Want to learn more?</p>
            Use the form below to contact us with any questions, interests, and
            to start learning with us!
            <hr className="my-3" />
            <Label>Full Name:</Label>
            <div className="error-message">
              {this.state.shouldShowErrors ? nameLink.error || '' : ''}
            </div>
            <Input
              type="text"
              value={nameLink.value}
              onChange={e => {
                nameLink.set(e.target.value);
              }}
            />
            <br />
            <Label>E-Mail:</Label>
            <div className="error-message">
              {this.state.shouldShowErrors ? emailLink.error || '' : ''}
            </div>
            <Input
              type="text"
              value={emailLink.value}
              onChange={e => {
                emailLink.set(e.target.value);
              }}
            />
            <br />
            <Label>Phone:</Label>
            <div className="error-message">
              {this.state.shouldShowErrors ? phoneLink.error || '' : ''}
            </div>
            <Input
              type="text"
              value={phoneLink.value}
              onChange={e => {
                phoneLink.set(e.target.value);
              }}
            />
            <br />
            <Label>Your Message:</Label>
            <div className="error-message">
              {this.state.shouldShowErrors ? messageLink.error || '' : ''}
            </div>
            <Input
              type="textarea"
              value={messageLink.value}
              onChange={e => {
                messageLink.set(e.target.value);
              }}
            />
            <br />
            <center>
              <Button
                color="primary"
                onClick={() =>
                  this.sendEmail(nameLink, emailLink, phoneLink, messageLink)
                }
              >
                Submit
              </Button>
            </center>
            <br />
            {/* <a href="mailto:wade@pocketphds.com">Send us an email</a>
              &nbsp;
              or give us a call at
              &nbsp;
            <a href="tel:1-847-454-6265">847-454-6265</a> */}
            <br />
            <hr className="my-3" />
            <center>
              Pocket PhDs <br />
              5592 Waterman Avenue<br />
              St. Louis, MO 63112
            </center>
          </Jumbotron>
        </div>
        <Footer />
      </div>
    );
  }
}
