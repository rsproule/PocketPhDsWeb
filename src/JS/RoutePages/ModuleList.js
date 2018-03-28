import { fire } from '../firebase.js';
import React, { Component } from 'react';
import {
  Button,
  Collapse,
  Jumbotron,
  ListGroup,
  ListGroupItem
} from 'reactstrap';

export default class ModuleList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      collapse: {}
    };
  }

  componentWillMount() {
    this.setState({
      modules: {}
    });
    fire
      .database()
      .ref('/modules')
      .on('value', snap => {
        let modules = snap.val();

        for (let mod in modules) {
          var newMod = {
            name: modules[mod].name,
            title: modules[mod].title,
            description: modules[mod].description,
            subscriptionLevel: modules[mod].subscriptionLevel,
            video: modules[mod].video,
            quiz: modules[mod].quiz
          };

          var newModulesObject = this.state.modules;

          newModulesObject[mod] = newMod;

          this.setState({
            modules: newModulesObject,
            loaded: true
          });
        }
      });
  }

  componentWillUnmount() {
    // unhook listener here
    fire
      .database()
      .ref('modules')
      .off();
  }

  toggle(i) {
    let temp = this.state.collapse;
    temp[i] = !this.state.collapse[i];
    this.setState({
      collapse: temp
    });
  }

  deleteModule(key) {
    var confirmed = window.confirm(
      'Are you sure you want to delete ' + this.state.modules[key].name
    );
    if (confirmed) {
      fire
        .database()
        .ref('modules/' + key)
        .remove();
      var newModules = this.state.modules;
      delete newModules[key];
      this.setState({
        modules: newModules
      });
    }
  }

  render() {
    return (
      <div style={{ textAlign: 'left' }}>
        {this.state.loaded ? (
          <ListGroup>
            <ListGroupItem id="header">
              <h3> Pocket PhD's Modules </h3>
            </ListGroupItem>
            {Object.entries(this.state.modules).map(([k, m], i) => {
              return (
                <div key={i}>
                  <ListGroupItem onClick={() => this.toggle(i)} action>
                    <b>{m.name}</b> - {m.title}
                  </ListGroupItem>
                  <Collapse isOpen={this.state.collapse[i]}>
                    <div style={{ padding: 12 + 'px' }}>
                      <Jumbotron>
                        <h1 className="display-3">{m.name}</h1>
                        <p className="lead">
                          <b>Title:</b> {m.title}
                        </p>
                        <hr className="my-2" />
                        <p className="lead">
                          <b>Description:</b> {m.description}
                        </p>
                        <p className="lead">
                          <a href={m.video}> View Video</a>
                        </p>
                        <p className="lead">
                          Subscription Level: {m.subscriptionLevel}
                        </p>
                        <p className="lead">
                          Quiz:{' '}
                          {Object.values(m.quiz).map((q, ind) => {
                            return q.map((obj, i) => {
                              return (
                                <div style={{ padding: 28 + 'px' }}>
                                  <h5>{obj.question}</h5>
                                  {obj.options.map((o, oi) => {
                                    return o.option.length > 0 ? (
                                      <li style={{ paddingLeft: 25 + 'px' }}>
                                        {o.option}
                                      </li>
                                    ) : (
                                      '(Open Ended)'
                                    );
                                  })}
                                </div>
                              );
                            });
                            // return <p>{q}</p>
                          })}
                        </p>
                        <Button
                          onClick={() => this.deleteModule(k)}
                          style={{ float: 'right' }}
                          color="danger"
                        >
                          Delete
                        </Button>
                      </Jumbotron>
                    </div>
                  </Collapse>
                </div>
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
