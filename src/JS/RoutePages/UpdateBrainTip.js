import React, { Component } from 'react';

import Link from 'valuelink';
import { fire } from '../firebase.js';

import { Alert, Button, Card, FormGroup, Input, Label } from 'reactstrap';

export default class UpdateBrainTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldShowErrors: false,
      title: '',
      body: '',
      success: false,
      displayTitle: '',
      displayBody: ''
    };
  }
  updateBrainTip(titleLink, bodyLink) {
    if (titleLink.error || bodyLink.error) {
      this.setState({
        shouldShowErrors: true
      });
      return;
    }

    fire
      .database()
      .ref('tipOfDay/')
      .set({
        title: this.state.title,
        body: this.state.body
      })
      .then(() => {
        this.setState({
          success: true,
          body: '',
          title: '',
          shouldShowErrors: false
        });
      });
  }

  componentWillMount() {
    fire
      .database()
      .ref('tipOfDay')
      .on('value', snap => {
        let title = snap.val().title;
        let body = snap.val().body;

        this.setState({
          displayTitle: title,
          displayBody: body
        });
      });
  }

  render() {
    const titleLink = Link.state(this, 'title').check(
      x => x,
      'Title is required'
    );
    const bodyLink = Link.state(this, 'body').check(x => x, 'Body is required');

    return (
      <div style={{ padding: 20 + 'px', borderTop: '1px solid lightgrey' }}>
        <Card
          style={{
            padding: 20 + 'px',
            textAlign: 'center',
            marginBottom: 15 + 'px',
            backgroundColor: 'lightgrey'
          }}
        >
          <h4>{this.state.displayTitle}</h4>
          <p>{this.state.displayBody}</p>
        </Card>

        <h3>Create New Brain Tip</h3>

        <Card style={{ padding: 20 + 'px', textAlign: 'left' }}>
          <FormGroup>
            <Label> Title: </Label>
            <div className="error-message">
              {this.state.shouldShowErrors ? titleLink.error || '' : ''}
            </div>
            <Input
              onChange={e => titleLink.set(e.target.value)}
              value={titleLink.value}
              type="text"
              placeholder="Enter the title for this brain tip."
            />
          </FormGroup>

          <FormGroup>
            <Label> Body: </Label>
            <div className="error-message">
              {this.state.shouldShowErrors ? bodyLink.error || '' : ''}
            </div>
            <Input
              onChange={e => bodyLink.set(e.target.value)}
              value={bodyLink.value}
              type="textarea"
              placeholder="Enter the body of this brain tip."
            />
          </FormGroup>
        </Card>

        <Button
          onClick={() => this.updateBrainTip(titleLink, bodyLink)}
          style={{ margin: 15 + 'px' }}
          color="primary"
        >
          Update Brain Tip
        </Button>
        {this.state.success ? (
          <Alert>Brain Tip Updated Successfully!</Alert>
        ) : null}
      </div>
    );
  }
}
