import React, { Component } from 'react';
import { fire } from '../firebase.js';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class AdminClasses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      classes: []
    };
  }

  componentWillMount() {
    fire
      .database()
      .ref('classes')
      .once('value', classList => {
        classList.forEach(classSnap => {
          let name = classSnap.val().name;

          this.setState({
            classes: this.state.classes.concat([
              {
                id: classSnap.key,
                name: name
              }
            ]),
            loaded: true
          });
        });
      });
  }

  render() {
    return this.state.loaded ? (
      <div className="classes-wrapper">
        <ListGroup>
          <ListGroupItem id="header">
            <h3>Pocket PhD Classes</h3>
          </ListGroupItem>
          {this.state.classes.map((c, i) => {
            return (
              <Link key={i} to={'/class/' + c.id}>
                <ListGroupItem action>{c.name}</ListGroupItem>
              </Link>
            );
          })}
        </ListGroup>
      </div>
    ) : (
      <div>Loading...</div>
    );
  }
}
