import React, { Component } from 'react';
import { fire } from '../firebase.js';
import { ListGroup, ListGroupItem, Button } from 'reactstrap';

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

  deleteTutor(key) {
    if (
      window.confirm(
        'Are you sure you want to delete ' +
          this.state.tutors[key].name +
          '? This is an irreversable action.'
      )
    ) {
      fire
        .database()
        .ref('users/' + key)
        .remove()
        .then(res => {
          var newTuts = this.state.tutors;
          delete newTuts[key];
          this.setState({
            tutors: newTuts
          });
        });
    }
  }

  render() {
    return (
      <div style={{ textAlign: 'left' }}>
        {this.state.loaded ? (
          <ListGroup>
            <ListGroupItem id="header">
              <h3>Pocket PhD's Tutors</h3>
            </ListGroupItem>
            {Object.entries(this.state.tutors).map(([k, v], i) => {
              return (
                <ListGroupItem key={i}>
                  {v.name + ' - ' + v.email}
                  <Button
                    onClick={() => this.deleteTutor(k)}
                    style={{ float: 'right' }}
                    color="danger"
                  >
                    Delete Tutor
                  </Button>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        ) : (
          <center>Loading...</center>
        )}
      </div>
    );
  }
}
