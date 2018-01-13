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
  Collapse,
  ListGroup,
  ListGroupItem,
  Progress,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';
import { Redirect } from 'react-router-dom';

import ModuleModal from './AssignModule.js';

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
        let className = snap.val().name;
        let teacherID = snap.val().teacher;
        let studentsSnap = snap.val().students;

        if (teacherID !== fire.auth().currentUser.uid) {
          this.setState({
            exit: true
          });
          alert('Not your class');
          //return;
        }

        this.setState({
          className: className,
          teacherID: teacherID
        });

        for (let s in studentsSnap) {
          fire
            .database()
            .ref('/users/' + s)
            .on('value', snapshot => {
              let name = snapshot.val().name;
              let modulesClasses = snapshot.val().modules;
              let notificationToken = snapshot.val().notificationToken;
              let email = snapshot.val().email;
              let classes = snapshot.val().classes;
              if (
                Object.keys(classes).indexOf(this.props.match.params.classid) >
                -1
              ) {
                var MODULES = [];
                var totalQuestions = 0;
                var totalAnswered = 0;
                for (let c in modulesClasses) {
                  if (c === this.props.match.params.classid) {
                    var modulesSnap = modulesClasses[c].modules;
                    for (let k in modulesSnap) {
                      var questionsAnsweredCount = 0;
                      let m = modulesSnap[k];
                      let description = m['description'];
                      let title = m['title'];
                      let name = m['name'];
                      let videoWatched = m['videoWatched'];
                      if (videoWatched) questionsAnsweredCount++;
                      let quizTaken = m['quizTaken'];
                      var responses = [];
                      var numQuestions = m['questionCount'];
                      for (let question in m['responses']) {
                        questionsAnsweredCount++;
                        responses.push({
                          question: question,
                          response: m['responses'][question]
                        });
                      }

                      let MODULE = {
                        name: name,
                        title: title,
                        description: description,
                        quizTaken: quizTaken,
                        videoWatched: videoWatched,
                        responses: responses
                      };
                      MODULES.push(MODULE);
                      totalAnswered += questionsAnsweredCount;
                      totalQuestions += numQuestions + 1; // plus on to account for video
                    }
                    let progress = totalAnswered / totalQuestions * 100.0;
                    let STUDENT = {
                      id: snapshot.key,
                      name: name,
                      progress: progress,
                      modules: MODULES,
                      email: email,
                      notificationToken: notificationToken
                    };
                    var students = this.state.students;
                    students[s] = STUDENT;

                    this.setState({
                      students: students
                    });
                  }
                }
              } else {
                students = this.state.students;
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
    if (this.state.exit) {
      return <Redirect to="/account" />;
    }

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
            classId={this.props.match.params.classid}
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

class StudentListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: false,
      dropdownOpen: false,
      nestedCollapse: {}
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

  toggleNested(index) {
    if (this.state.nestedCollapse[index]) {
      var dummyState = this.state;
      dummyState.nestedCollapse[index] = !this.state.nestedCollapse[index];
      this.setState(dummyState);
    } else {
      dummyState = this.state;
      dummyState.nestedCollapse[index] = true;
      this.setState(dummyState);
    }
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
                        {module.name + '   -   '}

                        {complete ? (
                          <Badge color="success"> Complete </Badge>
                        ) : (
                          <Badge color="danger"> Incomplete </Badge>
                        )}
                      </CardTitle>
                      <CardSubtitle>{module.title}</CardSubtitle>
                      <CardText>{module.description}</CardText>
                      <Button
                        disabled={!complete}
                        onClick={() => this.toggleNested(i)}
                        color="primary"
                      >
                        View Responses
                      </Button>
                      <Collapse
                        isOpen={
                          this.state.collapse && this.state.nestedCollapse[i]
                        }
                      >
                        {module.responses.map((resp, ind) => {
                          var response = resp.response;
                          if (
                            resp.response !== null &&
                            typeof resp.response === 'object'
                          ) {
                            var r = '';
                            for (let k in resp.response) {
                              if (resp.response[k]) {
                                r += k + ' ';
                              }
                            }
                            response = r;
                          }

                          return (
                            <div key={ind}>
                              {Number(resp.question) + 1 + ': ' + response}
                            </div>
                          );

                          //return (resp)
                        })}
                      </Collapse>
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
    if (student.notificationToken) {
      var URL = 'https://us-central1-pocket-phds.cloudfunctions.net/sendNudge';

      var xhttp = new XMLHttpRequest();

      xhttp.open('POST', URL, true);
      xhttp.setRequestHeader('Content-type', 'application/json');
      var data = JSON.stringify({ token: student.notificationToken });
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
          alert('Nudge Sent Successfully');
        }
      };
      xhttp.send(data);
    } else {
      alert('This user has not installed Pocket PhDs on a device.');
    }
  }

  function resendSetupEmail() {
    fire
      .auth()
      .sendPasswordResetEmail(student.email)
      .then(() => {
        alert('Sent E-mail to: ' + student.email);
      })
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
        alert('Student deleted');
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
