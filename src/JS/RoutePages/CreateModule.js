import React, { Component } from 'react';
import '../../CSS/createModule.css';
import QuestionInput from './Question.js';
import { fire } from '../firebase.js';
//bootstrap
import {
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Progress
} from 'reactstrap';

import Link from 'valuelink';

export default class CreateModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldShowErrors: false,
      isSubmitting: false,

      subscriptionLevel: -1,
      name: '',
      title: '',
      description: '',
      video: '',
      questions: [
        {
          question: '',
          type: '',
          options: [{ option: '' }]
        }
      ]
    };
  }

  submitModule(nameLink, titleLink, descriptionLink, videoLink, questionsLink) {
    if (this.state.questions.length < 1) {
      this.addQuestion();
    }

    var formContainsErrors = false;
    questionsLink.map((q, i) => {
      const qLink = q.at('question').check(x => x, 'Question Required.');

      const typeLink = q.at('type').check(x => x, 'Question type is Required');

      const optionsLink = q.at('options').check(x => {
        switch (typeLink.value) {
          case '0': // multiple choice
            return x.length > 0;
          case '1': // select
            return x.length > 0;
          case '2':
            return true;
          default:
            return true;
        }
      }, 'Options are required');

      optionsLink.map((o, ind) => {
        const oLink = o.check(
          x => x || typeLink.value === '2',
          'Option Required'
        );

        formContainsErrors =
          qLink.error || typeLink.error || optionsLink.error || oLink.error;
        return formContainsErrors;
      });
      return formContainsErrors;
    });

    if (
      nameLink.error ||
      titleLink.error ||
      descriptionLink.error ||
      videoLink.error ||
      formContainsErrors
    ) {
      console.log(
        nameLink.error ||
          titleLink.error ||
          descriptionLink.error ||
          videoLink.error
      );
      this.setState({
        shouldShowErrors: true
      });
      return;
    }

    this.setState({
      uploadStarted: true,
      progress: 0
    });

    var storageRef = fire.storage().ref('moduleVideos/' + videoLink.value);
    const file = document.querySelector('#videoFile').files[0];

    var uploadTask = storageRef.put(file);

    uploadTask.on(
      'state_changed',
      snapshot => this.progressMoniterCallback(snapshot),
      error => this.uploadError(error),
      () => this.uploadCompleteHandler(uploadTask.snapshot.downloadURL)
    );
  }

  uploadError(error) {
    console.log('Error: ' + error);
  }

  progressMoniterCallback(snapshot) {
    var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
    this.setState({
      progress: progress
    });
  }

  uploadCompleteHandler(downloadURL) {
    //edit the database here
    fire
      .database()
      .ref('modules')
      .push({
        name: this.state.name,
        title: this.state.title,
        description: this.state.description,
        quiz: {
          questions: this.state.questions
        },
        video: downloadURL,
        subscriptionLevel: Number(this.state.subscriptionLevel)
      })
      .then(() => {
        window.location.reload();
      });
  }

  addQuestion() {
    this.setState({
      questions: this.state.questions.concat([
        {
          question: '',
          type: '',
          options: [{ option: '' }]
        }
      ])
    });
  }

  removeQuestion(idx) {
    this.setState({
      questions: this.state.questions.filter((s, sidx) => idx !== sidx)
    });
  }

  addOption(questionIndex) {
    // console.log(questionIndex);
    var newGuy = this.state.questions[questionIndex].options.concat([
      { option: '' }
    ]);
    var dummyState = { ...this.state };

    dummyState.questions[questionIndex].options = newGuy;

    this.setState(dummyState);
  }

  removeOption(questionIndex, optionIndex) {
    var newGuy = this.state.questions[questionIndex].options.filter(
      (s, sidx) => optionIndex !== sidx
    );
    var dummyState = { ...this.state };

    dummyState.questions[questionIndex].options = newGuy;
    this.setState(dummyState);
  }

  render() {
    const nameLink = Link.state(this, 'name').check(x => x, 'Name is required');
    const titleLink = Link.state(this, 'title').check(
      x => x,
      'Title is required'
    );
    const descriptionLink = Link.state(this, 'description').check(
      x => x,
      'Description is required'
    );
    const videoLink = Link.state(this, 'video').check(
      x => x,
      'A video must be provided.'
    );
    const questionsLink = Link.state(this, 'questions');
    const subscriptionLevelLink = Link.state(this, 'subscriptionLevel').check(
      x => x >= 0 && x <= 10,
      'Subscription Level must be in the range [0, 10]'
    );

    return (
      <div className="create-module-wrapper">
        <Form>
          <Card style={{ padding: 10 + 'px' }}>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="name"> Module Name: </Label>
                  <div className="error-message">
                    {this.state.shouldShowErrors ? nameLink.error || '' : ''}
                  </div>
                  <Input
                    value={nameLink.value}
                    onChange={e => {
                      nameLink.set(e.target.value);
                    }}
                    type="text"
                    id="name"
                    placeholder="Enter the module name. (ie Module 1)"
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="title"> Module Title: </Label>
                  <div className="error-message">
                    {this.state.shouldShowErrors ? titleLink.error || '' : ''}
                  </div>
                  <Input
                    value={titleLink.value}
                    onChange={e => {
                      titleLink.set(e.target.value);
                    }}
                    type="text"
                    id="title"
                    placeholder="Enter a module title. (ie Welcome to Pocket PhDs)"
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label for="description"> Module Description: </Label>
              <div className="error-message">
                {this.state.shouldShowErrors ? descriptionLink.error || '' : ''}
              </div>
              <Input
                value={descriptionLink.value}
                onChange={e => {
                  descriptionLink.set(e.target.value);
                }}
                type="textarea"
                id="description"
                placeholder="Enter a module description."
              />
            </FormGroup>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="video"> Module Video: </Label>
                  <div className="error-message">
                    {this.state.shouldShowErrors ? videoLink.error || '' : ''}
                  </div>
                  <Input
                    value={videoLink.value}
                    onChange={e => {
                      videoLink.set(e.target.value);
                    }}
                    type="file"
                    id="videoFile"
                    accept="video/*"
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="video"> Subscription Level: </Label>
                  <div className="error-message">
                    {this.state.shouldShowErrors
                      ? subscriptionLevelLink.error || ''
                      : ''}
                  </div>
                  <Input
                    value={subscriptionLevelLink.value}
                    onChange={e => {
                      subscriptionLevelLink.set(e.target.value);
                    }}
                    type="number"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Label> Questions: </Label>

            {questionsLink.map((questionLink, index) => {
              return (
                <QuestionInput
                  key={index}
                  questionLink={questionLink}
                  removeQuestion={optionIndex =>
                    this.removeQuestion(index, optionIndex)
                  }
                  shouldShowErrors={this.state.shouldShowErrors}
                  addOption={optionIndex => this.addOption(optionIndex)}
                  questionIndex={index}
                  removeOption={optionIndex =>
                    this.removeOption(index, optionIndex)
                  }
                />
              );
            })}
            <div className="add-class-button">
              <Button
                className="float-right"
                color="primary"
                onClick={() => this.addQuestion()}
              >
                {' '}
                Add Question{' '}
              </Button>
            </div>
          </Card>
          <div>
            <center>
              {this.state.uploadStarted ? (
                <div>
                  <div className="text-center">{this.state.progress}%</div>
                  <Progress value={this.state.progress} />
                </div>
              ) : (
                <Button
                  onClick={() =>
                    this.submitModule(
                      nameLink,
                      titleLink,
                      descriptionLink,
                      videoLink,
                      questionsLink
                    )
                  }
                  style={{ margin: 10 + 'px' }}
                  color="primary"
                >
                  Create Module
                </Button>
              )}
            </center>
          </div>
        </Form>
      </div>
    );
  }
}
