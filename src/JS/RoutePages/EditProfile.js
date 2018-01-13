import { fire } from '../firebase.js';
import React, { Component } from 'react';
import {
  Button,
  Col,
  Input,
  Label,
  Row,
  Alert,
  Jumbotron,
  ButtonGroup,
  Collapse,
  Progress
} from 'reactstrap';
import Link from 'valuelink';

export default class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      school: '',
      profileUrl: '',
      bio: '',
      initials: '',
      photo: '',
      editInitials: false,
      uploadPhoto: false
    };
  }

  componentWillMount() {
    if (fire.auth().currentUser) {
      fire
        .database()
        .ref('/users/' + fire.auth().currentUser.uid)
        .once('value', snap => {
          let nameInit = snap.val().name;
          let school = snap.val().school;
          let profileUrl = snap.val().profileUrl;
          let bio = snap.val().bio;
          this.setState({
            name: nameInit,
            school: school,
            profileUrl: profileUrl,
            bio: bio,
            initials: fire
              .auth()
              .currentUser.displayName.substring(0, 2)
              .toUpperCase()
          });
        });
    }
  }

  save() {
    this.setState({
      saved: false
    });
    fire
      .database()
      .ref('/users/' + fire.auth().currentUser.uid)
      .update({
        name: this.state.name,
        school: this.state.school,
        profileUrl: this.state.profileUrl,
        bio: this.state.bio
      })
      .then(() => {
        // check for initials
        if (
          this.state.initials !==
          fire
            .auth()
            .currentUser.displayName.substring(0, 2)
            .toUpperCase()
        ) {
          if (this.state.initials.length === 2) {
            return fire.auth().currentUser.updateProfile({
              displayName: this.state.initials
            });
          }
        }
        return true;
      })
      .then(() => {
        // check for file upload
        if (this.state.photo) {
          this.uploadPhoto();
          return false;
        }
        return true;
      })
      .then(isDone => {
        if (isDone) {
          this.setState({
            saved: true
          });
        }
      });
  }

  uploadPhoto() {
    var random = Math.random() * 100000;
    var storageRef = fire
      .storage()
      .ref('profileImages/prof_' + this.state.photo + random);
    const file = document.querySelector('#imageFile').files[0];

    var uploadTask = storageRef.put(file);

    uploadTask.on(
      'state_changed',
      snapshot => this.progressMoniterCallback(snapshot),
      error => this.uploadError(error),
      () => this.uploadCompleteHandler(uploadTask.snapshot.downloadURL)
    );
  }

  progressMoniterCallback(snapshot) {
    var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
    this.setState({
      progress: progress
    });
  }

  uploadError(error) {}

  uploadCompleteHandler(url) {
    fire
      .database()
      .ref('/users/' + fire.auth().currentUser.uid)
      .update({
        profileUrl: url
      })
      .then(() => {
        this.setState({
          progress: null,
          saved: true,
          profileUrl: url,
          photo: ''
        });
      });
  }

  toggleInitials() {
    this.setState({
      editInitials: !this.state.editInitials,
      uploadPhoto: false
    });
  }
  toggleUploadPhoto() {
    this.setState({
      uploadPhoto: !this.state.uploadPhoto,
      editInitials: false
    });
  }

  render() {
    const nameLink = Link.state(this, 'name');
    const schoolLink = Link.state(this, 'school');
    const bioLink = Link.state(this, 'bio');
    const initialsLink = Link.state(this, 'initials').check(
      x => x.length === 2,
      'Initials must be 2 characters'
    );
    const photoLink = Link.state(this, 'photo');

    const photoInput = () => (
      <Input
        type="file"
        style={{ width: '30%' }}
        value={photoLink.value}
        onChange={e => {
          photoLink.set(e.target.value);
        }}
        accept="image/*"
        id="imageFile"
      />
    );

    const initialsInput = () => (
      <div>
        <Input
          type="text"
          style={{ width: '10%' }}
          value={initialsLink.value}
          onChange={e => {
            initialsLink.set(e.target.value);
          }}
        />
        <span style={{ color: 'red' }}>{initialsLink.error || ''}</span>
        <br />
      </div>
    );
    return (
      <div style={{ padding: 30 + 'px', textAlign: 'left' }}>
        <Jumbotron>
          <h1>Edit Profile</h1>
          <center>
            <div className="avatar">
              {this.state.profileUrl !== '' ? (
                <img src={this.state.profileUrl} alt="profile_img" />
              ) : (
                <div style={{ padding: '25px' }}>{this.state.initials}</div>
              )}
            </div>
            <ButtonGroup>
              <Button onClick={() => this.toggleInitials()}>
                {' '}
                Edit Initials{' '}
              </Button>
              <Button onClick={() => this.toggleUploadPhoto()}>
                {' '}
                Add Photo{' '}
              </Button>
            </ButtonGroup>
            <Collapse isOpen={this.state.editInitials}>
              {initialsInput()}
            </Collapse>
            <Collapse isOpen={this.state.uploadPhoto}>{photoInput()}</Collapse>
          </center>

          {this.state.progress ? (
            <Progress value={this.state.progress} />
          ) : null}
          <Row>
            <Col>
              <Label> Name: </Label>
              <Input
                type="text"
                value={nameLink.value}
                onChange={e => {
                  nameLink.set(e.target.value);
                }}
              />
            </Col>
            <Col>
              <Label> School: </Label>
              <Input
                type="text"
                value={schoolLink.value}
                onChange={e => {
                  schoolLink.set(e.target.value);
                }}
              />
            </Col>
          </Row>
          <Label>About: </Label>
          <Input
            type="textarea"
            value={bioLink.value}
            onChange={e => {
              bioLink.set(e.target.value);
            }}
          />
          <center style={{ padding: 10 + 'px' }}>
            <Button
              color="primary"
              //className="float-left"
              onClick={() => this.save()}
            >
              Save
            </Button>
          </center>
          {this.state.saved ? (
            <div
              className="float-right"
              style={{ width: 20 + '%', textAlign: 'center' }}
            >
              <Alert>Saved</Alert>
            </div>
          ) : null}
        </Jumbotron>
      </div>
    );
  }
}
