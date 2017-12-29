import '../../CSS/class.css';

import { fire } from '../firebase.js';
import React, { Component } from 'react';
//bootstrap
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Collapse,
  Container,
  Input,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  Row,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';
import Link from 'valuelink';

export default class Class extends Component {
  componentWillMount() {
    this.setState({
      addModuleModalOpen: false,
      name: '',
      teacherID: '',
      students: {},
      classId: this.props.match.params.classid
    });
    // firebase listener init
    fire
      .database()
      .ref('/classes/' + this.props.match.params.classid)
      .on('value', snap => {
        console.log('change');
        let className = snap.val().name;
        let teacherID = snap.val().teacher;
        let studentsSnap = snap.val().students;
        this.setState({
          className: className,
          teacherID: teacherID
        });

        for (let s in studentsSnap) {
          fire
            .database()
            .ref('/users/' + s)
            .on('value', snapshot => {
              console.log('stud change');
              let name = snapshot.val().name;
              let modulesSnap = snapshot.val().modules;
              let email = snapshot.val().email;
              let classes = snapshot.val().classes;
              if (
                Object.keys(classes).indexOf(this.props.match.params.classid) >
                -1
              ) {
                var MODULES = [];
                var progress = 0.0;
                var modCount = 0;
                for (let k in modulesSnap) {
                  let m = modulesSnap[k];
                  modCount += 2; // 2 becuase video and quiz
                  let description = m['description'];
                  let title = m['name'];
                  let videoWatched = m['videoWatched'];
                  let quizTaken = m['quizTaken'];
                  if (videoWatched) progress++;
                  if (quizTaken) progress++;
                  let MODULE = {
                    title: title,
                    description: description,
                    quizTaken: quizTaken,
                    videoWatched: videoWatched
                  };
                  MODULES.push(MODULE);
                }
                let progressPercentage = progress / modCount * 100.0;
                let STUDENT = {
                  id: snapshot.key,
                  name: name,
                  progress: progressPercentage,
                  modules: MODULES,
                  email: email
                };
                var students = this.state.students;
                students[s] = STUDENT;

                this.setState({
                  students: students
                });
              } else {
                var students = this.state.students;
                delete students[s];
                this.setState({
                  students: students
                });
              }
            });
        }
      });
  }

  componentWillUnmount() {
    fire
      .database()
      .ref('/classes/' + this.props.match.params.classid)
      .off();
    for (let s in this.state.students) {
      fire
        .database()
        .ref('/students/' + s.key)
        .off();
    }
  }

  toggleModal() {
    this.setState({
      addModuleModalOpen: !this.state.addModuleModalOpen
    });
  }

  sortName(a, b) {
    return a.name > b.name;
  }
  sortProgress(a, b) {
    return a.progress > b.progress;
  }

  render() {
    return (
      <div>
        <div className="class-header">
          <h3 className="float-left">
            {this.state.className + ' - ' + fire.auth().currentUser.displayName}
          </h3>

          <Button
            onClick={this.toggleModal.bind(this)}
            className="float-right clearfix"
            color="primary"
          >
            Assign Modules{' '}
          </Button>
          <ModuleModal
            addModuleModalOpen={this.state.addModuleModalOpen}
            toggleModal={this.toggleModal.bind(this)}
          />
        </div>

        <h4> Students: </h4>
        <ListGroup>
          {Object.values(this.state.students)
            .sort(this.sortName)
            .map((student, i) => {
              return (
                <StudentListItem
                  key={i}
                  student={student}
                  classId={this.state.classId}
                />
              );
            })}
        </ListGroup>
        <div className="spacer" />
      </div>
    );
  }
}

class ModuleModal extends Component {
  componentWillMount() {
    //create module observer

    this.setState({
      modules: []
    });

    fire
      .database()
      .ref('/modules')
      .once('value', snapList => {
        snapList.forEach(snap => {
          let name = snap.val().name;
          let title = snap.val().title;
          let description = snap.val().description;

          this.setState({
            modules: this.state.modules.concat([
              {
                name: name,
                title: title,
                description: description,
                selected: false
              }
            ])
          });
        });
      });
  }

  componentWillUnmount() {
    fire
      .database()
      .ref('/modules')
      .off();
  }

  render() {
    const modulesLink = Link.state(this, 'modules');

    return (
      <Modal
        isOpen={this.props.addModuleModalOpen}
        toggle={this.props.toggleModal}
      >
        <ModalHeader toggle={this.props.toggleModal}>
          Pocket PhD Modules
        </ModalHeader>
        <ModalBody>
          <ListGroup>
            {modulesLink.map((modLink, i) => {
              return (
                <ListGroupItem
                  key={i}
                  action
                  onClick={() => {
                    modLink.at('selected').set(!modLink.at('selected').value);
                  }}
                >
                  <div className="module">
                    <Input
                      type="checkbox"
                      checked={modLink.at('selected').value}
                    />

                    <div>
                      <b>{modLink.at('name').value}</b>
                      {' - ' + modLink.at('title').value}
                      <br />
                      {modLink.at('description').value}
                    </div>
                  </div>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.props.toggleModal}>
            Assign Modules
          </Button>{' '}
          <Button color="secondary" onClick={this.props.toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

class StudentListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: false,
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      collapse: !this.state.collapse
    });
  }

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    return (
      <div className="student-item">
        <ListGroupItem tag="a" action onClick={() => this.toggle()}>
          {this.state.collapse ? (
            <span className="float-right">
              Less Info
              <img
                alt="closed"
                width="25px"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/VisualEditor_-_Icon_-_Collapse.svg/1000px-VisualEditor_-_Icon_-_Collapse.svg.png"
              />
            </span>
          ) : (
            <span className="float-right">
              More Info
              <img
                className="flip-vertical float-right"
                alt="closed"
                width="25px"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/VisualEditor_-_Icon_-_Collapse.svg/1000px-VisualEditor_-_Icon_-_Collapse.svg.png"
              />
            </span>
          )}
          <b className="head">{this.props.student.name}</b>
          <br />
          {this.props.student.progress + '% Complete'}
          <Progress
            value={this.props.student.progress}
            color={
              this.props.student.progress > 85
                ? 'success'
                : this.props.student.progress < 40 ? 'danger' : 'warning'
            }
          />
        </ListGroupItem>
        <Collapse isOpen={this.state.collapse}>
          <Card>
            <CardBody>
              <div className="std-info-header">
                <h4>Modules:</h4>
                <div className="std-dropdown">
                  <StudentDropDown
                    toggle={() => this.toggleDropDown()}
                    isOpen={this.state.dropdownOpen}
                    class_id={this.props.classId}
                    student={this.props.student}
                  />
                </div>
              </div>
              {this.props.student.modules.map((module, i) => {
                let complete = module.videoWatched && module.quizTaken;

                return (
                  <Card key={i}>
                    <CardBody>
                      <CardTitle>
                        {module.title + '   -   '}

                        {complete ? (
                          <Badge color="success"> Complete </Badge>
                        ) : (
                          <Badge color="danger"> Incomplete </Badge>
                        )}
                      </CardTitle>
                      <CardSubtitle>{module.description}</CardSubtitle>
                      <CardText>
                        Here there will be a little more info about the module
                      </CardText>
                      <Button disabled={!complete} color="primary">
                        View Responses
                      </Button>
                    </CardBody>
                  </Card>
                );
              })}
              <br />
              {/*<Button color='danger' className="float-right"> Delete Student </Button>*/}
            </CardBody>
          </Card>
        </Collapse>
      </div>
    );
  }
}

var StudentDropDown = ({ isOpen, toggle, student, class_id }) => {
  function nudgeUser() {
    // TODO: Need to register the users on the app on sign in and then we can access
    //  those registration tokens to be able to send them notifications
  }

  function resendSetupEmail() {
    fire
      .auth()
      .sendPasswordResetEmail(student.email)
      .then(() => {})
      .catch(error => {
        alert(error);
      });
  }

  function removeStudent() {
    fire
      .database()
      .ref('/classes/' + class_id + '/students/' + student.id)
      .set(null)
      .then(() => {
        fire
          .database()
          .ref('/users/' + student.id + '/classes/' + class_id)
          .set(null);
      })
      .then(() => {
        this;
      });
  }

  return (
    <Dropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle caret>Actions</DropdownToggle>
      <DropdownMenu right>
        <DropdownItem onClick={nudgeUser}>Nudge User</DropdownItem>
        <DropdownItem onClick={resendSetupEmail}>
          Resend Account Setup E-mail
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={removeStudent} color="danger">
          Remove User from Class
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
