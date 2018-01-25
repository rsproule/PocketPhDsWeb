import React, { Component } from 'react';
import { fire } from '../firebase.js';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';

export default class TutorList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  componentWillMount() {
    fire
      .database()
      .ref('/users')
      .on('value', snap => {
        var users = snap.val();

        for (let u in users) {
          let type = users[u].type;
          if (type === 'tutor') {
            let tutor = {
              name: users[u].name,
              email: users[u].email
            };

            var newTuts;
            if (this.state.tutors) {
              newTuts = this.state.tutors;
            } else {
              newTuts = {};
            }

            newTuts[u] = tutor;
            this.setState({
              tutors: newTuts,
              loaded: true
            });
          }
        }
      });
  }

  componentWillUnmount() {
    // unhook listener here
    fire
      .database()
      .ref('users')
      .off();
  }

  render() {
    return (
      <div style={{ textAlign: 'left' }}>
        {this.state.loaded ? (
          <ListGroup>
            <ListGroupItem id="header">
              <h3>Pocket PhD's Tutors</h3>
            </ListGroupItem>
            {Object.values(this.state.tutors).map((v, i) => {
              return (
                <ListGroupItem key={i}>
                  {v.name + ' - ' + v.email}
                </ListGroupItem>
              );
            })}
          </ListGroup>
        ) : (
          'Loading...'
        )}
      </div>
    );
  }
}
