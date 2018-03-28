import React, { Component } from 'react';
import {
  Card,
  Col,
  Input,
  ListGroup,
  ListGroupItem,
  Row,
  Collapse,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';
import { fire } from '../firebase.js';
import Link from 'valuelink';

export default class ChangeSubscription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teacherCollapse: [],
      teachers: []
    };
  }

  componentWillMount() {
    fire
      .database()
      .ref('users')
      .once('value', snap => {
        snap.forEach(s => {
          let user = s.val();

          if (user.type === 'teacher') {
            let teacher = {
              name: user.name,
              subscriptionLevel: user.subscriptionLevel,
              collapse: false,
              key: s.key
            };
            this.setState({
              teachers: this.state.teachers.concat([teacher])
            });
          }
        });
      });
  }

  toggle(i) {
    var newTeachers = this.state.teachers;
    newTeachers[i].collapse = !newTeachers[i].collapse;
    this.setState({
      teachers: newTeachers
    });
  }

  changeSub(key, i) {
    var newSub = -1;
    while (!(newSub <= 10 && newSub >= 0)) {
      newSub = window.prompt(
        'What should the new subscription level be? (0-10)'
      );
    }

    fire
      .database()
      .ref('users/' + key + '/subscriptionLevel')
      .set(newSub)
      .then(() => {
        var newTeachers = this.state.teachers;
        newTeachers[i].subscriptionLevel = newSub;
        this.setState({
          teachers: newTeachers
        });
      });
  }

  render() {
    return (
      <div
        style={{
          padding: 30 + 'px',
          borderTop: '1px solid lightgrey',
          textAlign: 'left'
        }}
      >
        <h2>Teachers: </h2>
        <ListGroup>
          {this.state.teachers.map((teacher, i) => {
            return (
              <ListGroupItem key={i}>
                <b>{teacher.name}</b>
                <br />
                {'Subscription Level: ' + teacher.subscriptionLevel}
                <Dropdown
                  style={{ float: 'right' }}
                  isOpen={teacher.collapse}
                  toggle={() => this.toggle(i)}
                >
                  <DropdownToggle caret>More</DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      onClick={() => this.changeSub(teacher.key, i)}
                    >
                      {' '}
                      Change Subscription{' '}
                    </DropdownItem>

                    {/* <DropdownItem divider /> */}

                    {/* <DropdownItem style={{textDecorationColor: 'danger'}} > Delete Teacher </DropdownItem> */}
                  </DropdownMenu>
                </Dropdown>
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </div>
    );
  }
}
