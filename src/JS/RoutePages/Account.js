import React, { Component } from 'react';
import { fire } from '../firebase.js';
import { Link } from 'react-router-dom';
import '../../CSS/account.css';
import ClassList from './ClassList.js';

import { Row, Col, Badge, Tooltip } from 'reactstrap';

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logout: false,
      unsubscribe: null,

      //user info
      name: 'Loading...',
      email: 'Loading...',
      type: null,
      school: false,
      profile_url: false,
      classes: {},

      //meta
      loaded: false,

      tooltipOpen: false,

      currentTab: ''
    };
  }

  logout() {
    fire
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        fire
          .database()
          .ref('users/' + fire.auth().currentUser.uid)
          .off();

        this.setState({
          logout: true
        });
      })
      .catch(function(error) {
        // An error happened.
        alert('Error Logging Out: ' + error.message);
      });
  }

  editProfile() {
    //reroute to the edit profile page
    this.setState({
      editProfile: true
    });
  }

  componentDidMount() {
    // we need this listener in case the local storage of the firebase instance is destroyed
    // while we are still on the user page and need to reroute back to secure place
    this.setState({
      unsubscribe: fire.auth().onAuthStateChanged(user => {
        if (user) {
          fire
            .database()
            .ref('users/' + fire.auth().currentUser.uid)
            .on('value', snap => {
              let name = snap.val().name;
              let email = snap.val().email;
              let schoolName = snap.val().school;
              let classes = snap.val().classes;
              let profile_url = snap.val().profileUrl;
              let bio = snap.val().bio;
              let type = snap.val().type;

              this.setState({
                name: name,
                email: email,
                school: schoolName,
                classes: classes,
                profile_url: profile_url,
                bio: bio,
                type: type,

                loaded: true
              });
            });

          // User is signed in.
          this.setState({
            logout: false
          });
        } else {
          // No user is signed in.
          this.setState({
            logout: true
          });
        }
      })
    });
  }

  componentWillUnmount() {
    // remove observer, no memory leaks
    this.state.unsubscribe();
    if (fire.auth().currentUser) {
      fire
        .database()
        .ref('users/' + fire.auth().currentUser.uid)
        .off();
    }
  }

  toggleTooltip() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  tabClicked(tab) {
    this.setState({
      currentTab: tab
    });
  }

  render() {
    // if(this.state.loaded) {
    //   if(this.state.type == 'student' || this.state.type == 'parent'){
    //     return (
    //       <div >
    //         <center>
    //           Pocket PhDs Web Version is not available for studen
    //         </center>
    //       </div>
    //     )
    //   }
    // }

    return (
      <div>
        {// need to make sure we have this guy before we do anything
        this.state.loaded ? (
          <div className="clearfix">
            <div className="header-account clearfix">
              <Row>
                <Col className="left-align">
                  <span className="avatar">
                    {this.state.profile_url ? (
                      <img src={this.state.profile_url} alt="profile_img" />
                    ) : (
                      <div style={{ padding: '25px' }}>
                        {fire
                          .auth()
                          .currentUser.displayName.substring(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                  </span>
                  <span className="display-name">{this.state.name}</span>
                  <br />
                  <b>E-mail: </b>
                  {this.state.email} &nbsp;
                  {fire.auth().currentUser.emailVerified ? (
                    <Badge color="success">Verified</Badge>
                  ) : (
                    <span>
                      <Badge color="danger" id="verify">
                        Email NOT Verified
                      </Badge>
                      <Tooltip
                        placement="right"
                        isOpen={this.state.tooltipOpen}
                        target="verify"
                        toggle={this.toggleTooltip.bind(this)}
                      >
                        Follow link in email to verify
                      </Tooltip>
                    </span>
                  )}
                </Col>

                <Col className="left-align">
                  <b>School: </b>
                  {this.state.school}
                  <br />
                  <br />
                  <b> Bio: </b> {this.state.bio}
                </Col>

                <Col className="right-align">
                  <div className="edit-info">
                    <Link to="/edit-profile" className="edit">
                      <img
                        src="https://image.flaticon.com/icons/png/512/7/7706.png"
                        alt="Edit PNG"
                        width="32"
                        height="32"
                      />
                      <br />
                      Edit Account Info
                    </Link>
                    <br />
                  </div>
                </Col>
              </Row>
            </div>
            {this.state.type === 'teacher' ? (
              <div>
                <div className="account-tabs">
                  <a className="activeTab">Classes</a>
                </div>
                <ClassList classes={this.state.classes} />
              </div>
            ) : null}

            {// Tutor version
            this.state.type === 'tutor' ? (
              <div>
                <div className="account-tabs">
                  <a className="activeTab">Chats</a>
                </div>

                <div>To chat use the mobile app.</div>
              </div>
            ) : null}
            {// Student or parent
            this.state.type === 'student' || this.state.type === 'parent' ? (
              <div>
                <div className="account-tabs">
                  <a className="activeTab">Classes</a>
                  <a>Chats</a>
                </div>

                <div>To chat use the mobile app.</div>
              </div>
            ) : null}

            {this.state.type === 'admin' ? (
              <div>
                <div className="account-tabs">
                  <Link
                    to="/account/add-tutor"
                    onClick={() => this.tabClicked('add-tutor')}
                    className={
                      this.state.currentTab === 'add-tutor' ? 'activeTab' : ''
                    }
                  >
                    Add Tutor
                  </Link>
                  <Link
                    to="/account/assign-tutor"
                    onClick={() => this.tabClicked('assign-tutor')}
                    className={
                      this.state.currentTab === 'assign-tutor'
                        ? 'activeTab'
                        : ''
                    }
                  >
                    Assign Tutor
                  </Link>
                  <Link
                    to="/account/create-module"
                    onClick={() => this.tabClicked('create-module')}
                    className={
                      this.state.currentTab === 'create-module'
                        ? 'activeTab'
                        : ''
                    }
                  >
                    {' '}
                    Create Module{' '}
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <center> Loading... </center>

            <div className="spacer" />
          </div>
        )}
      </div>
    );
  }
}
