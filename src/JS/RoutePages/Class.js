import '../../CSS/class.css';

import fire from '../firebase.js';
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
  Row
} from 'reactstrap';
import Link from 'valuelink';

export default class Class extends Component {
  componentWillMount() {
    this.setState({
      addModuleModalOpen: false,
      name: '',
      teacherID: '',
      students: []
    });

    // firebase listener init
    fire
      .database()
      .ref('/classes/' + this.props.match.params.classid)
      .on('value', snap => {
        let className = snap.val().name;
        let teacherID = snap.val().teacher;
        let studentsSnap = snap.val().students;

        for (let s in studentsSnap) {
          fire
            .database()
            .ref('/students/' + s)
            .on('value', snapshot => {
              var students = [];

              let name = snapshot.val().name;
              let modulesSnap = snapshot.val().modules;

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
                name: name,
                progress: progressPercentage,
                modules: MODULES
              };

              students.push(STUDENT);

              this.setState({
                className: className,
                teacherID: teacherID,
                students: students
              });
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
          {this.state.students.map((student, i) => {
            return (
              <StudentListItem
                key={i}
                student={student.name}
                progress={student.progress}
                modules={student.modules}
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
      collapse: false
    };
  }

  toggle() {
    this.setState({
      collapse: !this.state.collapse
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
          <b className="head">{this.props.student}</b>
          <br />
          {this.props.progress + '% Complete'}
          <Progress
            value={this.props.progress}
            color={
              this.props.progress > 85
                ? 'success'
                : this.props.progress < 40 ? 'danger' : 'warning'
            }
          />
        </ListGroupItem>
        <Collapse isOpen={this.state.collapse}>
          <Card>
            <CardBody>
              {this.props.modules.map((module, i) => {
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
