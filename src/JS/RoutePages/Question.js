import React, { Component } from 'react';
//bootstrap
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Jumbotron,
  Label,
  Row
} from 'reactstrap';

export default class QuestionInput extends Component {
  render() {
    const questionLink = this.props.questionLink
      .at('question')
      .check(x => x, 'Question Required.');

    const typeLink = this.props.questionLink
      .at('type')
      .check(x => x, 'Question type is Required');

    const optionsLink = this.props.questionLink.at('options').check(x => {
      switch (typeLink.value) {
        case '0': // multiple choice
          return x.length > 1;
        case '1': // select
          return x.length > 0;
        case '2':
          return true;
      }
    }, 'Options are required');

    return (
      <Card style={{ margin: 10 + 'px' }}>
        <h3>&nbsp; {this.props.questionIndex + 1}</h3>
        <div>
          <Button
            onClick={() => this.props.removeQuestion(this.props.questionIndex)}
            className="float-right"
            color="danger"
          >
            {' '}
            Delete Question{' '}
          </Button>
        </div>
        <div className="question-wrapper">
          <FormGroup>
            <Label for="question"> Question: </Label>
            <div className="error-message">
              {this.props.shouldShowErrors ? questionLink.error || '' : ''}
            </div>
            <Input
              value={questionLink.value}
              onChange={e => {
                questionLink.set(e.target.value);
              }}
              type="text"
              id="question"
              placeholder="What is the question?"
            />
          </FormGroup>

          <Label>Question Type: </Label>
          <FormGroup tag="radio" style={{ 'text-align': 'center' }}>
            <div className="error-message">
              {this.props.shouldShowErrors ? typeLink.error || '' : ''}
            </div>
            <Row>
              <Col>
                <FormGroup>
                  <Label check>
                    <Input
                      type="radio"
                      name="type"
                      onClick={() => {
                        typeLink.set('0');
                        this.setState();
                      }}
                      value="0"
                    />
                    Multiple Choice
                  </Label>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label check>
                    <Input
                      type="radio"
                      name="type"
                      onClick={() => {
                        typeLink.set('1');
                        this.setState();
                      }}
                      value="1"
                    />
                    Select
                  </Label>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label check>
                    <Input
                      type="radio"
                      name="type"
                      onClick={() => {
                        typeLink.set('2');
                        this.setState();
                      }}
                      value="2"
                    />
                    Free Response
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          </FormGroup>
          <div className="error-message">
            {this.props.shouldShowErrors ? optionsLink.error || '' : ''}
          </div>

          {typeLink.value !== '2'
            ? optionsLink.map((optionLink, index) => {
                const optionValueLink = optionLink
                  .at('option')
                  .check(
                    x => x || typeLink.value == '2',
                    "Option can't be blank"
                  );

                return (
                  <FormGroup key={index}>
                    <Label for="question">
                      {' '}
                      Option {index + 1}: &nbsp;&nbsp;
                      <div className="error-message">
                        {this.props.shouldShowErrors
                          ? optionValueLink.error || ''
                          : ''}
                      </div>
                    </Label>

                    <Input
                      value={optionValueLink.value}
                      onChange={e => {
                        optionValueLink.set(e.target.value);
                      }}
                      type="text"
                      id="question"
                      placeholder="Enter option"
                    />
                    <Button
                      className="float-right"
                      color="danger"
                      onClick={() => this.props.removeOption(index)}
                    >
                      Remove Option
                    </Button>
                  </FormGroup>
                );
              })
            : null}
          {typeLink.value !== '2' ? (
            <Button
              className="float"
              color="primary"
              onClick={() => this.props.addOption(this.props.questionIndex)}
            >
              Add Option
            </Button>
          ) : null}
        </div>
      </Card>
    );
  }
}
