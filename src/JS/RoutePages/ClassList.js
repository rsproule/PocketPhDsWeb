import '../../CSS/classes.css';

import { fire } from '../firebase.js';
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
//bootstrap
import { Button, ListGroup, ListGroupItem, Table } from 'reactstrap';

export default class ClassList extends Component {
  componentWillMount() {
    // here i will attach listeners to the database
    // and do all the logic that is required to obtain the needed class data

    this.setState({
      loaded: false,
      classes: []
    });

    for (let cid in this.props.classes) {
      // reads only once
      fire
        .database()
        .ref('/classes/' + cid)
        .once('value', snap => {
          let name = snap.val().name;

          this.setState({
            classes: this.state.classes.concat([
              {
                id: cid,
                name: name
              }
            ]),
            loaded: true
          });
        });
    }
  }

  render() {
    return this.state.loaded ? (
      <div className="classes-wrapper">
        <ListGroup>
          <ListGroupItem id="header">
            <h3>Your Classes</h3>
          </ListGroupItem>
          {this.state.classes.map((c, i) => {
            return (
              <Link key={i} to={'/class/' + c.id}>
                <ListGroupItem action>{c.name}</ListGroupItem>
              </Link>
            );
          })}
        </ListGroup>

        <div className="add-class-btn">
          <Link to="/create-class">
            <Button color="primary"> Add Class </Button>
          </Link>
        </div>
      </div>
    ) : (
      <div className="add-class-btn">
        <Link to="/create-class">
          <Button color="primary"> Add Class </Button>
        </Link>
      </div>
    );
  }
}
