import React, { Component } from 'react';
import {
  Card,
  Col,
  Input,
  ListGroup,
  ListGroupItem,
  Row,
  Collapse,
  Button
} from 'reactstrap';
import { fire } from '../firebase.js';
import Link from 'valuelink';

export default class AssignTutor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tutorCollapseOpen: false,
      classCollapsOpen: false,
      tutors: [],
      classes: []
    };
  }

  componentWillMount() {
    //load in all the classes
    fire
      .database()
      .ref('/classes')
      .once('value', snapList => {
        snapList.forEach(classSnap => {
          let name = classSnap.val().name;
          let key = classSnap.key;
          this.setState({
            classes: this.state.classes.concat([
              {
                name: name,
                key: key
              }
            ])
          });
        });
      });

    //load in all the tutors
    fire
      .database()
      .ref('/users')
      .once('value', snapList => {
        snapList.forEach(userSnap => {
          let type = userSnap.val().type;
          if (type === 'tutor') {
            let name = userSnap.val().name;
            let key = userSnap.key;
            this.setState({
              tutors: this.state.tutors.concat([
                {
                  name: name,
                  key: key
                }
              ])
            });
          }
        });
      });
  }

  assignTutor() {
    // check that not null
    if (!this.state.selectedClass | !this.state.selectedTutor) {
      alert('You must choose a class and tutor');
      return;
    }

    var c = this.state.selectedClass;
    var tutor = this.state.selectedTutor;

    // assign each student chat to tutor
    this.addAllStudentChats(c.key, tutor.key);

    // assign each parent chat to tutor
    this.addAllParentChats(c.key, tutor.key);

    //clean up
    this.setState({
      selectedClass: undefined,
      selectedTutor: undefined
    });
  }

  addAllStudentChats(classId, tutorId) {
    fire
      .database()
      .ref('/classes/' + classId + '/students')
      .once('value', studentList => {
        studentList.forEach(student => {
          let studentId = student.key;

          fire
            .database()
            .ref('/users/' + studentId + '/chat')
            .once('value', chat => {
              // here is every students chat id
              let chatId = chat.val();

              // put them all in the tutors chat list
              fire
                .database()
                .ref('users/' + tutorId + '/chats/' + chatId)
                .set(true);
            });
        });
      });
  }

  addAllParentChats(classId, tutorId) {
    fire
      .database()
      .ref('/classes/' + classId + '/students')
      .once('value', studentList => {
        studentList.forEach(student => {
          let studentId = student.key;
          //need to search through all the parents to find whos their kid

          fire
            .database()
            .ref('/users/')
            .once('value', usersSnap => {
              usersSnap.forEach(userSnap => {
                let type = userSnap.val().type;
                if (type === 'parent') {
                  let child = Object.keys(userSnap.val().student)[0];
                  //console.log("Key: " + child);

                  if (child === studentId) {
                    let parentChat = userSnap.val().chat;
                    fire
                      .database()
                      .ref('users/' + tutorId + '/chats/' + parentChat)
                      .set(true);
                  }
                }
              });
            });
        });
      });
  }

  toggleClassCollapse() {
    this.setState({
      classCollapseOpen: !this.state.classCollapseOpen
    });
  }

  toggleTutorCollapse() {
    this.setState({
      tutorCollapseOpen: !this.state.tutorCollapseOpen
    });
  }

  render() {
    const classesLink = Link.state(this, 'classes');

    const tutorsLink = Link.state(this, 'tutors');

    const checkboxStyle = {
      display: 'flex',
      //border: '1px solid black',
      margin: 'auto 0'
    };

    return (
      <div style={{ padding: 30 + 'px', borderTop: '1px solid lightgrey' }}>
        <Row>
          <Col>
            <Card style={{ padding: 15 + 'px' }}>
              <h3> Choose a Class </h3>
              <hr />
              Class Chosen:{' '}
              <b>
                {this.state.selectedClass ? this.state.selectedClass.name : ''}
              </b>
              <Button onClick={() => this.toggleClassCollapse()}>
                {' '}
                Choose Class{' '}
              </Button>
              <Collapse
                style={{ padding: 10 + 'px' }}
                isOpen={this.state.classCollapseOpen}
              >
                {/* List of all the classes generated here */}

                {classesLink.map((classLink, i) => {
                  return (
                    <ListGroup key={i}>
                      <ListGroupItem
                        action
                        onClick={() => {
                          this.setState({
                            selectedClass: classLink.value
                          });
                          this.toggleClassCollapse();
                        }}
                      >
                        <div style={checkboxStyle}>
                          <Input
                            type="checkbox"
                            onChange={() => {}}
                            checked={
                              this.state.selectedClass === classLink.value
                            }
                          />

                          <div>
                            <b>{classLink.at('name').value}</b>
                          </div>
                        </div>
                      </ListGroupItem>
                    </ListGroup>
                  );
                })}
              </Collapse>
            </Card>
          </Col>

          <Col>
            <Card style={{ padding: 15 + 'px' }}>
              <h3> Choose a Tutor </h3>
              <hr />
              Tutor Chosen:<b>
                {' '}
                {this.state.selectedTutor ? this.state.selectedTutor.name : ''}
              </b>
              <Button onClick={() => this.toggleTutorCollapse()}>
                {' '}
                Choose Tutor{' '}
              </Button>
              <Collapse
                style={{ padding: 10 + 'px' }}
                isOpen={this.state.tutorCollapseOpen}
              >
                {/* List of all the classes generated here */}

                {tutorsLink.map((tutorLink, i) => {
                  return (
                    <ListGroup key={i}>
                      <ListGroupItem
                        action
                        onClick={() => {
                          this.setState({
                            selectedTutor: tutorLink.value
                          });
                          this.toggleTutorCollapse();
                        }}
                      >
                        <div style={checkboxStyle}>
                          <Input
                            type="checkbox"
                            onChange={() => {}}
                            checked={
                              this.state.selectedTutor === tutorLink.value
                            }
                          />

                          <div>
                            <b>{tutorLink.at('name').value}</b>
                          </div>
                        </div>
                      </ListGroupItem>
                    </ListGroup>
                  );
                })}
              </Collapse>
            </Card>
          </Col>
        </Row>
        <div style={{ padding: 20 + 'px' }}>
          <Button color="primary" onClick={() => this.assignTutor()}>
            {' '}
            Assign Tutor{' '}
          </Button>
        </div>
      </div>
    );
  }
}
