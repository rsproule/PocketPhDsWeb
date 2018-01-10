import React, { Component } from 'react';
//bootstrap
import {
  Button,
  Input,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import { fire } from '../firebase.js';
import Link from 'valuelink';

export default class ModuleModal extends Component {
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
          let questions = snap.val().quiz.questions;
          let subscriptionLevel = snap.val().subscriptionLevel;
          let id = snap.key;

          fire
            .database()
            .ref('users/' + fire.auth().currentUser.uid + '/subscriptionLevel')
            .once('value', snap => {
              let userSubLevel = snap.val();
              if (userSubLevel >= subscriptionLevel) {
                this.setState({
                  modules: this.state.modules.concat([
                    {
                      id: id,
                      name: name,
                      title: title,
                      description: description,
                      questionsCount: questions
                        ? Object.keys(questions).length
                        : 0,
                      selected: false
                    }
                  ])
                });
              }
            });
        });
      });
  }

  componentWillUnmount() {
    fire
      .database()
      .ref('/modules')
      .off();
    // fire.database().ref("classes/" + this.props.classId).off()
  }

  async assignModule(modulesLink) {
    var uploads = [];

    for (let m in modulesLink.value) {
      /*jshint loopfunc: true */

      if (modulesLink.value[m].selected) {
        var module = modulesLink.value[m];
        await fire
          .database()
          .ref('classes/' + this.props.classId) // eslint-disable-next-line
          .once('value', snap => {
            // eslint-disable-next-line
            let students = snap.val().students;
            for (let s in students) {
              var date = new Date();
              date.setDate(date.getDate() + 7);
              // eslint-disable-next-line

              uploads.push(
                fire
                  .database()
                  .ref('users/' + s + '/modules/' + module['id'])
                  .set({
                    name: module['name'],
                    title: module['title'],
                    description: module['description'],
                    videoWatched: false,
                    quizTaken: false,
                    questionCount: module['questionsCount'],
                    dueDate: Number(date)
                  })
              );
            }
          });
      }
    }

    Promise.all(uploads).then(() => {
      this.props.toggleModal();
      //window.location.reload()
    });
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
        <div style={{ padding: 10 + 'px' }}>
          Modules are restricted based on subscription. If you would like to
          access more modules, contact Pocket PhDs to increase your
          subscription.
          <br />
          <br />
          NOTE: If you assign a module that students have already worked on, it
          will reassign it with no progress due 1 week from when you click
          'Assign Modules' below.
        </div>
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
                      onChange={() => {}}
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
          <Button
            color="primary"
            onClick={() => this.assignModule(modulesLink)}
          >
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
